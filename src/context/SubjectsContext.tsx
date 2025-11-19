import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// Define the unified Subject type
export type Subject = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  progress: number; // from 0 to 100
};

// Define the shape of the context
interface SubjectsContextType {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
  loading: boolean;
}

// Create the context
const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

// Create a provider component
export const SubjectsProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Load subjects from Firestore when user is authenticated
  useEffect(() => {
    const auth = getAuth();
    let unsubscribeSnapshot: (() => void) | null = null;
    
    // Listen for auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      // Cleanup previous snapshot listener if exists
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!currentUser) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Set up real-time listener for subjects
      const subjectsRef = collection(db, 'subjects');
      const q = query(subjectsRef, where('userId', '==', currentUser.uid));

      unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const loadedSubjects: Subject[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            loadedSubjects.push({
              id: docSnapshot.id,
              name: data.name,
              icon: data.icon,
              description: data.description || '',
              progress: data.progress || 0,
            });
          });
          setSubjects(loadedSubjects);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading subjects:', error);
          setLoading(false);
        }
      );
    });

    // Cleanup both listeners on unmount
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const addSubject = async (subjectData: Omit<Subject, 'id'>) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      const subjectsRef = collection(db, 'subjects');
      await addDoc(subjectsRef, {
        ...subjectData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      // The real-time listener will update the state automatically
    } catch (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
  };

  const updateSubject = async (updatedSubject: Subject) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      const subjectRef = doc(db, 'subjects', updatedSubject.id);
      await updateDoc(subjectRef, {
        name: updatedSubject.name,
        icon: updatedSubject.icon,
        description: updatedSubject.description,
        progress: updatedSubject.progress,
        updatedAt: new Date().toISOString(),
      });
      // The real-time listener will update the state automatically
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  };

  const deleteSubject = async (subjectId: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      const subjectRef = doc(db, 'subjects', subjectId);
      await deleteDoc(subjectRef);
      // The real-time listener will update the state automatically
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  };

  const value = {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    loading,
  };

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
};

// Create a custom hook for using the context
export const useSubjects = () => {
  const context = useContext(SubjectsContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectsProvider');
  }
  return context;
};
