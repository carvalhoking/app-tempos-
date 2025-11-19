import React, { useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
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

type SubjectDetailRouteProp = RouteProp<RootStackParamList, 'SubjectDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'SubjectDetail'>;

type Task = {
  id: string;
  label: string;
  done: boolean;
};

type Resource = {
  id: string;
  label: string;
};

const SubjectDetailScreen = () => {
  const route = useRoute<SubjectDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const subjectId = route.params?.subjectId ?? '';
  const subjectName = route.params?.name ?? 'Matéria';
  const subjectIcon = route.params?.icon ?? 'book-outline';

  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState('');
  const [notes, setNotes] = useState('');

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks]
  );

  // Calculate progress percentage
  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks.length, completedTasks]);

  // Load tasks from Firestore
  useEffect(() => {
    if (!subjectId) return;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const subjectTasksRef = collection(db, 'subjectTasks');
    const q = query(subjectTasksRef, where('subjectId', '==', subjectId), where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedTasks: Task[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          loadedTasks.push({
            id: docSnapshot.id,
            label: data.label,
            done: data.done || false,
          });
        });
        setTasks(loadedTasks);
      },
      (error) => {
        console.error('Error loading subject tasks:', error);
      }
    );

    return () => unsubscribe();
  }, [subjectId]);

  // Update subject progress when tasks change
  useEffect(() => {
    if (!subjectId) return;

    const updateProgress = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const subjectRef = doc(db, 'subjects', subjectId);
        await updateDoc(subjectRef, {
          progress: progress,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating subject progress:', error);
      }
    };

    updateProgress();
  }, [progress, subjectId]);

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    setTopics((prev) => [...prev, newTopic.trim()]);
    setNewTopic('');
  };

  const handleRemoveTopic = (index: number) => {
    setTopics((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !subjectId) return;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      const subjectTasksRef = collection(db, 'subjectTasks');
      await addDoc(subjectTasksRef, {
        subjectId: subjectId,
        userId: currentUser.uid,
        label: newTask.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      });
      setNewTask('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!subjectId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const taskRef = doc(db, 'subjectTasks', taskId);
      await updateDoc(taskRef, {
        done: !task.done,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
      console.error('Error toggling task:', error);
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    if (!subjectId) return;

    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const taskRef = doc(db, 'subjectTasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a tarefa.');
      console.error('Error removing task:', error);
    }
  };

  const handleAddResource = () => {
    if (!newResource.trim()) return;
    setResources((prev) => [...prev, { id: Date.now().toString(), label: newResource.trim() }]);
    setNewResource('');
  };

  const handleRemoveResource = (resourceId: string) => {
    setResources((prev) => prev.filter((resource) => resource.id !== resourceId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <View style={styles.heroIconWrapper}>
            <Ionicons name={subjectIcon as keyof typeof Ionicons.glyphMap} size={30} color="#111" />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroLabel}>Planejamento</Text>
            <Text style={styles.heroTitle}>{subjectName}</Text>
            <Text style={styles.heroSubtitle}>
              Crie conteúdos, tarefas e materiais de apoio para esta matéria.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Conteúdos</Text>
            <Text style={styles.sectionHint}>{topics.length} itens</Text>
          </View>
          {topics.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum conteúdo cadastrado.</Text>
          ) : (
            topics.map((topic, index) => (
              <View key={`${topic}-${index}`} style={styles.topicRow}>
                <Text style={styles.topicText}>{topic}</Text>
                <TouchableOpacity onPress={() => handleRemoveTopic(index)}>
                  <Ionicons name="close" size={18} color="#999" />
                </TouchableOpacity>
              </View>
            ))
          )}
          <View style={styles.formRow}>
            <TextInput
              placeholder="Novo conteúdo / módulo"
              placeholderTextColor="#999"
              value={newTopic}
              onChangeText={setNewTopic}
              style={styles.input}
            />
            <TouchableOpacity style={styles.iconButton} onPress={handleAddTopic}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tarefas</Text>
            <Text style={styles.sectionHint}>
              {completedTasks}/{tasks.length} feitas
            </Text>
          </View>
          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>Adicione ações para manter a matéria em dia.</Text>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskRow, task.done && styles.taskRowDone]}
                onPress={() => toggleTask(task.id)}
              >
                <Ionicons
                  name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={task.done ? PRIMARY : '#b3b3b3'}
                />
                <Text style={[styles.taskText, task.done && styles.taskTextDone]}>{task.label}</Text>
                <TouchableOpacity onPress={() => handleRemoveTask(task.id)}>
                  <Ionicons name="trash-outline" size={18} color="#bbb" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
          <View style={styles.formRow}>
            <TextInput
              placeholder="Ex: revisar capítulo 3"
              placeholderTextColor="#999"
              value={newTask}
              onChangeText={setNewTask}
              style={styles.input}
            />
            <TouchableOpacity style={styles.iconButton} onPress={handleAddTask}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Materiais úteis</Text>
            <Text style={styles.sectionHint}>{resources.length} itens</Text>
          </View>
          {resources.length === 0 ? (
            <Text style={styles.emptyText}>Salve listas, links ou referências importantes.</Text>
          ) : (
            resources.map((resource) => (
              <View key={resource.id} style={styles.resourceRow}>
                <Ionicons name="link-outline" size={18} color={PRIMARY} />
                <Text style={styles.resourceText}>{resource.label}</Text>
                <TouchableOpacity onPress={() => handleRemoveResource(resource.id)}>
                  <Ionicons name="close" size={18} color="#999" />
                </TouchableOpacity>
              </View>
            ))
          )}
          <View style={styles.formRow}>
            <TextInput
              placeholder="Cole um link ou anotação curta"
              placeholderTextColor="#999"
              value={newResource}
              onChangeText={setNewResource}
              style={styles.input}
            />
            <TouchableOpacity style={styles.iconButton} onPress={handleAddResource}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anotações gerais</Text>
          <TextInput
            placeholder="Registre insights, dúvidas ou pontos para próxima aula."
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            style={styles.notesInput}
            multiline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PRIMARY = '#FF0049';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: {
    color: '#111',
    fontWeight: '600',
  },
  hero: {
    flexDirection: 'row',
    backgroundColor: '#FFF3F6',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  heroIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  heroInfo: {
    flex: 1,
  },
  heroLabel: {
    color: '#FF7FA5',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
    color: '#111',
  },
  heroSubtitle: {
    color: '#6D6D75',
    marginTop: 6,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  sectionHint: {
    color: '#8A8A96',
    fontSize: 12,
  },
  emptyText: {
    color: '#A4A4B0',
    marginBottom: 12,
  },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  topicText: {
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E4E5EC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  taskRowDone: {
    opacity: 0.6,
  },
  taskText: {
    flex: 1,
    color: '#111',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  resourceText: {
    flex: 1,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E4E5EC',
    borderRadius: 16,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#111',
  },
});

export default SubjectDetailScreen;

