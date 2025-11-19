import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  Platform,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import BottomNavBar from '../components/BottomNavBar';
import { useSubjects, Subject } from '../context/SubjectsContext';

const PRIMARY_COLOR = '#FF0049';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { subjects, addSubject, updateSubject, deleteSubject: deleteSubjectFromContext } = useSubjects();

  const [userName, setUserName] = useState<string>('Usuário');

  // Header date
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [weekday, setWeekday] = useState<string>('');
  const [monthLabel, setMonthLabel] = useState<string>('');
  const [monthIndex, setMonthIndex] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // UI states
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [inputText, setInputText] = useState('');

  // Animations
  const calendarAnim = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const weekDaysShort = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const weekDaysFull = [
    'Segunda-feira','Terça-feira','Quarta-feira',
    'Quinta-feira','Sexta-feira','Sábado','Domingo'
  ];

  useEffect(() => {
    const d = new Date();
    setSelectedDay(d.getDate());
    setWeekday(weekDaysFull[(d.getDay() + 6) % 7]);
    setMonthIndex(d.getMonth());
    setYear(d.getFullYear());
    setMonthLabel(getMonthLabel(d.getMonth(), d.getFullYear()));

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser?.displayName) {
        const firstName = currentUser.displayName.split(' ')[0];
        setUserName(firstName);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    Animated.timing(calendarAnim, {
      toValue: calendarVisible ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(chevronAnim, {
      toValue: calendarVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [calendarVisible]);

  const toggleCalendar = () => {
    setCalendarVisible(v => !v);
  };

  function getMonthLabel(m: number, y: number) {
    const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return `${months[m]} ${y}`;
  }

  const changeMonth = (delta: number) => {
    let newMonth = monthIndex + delta;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear = year - 1; }
    if (newMonth > 11) { newMonth = 0; newYear = year + 1; }
    setMonthIndex(newMonth);
    setYear(newYear);
    setMonthLabel(getMonthLabel(newMonth, newYear));
  };

  const createGridDays = () => {
    const firstOfMonth = new Date(year, monthIndex, 1);
    const lastOfMonth = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastOfMonth.getDate();

    const firstWeekdayIndex = (firstOfMonth.getDay() + 6) % 7;
    const prevMonthLast = new Date(year, monthIndex, 0);
    const prevMonthDays = prevMonthLast.getDate();

    const grid: Array<{ key: string; day: number; inCurrentMonth: boolean; dateObj: Date }> = [];

    for (let i = firstWeekdayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const dateObj = new Date(year, monthIndex - 1, dayNum);
      grid.push({ key: `p-${dayNum}`, day: dayNum, inCurrentMonth: false, dateObj });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, monthIndex, d);
      grid.push({ key: `c-${d}`, day: d, inCurrentMonth: true, dateObj });
    }

    let nextDay = 1;
    while (grid.length % 7 !== 0) {
      const dateObj = new Date(year, monthIndex + 1, nextDay);
      grid.push({ key: `n-${nextDay}`, day: nextDay, inCurrentMonth: false, dateObj });
      nextDay++;
    }

    return grid;
  };

  const onSelectDay = (dateObj: Date, inCurrentMonth: boolean) => {
    setSelectedDay(dateObj.getDate());
    setMonthIndex(dateObj.getMonth());
    setYear(dateObj.getFullYear());
    setMonthLabel(getMonthLabel(dateObj.getMonth(), dateObj.getFullYear()));
    setWeekday(weekDaysFull[(dateObj.getDay() + 6) % 7]);

    setTimeout(() => setCalendarVisible(false), 120);
  };

  const renderGridDay = ({ item }: any) => {
    const dayNum = item.day;
    const inCurrent = item.inCurrentMonth;
    const dateObj: Date = item.dateObj;

    const today = new Date();
    const isToday = (dateObj.getDate() === today.getDate()
      && dateObj.getMonth() === today.getMonth()
      && dateObj.getFullYear() === today.getFullYear());

    const isSelected = (selectedDay === dateObj.getDate()
      && monthIndex === dateObj.getMonth()
      && year === dateObj.getFullYear());

    return (
      <TouchableOpacity
        onPress={() => onSelectDay(dateObj, inCurrent)}
        style={[
          styles.gridDay,
          isSelected && styles.gridDaySelected,
          isToday && styles.gridDayToday,
          !inCurrent && styles.gridDayFaded
        ]}
        activeOpacity={0.85}
      >
        <Text style={[styles.gridDayText, isSelected && { color: '#fff' }, !inCurrent && styles.gridDayTextFaded]}>
          {dayNum}
        </Text>
      </TouchableOpacity>
    );
  };

  const openAddModal = () => {
    setEditingSubject(null);
    setInputText('');
    setModalVisible(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setInputText(subject.name);
    setModalVisible(true);
  };

  const saveSubject = async () => {
    const nameTrim = inputText.trim();
    if (!nameTrim) {
      Alert.alert('Atenção', 'Digite o nome da matéria.');
      return;
    }

    try {
      if (editingSubject) {
        await updateSubject({
          ...editingSubject,
          name: nameTrim,
        });
      } else {
        await addSubject({
          name: nameTrim,
          progress: 0,
          icon: 'book-outline',
          description: 'Nova matéria adicionada'
        });
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a matéria. Tente novamente.');
      console.error('Error saving subject:', error);
    }
  };

  const deleteSubject = () => {
    if (!editingSubject) return;
    Alert.alert('Remover', `Deseja remover ${editingSubject.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        try {
          await deleteSubjectFromContext(editingSubject.id);
          setModalVisible(false);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível remover a matéria. Tente novamente.');
          console.error('Error deleting subject:', error);
        }
      }}
    ]);
  };

  const grid = createGridDays();
  const translateY = calendarAnim.interpolate({ inputRange: [0,1], outputRange: [18, 0] });
  const backdropOpacity = calendarAnim.interpolate({ inputRange: [0,1], outputRange: [0, 0.42] });
  const chevronRotate = chevronAnim.interpolate({ inputRange: [0,1], outputRange: ['0rad', `${Math.PI}rad`] });

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Math.max(insets.top, 10) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerRow}>
        <View style={styles.dayCircle}>
          <Text style={styles.dayNumber}>{selectedDay ? String(selectedDay).padStart(2,'0') : '--'}</Text>
        </View>

        <View style={styles.dayTextBlock}>
          <Text style={styles.todayText}>Hoje</Text>

          <TouchableOpacity
            style={styles.weekdayRow}
            onPress={toggleCalendar}
            accessibilityRole="button"
            accessibilityLabel="Abrir calendário"
          >
            <Text style={styles.weekdayText}>{weekday}</Text>
            <Animated.View style={{ transform: [{ rotate: chevronRotate }], marginLeft: 6 }}>
              <Ionicons
                name={'chevron-down'}
                size={16}
                color={PRIMARY_COLOR}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {calendarVisible && (
        <View style={styles.overlayRoot} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.overlayCalendar,
              { transform: [{ translateY }], opacity: calendarAnim }
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthNavBtn}>
                <Ionicons name="chevron-back" size={20} color="#333" />
              </TouchableOpacity>

              <Text style={styles.calendarMonthLabel}>{monthLabel}</Text>

              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthNavBtn}>
                <Ionicons name="chevron-forward" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekdayLabels}>
              {weekDaysShort.map((wd) => (
                <View key={wd} style={styles.weekdayLabelItem}>
                  <Text style={styles.weekdayLabelText}>{wd}</Text>
                </View>
              ))}
            </View>

            <FlatList
              data={grid}
              keyExtractor={(item) => item.key}
              renderItem={renderGridDay}
              numColumns={7}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + Math.max(insets.bottom, 10) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeTextBold}>Olá {userName},</Text>
          <Text style={styles.welcomeText}>Explore o que separamos para você</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          
          <View style={styles.bannerCard}>
            <Image 
              source={require('../../assets/Banner home.png')} 
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.subjectsHeader}>
            <Text style={styles.sectionTitle}>Matérias em destaque</Text>
            <Text style={styles.sectionHintHome}>Crie suas matérias para acompanhar aqui.</Text>
          </View>

          <View style={styles.subjectsContainer}>
            {subjects.map((item) => (
              <Pressable
                key={item.id}
                style={styles.subjectCard}
                onPress={() => Alert.alert(item.name, `Progresso: ${item.progress}%`) }
                android_ripple={{ color: '#eee' }}
              >
                <View style={styles.subjectTopRow}>
                  <View style={styles.iconBox}>
                    <Ionicons name={item.icon as any} size={18} color="#222" />
                  </View>

                  <TouchableOpacity
                    style={styles.optionsButton}
                    onPress={() => openEditModal(item)}>
                    <Ionicons name="ellipsis-vertical" size={18} color="#777" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.subjectNameBold}>{item.name}</Text>

                <View style={styles.progressBarBackground}>
                  <View
                    style={[styles.progressBarFill, { width: `${item.progress}%` }]}
                  />
                </View>
              </Pressable>
            ))}
          </View>

          {subjects.length === 0 && (
            <View style={styles.subjectsEmpty}>
              <Ionicons name="book-outline" size={32} color="#B0B0B8" />
              <Text style={styles.subjectsEmptyText}>
                Nenhuma matéria ainda. Toque em “+” para começar.
              </Text>
            </View>
          )}
        </View>
        
        
      </ScrollView>

      <BottomNavBar />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingSubject ? 'Editar matéria' : 'Nova matéria'}</Text>

            <TextInput
              placeholder="Nome da matéria"
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
            />

            <View style={styles.modalActions}>
              {editingSubject && (
                <Pressable style={[styles.modalBtn, { backgroundColor: '#f5f5f5' }]} onPress={deleteSubject}>
                  <Text style={{ color: '#d33' }}>Remover</Text>
                </Pressable>
              )}

              <View style={{ flex: 1 }} />

              <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#333' }}>Cancelar</Text>
              </Pressable>

              <Pressable style={[styles.modalBtn, { backgroundColor: PRIMARY_COLOR }]} onPress={saveSubject}>
                <Text style={{ color: '#fff' }}>{editingSubject ? 'Salvar' : 'Adicionar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 6,
  },

  dayCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center', alignItems: 'center'
  },
  dayNumber: { fontSize: 16, fontWeight: '700' },

  dayTextBlock: { marginLeft: 12 },
  todayText: { fontSize: 12, color: '#999' },
  weekdayRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  weekdayText: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_COLOR
  },

  calendarContainer: {
    overflow: 'hidden',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  calendarMonthLabel: { fontWeight: '700', fontSize: 14 },
  monthNavBtn: { padding: 6 },

  weekdayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 6,
    paddingVertical: 4
  },
  weekdayLabelItem: {
    width: (WINDOW_WIDTH - 64) / 7,
    alignItems: 'center'
  },
  weekdayLabelText: { fontSize: 11, fontWeight: '700', color: '#666' },

  gridDay: {
    width: (WINDOW_WIDTH - 64) / 7,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 2,
    backgroundColor: 'transparent'
  },
  gridDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222'
  },
  gridDayFaded: {
    opacity: 0.35
  },
  gridDayTextFaded: {
    color: '#222'
  },
  gridDaySelected: {
    backgroundColor: PRIMARY_COLOR,
    width: (WINDOW_WIDTH - 64) / 7 - 6,
    height: 36,
    borderRadius: 18,
  },
  gridDayToday: {
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    width: (WINDOW_WIDTH - 64) / 7 - 6,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },

  addButton: {
    marginLeft: 'auto',
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeBox: { paddingHorizontal: 20, marginTop: 6 },
  welcomeTextBold: { fontSize: 24, fontWeight: '700' },
  welcomeText: { fontSize: 26, color: '#444', fontWeight: '600', lineHeight: 32 },

  mainContent: { paddingHorizontal: 20, paddingTop: 8 },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bannerCard: {
    width: '100%', 
    aspectRatio: 800 / 1200,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },

  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectsHeader: {
    marginBottom: 12,
  },
  sectionHintHome: {
    fontSize: 12,
    color: '#777',
  },
  subjectCard: {
    width: '48%', 
    backgroundColor: '#F6F6F6',
    borderRadius: 12, 
    padding: 12,
    marginBottom: 12,
  },
  subjectsEmpty: {
    borderWidth: 1,
    borderColor: '#E4E4ED',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 6,
  },
  subjectsEmptyText: {
    color: '#7A7A85',
    marginTop: 8,
    textAlign: 'center',
  },

  subjectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconBox: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  optionsButton: { padding: 4 },

  subjectNameBold: {
    marginTop: 10, fontSize: 14,
    fontWeight: '700',
  },
  progressBarBackground: {
    width: '100%', height: 6,
    backgroundColor: '#DDD',
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8
  },


  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontWeight: '700', fontSize: 16, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  modalActions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 8,
    backgroundColor: '#f2f2f2'
  },

  overlayRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000'
  },
  overlayCalendar: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 14,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    alignSelf: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },



  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '22%',
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
  },

  quoteContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },

  activitiesContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});