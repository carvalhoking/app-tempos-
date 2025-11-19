import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSubjects, Subject } from '../context/SubjectsContext';

const PRIMARY = '#FF0049';
const CARD_BG = '#F4F4F6';
const TITLE = '#151515';
const SUBTITLE = '#5C5C63';
const ICON_OPTIONS: Array<keyof typeof Ionicons.glyphMap> = [
  'book-outline',
  'flask-outline',
  'planet-outline',
  'earth-outline',
  'calculator-outline',
  'chatbubble-ellipses-outline',
  'school-outline',
  'color-palette-outline',
  'musical-notes-outline',
  'leaf-outline',
  'code-slash-outline',
  'desktop-outline',
];

type NavigationProp = StackNavigationProp<RootStackParamList, 'TimeScreen'>;

const TimeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjects();
  const [search, setSearch] = useState('');

  // Add form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState<keyof typeof Ionicons.glyphMap>('book-outline');

  // Edit form state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState<keyof typeof Ionicons.glyphMap>('book-outline');

  const filteredSubjects = useMemo(
    () =>
      subjects.filter((subject) =>
        subject.name.toLowerCase().includes((search || '').toLowerCase())
      ),
    [subjects, search]
  );

  const handleAddSubject = async () => {
    if (!newName.trim()) {
      return;
    }
    try {
      await addSubject({
        name: newName.trim(),
        icon: newIcon,
        description: newDescription.trim() || 'Conteúdo personalizado',
        progress: 0,
      });
      setNewName('');
      setNewDescription('');
      setNewIcon('book-outline');
      setIsAdding(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a matéria. Tente novamente.');
      console.error('Error adding subject:', error);
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditDescription(subject.description);
    setEditIcon(subject.icon);
    setIsEditModalVisible(true);
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject || !editName.trim()) {
      return;
    }
    try {
      await updateSubject({
        ...editingSubject,
        name: editName.trim(),
        description: editDescription.trim(),
        icon: editIcon,
      });
      setIsEditModalVisible(false);
      setEditingSubject(null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a matéria. Tente novamente.');
      console.error('Error updating subject:', error);
    }
  };

  const handleDeleteSubject = () => {
    if (!editingSubject) return;
    Alert.alert(
      'Remover Matéria',
      `Você tem certeza que quer remover "${editingSubject.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSubject(editingSubject.id);
              setIsEditModalVisible(false);
              setEditingSubject(null);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover a matéria. Tente novamente.');
              console.error('Error deleting subject:', error);
            }
          },
        },
      ]
    );
  };

  const handleSubjectPress = (subject: Subject) => {
    navigation.navigate('SubjectDetail', {
      subjectId: subject.id,
      name: subject.name,
      icon: subject.icon,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Math.max(insets.top, 10) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matérias</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.orderButton}>
          <Ionicons name="chevron-down" size={16} color={SUBTITLE} />
          <Text style={styles.orderText}>Ordenar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding((prev) => !prev)}>
          <Ionicons name={isAdding ? 'close' : 'add'} size={20} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      {isAdding && (
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Adicionar matéria</Text>
          <TextInput
            placeholder="Nome da matéria"
            placeholderTextColor={SUBTITLE}
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <TextInput
            placeholder="Descrição / objetivo"
            placeholderTextColor={SUBTITLE}
            value={newDescription}
            onChangeText={setNewDescription}
            style={[styles.input, styles.inputMultiline]}
            multiline
          />
          <Text style={styles.label}>Ícone sugerido</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconPicker}>
            {ICON_OPTIONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  newIcon === icon && styles.iconOptionActive,
                ]}
                onPress={() => setNewIcon(icon)}
              >
                <Ionicons
                  name={icon}
                  size={20}
                  color={newIcon === icon ? '#fff' : PRIMARY}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddSubject}>
            <Text style={styles.primaryButtonText}>Salvar matéria</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={SUBTITLE} />
        <TextInput
          placeholder="Buscar matéria"
          placeholderTextColor={SUBTITLE}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={[styles.listContent, { paddingBottom: 120 + Math.max(insets.bottom, 10) }]} showsVerticalScrollIndicator={false}>
        {filteredSubjects.map((subject) => (
          <Pressable
            key={subject.id}
            style={styles.card}
            onPress={() => handleSubjectPress(subject)}
          >
            <View style={styles.cardIconWrapper}>
              <Ionicons name={subject.icon} size={26} color={TITLE} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{subject.name}</Text>
              <Text style={styles.cardSubtitle}>{subject.description}</Text>
            </View>
            <TouchableOpacity style={styles.optionsButton} onPress={() => openEditModal(subject)}>
              <Ionicons name="ellipsis-vertical" size={20} color={SUBTITLE} />
            </TouchableOpacity>
          </Pressable>
        ))}

        {filteredSubjects.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={32} color={SUBTITLE} />
            <Text style={styles.emptyText}>Nenhuma matéria encontrada.</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar />

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.addCard}>
            <Text style={styles.addTitle}>Editar Matéria</Text>
            <TextInput
              placeholder="Nome da matéria"
              placeholderTextColor={SUBTITLE}
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição / objetivo"
              placeholderTextColor={SUBTITLE}
              value={editDescription}
              onChangeText={setEditDescription}
              style={[styles.input, styles.inputMultiline]}
              multiline
            />
            <Text style={styles.label}>Ícone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconPicker}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    editIcon === icon && styles.iconOptionActive,
                  ]}
                  onPress={() => setEditIcon(icon)}
                >
                  <Ionicons
                    name={icon}
                    size={20}
                    color={editIcon === icon ? '#fff' : PRIMARY}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSubject}>
                <Text style={styles.deleteButtonText}>Remover</Text>
              </TouchableOpacity>
              <View style={{flex: 1}} />
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateSubject}>
                <Text style={styles.primaryButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E6EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TITLE,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderText: {
    color: SUBTITLE,
    fontSize: 14,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E6EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECECF2',
  },
  addTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: TITLE,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: SUBTITLE,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E6EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: TITLE,
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  iconPicker: {
    marginBottom: 16,
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconOptionActive: {
    backgroundColor: PRIMARY,
  },
  primaryButton: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E6EB',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: TITLE,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECECF2',
  },
  cardIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: CARD_BG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TITLE,
  },
  cardSubtitle: {
    color: SUBTITLE,
    marginTop: 4,
  },
  optionsButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: '#ECECF2',
    borderRadius: 18,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 8,
    color: SUBTITLE,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: '#FEE',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#F44',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#EEE',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '700',
  },
});

export default TimeScreen;