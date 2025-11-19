import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// Define the Task type, based on CalendarEvent
export type Task = {
  id: string;
  day: number;
  month: number;
  year: number;
  time?: string;
  title: string;
  completed?: boolean;
};

// Define the shape of the context
interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompleted: (taskId: string) => Promise<void>;
  loading: boolean;
}

// Create the context
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Create a provider component
export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from Firestore when user is authenticated
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
        setTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Set up real-time listener for tasks
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('userId', '==', currentUser.uid));

      unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const loadedTasks: Task[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            loadedTasks.push({
              id: docSnapshot.id,
              day: data.day,
              month: data.month,
              year: data.year,
              time: data.time || '',
              title: data.title,
              completed: data.completed || false,
            });
          });
          setTasks(loadedTasks);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading tasks:', error);
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

  const addTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      const tasksRef = collection(db, 'tasks');
      await addDoc(tasksRef, {
        ...taskData,
        completed: false,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      // The real-time listener will update the state automatically
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (updatedTask: Task) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', updatedTask.id);
      await updateDoc(taskRef, {
        day: updatedTask.day,
        month: updatedTask.month,
        year: updatedTask.year,
        time: updatedTask.time || '',
        title: updatedTask.title,
        completed: updatedTask.completed || false,
        updatedAt: new Date().toISOString(),
      });
      // The real-time listener will update the state automatically
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      // The real-time listener will update the state automatically
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskCompleted = async (taskId: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      console.error('Task not found');
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !task.completed,
        updatedAt: new Date().toISOString(),
      });
      // The real-time listener will update the state automatically
    } catch (error) {
      console.error('Error toggling task completed:', error);
      throw error;
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    loading,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

// Create a custom hook for using the context
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
