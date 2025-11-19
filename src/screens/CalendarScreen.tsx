import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useTasks, Task } from '../context/TasksContext';

const PRIMARY_COLOR = '#FF0049';
const WINDOW_WIDTH = Dimensions.get('window').width;

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompleted } = useTasks();

  const today = new Date();
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [monthIndex, setMonthIndex] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [inputTitle, setInputTitle] = useState('');
  const [inputDay, setInputDay] = useState('');
  const [inputTime, setInputTime] = useState('');

  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const weekDaysShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const createGridDays = () => {
    const firstOfMonth = new Date(year, monthIndex, 1);
    const lastOfMonth = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastOfMonth.getDate();
    const firstWeekdayIndex = firstOfMonth.getDay();
    const prevMonthLast = new Date(year, monthIndex, 0);
    const prevMonthDays = prevMonthLast.getDate();

    const grid: Array<{ key: string; day: number; inCurrentMonth: boolean }> = [];

    for (let i = firstWeekdayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      grid.push({ key: `p-${dayNum}`, day: dayNum, inCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({ key: `c-${d}`, day: d, inCurrentMonth: true });
    }

    let nextDay = 1;
    while (grid.length % 7 !== 0) {
      grid.push({ key: `n-${nextDay}`, day: nextDay, inCurrentMonth: false });
      nextDay++;
    }

    return grid;
  };

  const changeMonth = (delta: number) => {
    let newMonth = monthIndex + delta;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear = year - 1; }
    if (newMonth > 11) { newMonth = 0; newYear = year + 1; }
    setMonthIndex(newMonth);
    setYear(newYear);
  };

  const prevMonth = months[(monthIndex - 1 + 12) % 12];
  const currentMonth = months[monthIndex];
  const nextMonth = months[(monthIndex + 1) % 12];

  const grid = createGridDays();

  const dayEvents = tasks.filter(e => e.day === selectedDay && e.month === monthIndex && e.year === year);
  const monthEvents = tasks.filter(e => e.month === monthIndex && e.year === year);

  const eventsCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((event) => {
      const key = `${event.year}-${event.month}-${event.day}`;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const isPastDate = (day: number, month: number, yearValue: number) => {
    const target = new Date(yearValue, month, day);
    target.setHours(23, 59, 59, 999);
    return target < todayStart;
  };

  const selectedDateIsPast = isPastDate(selectedDay, monthIndex, year);

  const openAddModal = () => {
    setEditingTask(null);
    setInputTitle('');
    setInputDay(String(selectedDay));
    setInputTime('');
    setModalVisible(true);
  };

  const handleAddPress = () => {
    if (selectedDateIsPast) {
      Alert.alert('Dia passado', 'Não é possível adicionar tarefas para dias que já passaram.');
      return;
    }
    openAddModal();
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert('Remover tarefa', 'Deseja remover esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(eventId);
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível remover a tarefa. Tente novamente.');
            console.error('Error deleting task:', error);
          }
        },
      },
    ]);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setInputTitle(task.title);
    setInputDay(String(task.day));
    setInputTime(task.time || '');
    setModalVisible(true);
  };

  const saveTask = async () => {
    const titleTrim = inputTitle.trim();
    if (!titleTrim) {
      Alert.alert('Atenção', 'Digite o título da tarefa.');
      return;
    }

    const dayNum = parseInt(inputDay);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      Alert.alert('Atenção', 'Digite um dia válido (1-31).');
      return;
    }

    if (!inputTime.trim()) {
      Alert.alert('Atenção', 'Digite o horário da tarefa.');
      return;
    }

    try {
      if (editingTask) {
        await updateTask({
          ...editingTask,
          title: titleTrim,
          day: dayNum,
          month: monthIndex,
          year: year,
          time: inputTime.trim(),
        });
      } else {
        await addTask({
          day: dayNum,
          month: monthIndex,
          year: year,
          title: titleTrim,
          time: inputTime.trim(),
        });
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa. Tente novamente.');
      console.error('Error saving task:', error);
    }
  };

  const deleteCurrentTask = () => {
    if (!editingTask) return;
    Alert.alert('Remover', `Deseja remover ${editingTask.title}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        try {
          await deleteTask(editingTask.id);
          setModalVisible(false);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível remover a tarefa. Tente novamente.');
          console.error('Error deleting task:', error);
        }
      }}
    ]);
  };

  const handleToggleTaskCompleted = async (taskId: string) => {
    try {
      await toggleTaskCompleted(taskId);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa. Tente novamente.');
      console.error('Error toggling task:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Math.max(insets.top, 10) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + Math.max(insets.bottom, 10) }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendário</Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={styles.monthNavText}>{prevMonth}</Text>
            </TouchableOpacity>
            <Text style={styles.monthNavCurrent}>{currentMonth} {year}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Text style={styles.monthNavText}>{nextMonth}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysRow}>
            {weekDaysShort.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {grid.map((item) => {
              const isSelected = item.inCurrentMonth && item.day === selectedDay;
              const eventCount = item.inCurrentMonth ? eventsCountMap[`${year}-${monthIndex}-${item.day}`] || 0 : 0;
              const hasEvents = eventCount > 0;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.dayCell, !item.inCurrentMonth && styles.dayCellFaded]}
                  onPress={() => item.inCurrentMonth && setSelectedDay(item.day)}
                >
                  <View
                    style={[
                      styles.dayInner,
                      hasEvents && styles.dayInnerHasEvent,
                      isSelected && styles.dayInnerSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !item.inCurrentMonth && styles.dayTextFaded,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {item.day}
                    </Text>
                    {hasEvents && (
                      <Text style={[styles.dayCount, isSelected && styles.dayCountSelected]}>
                        {eventCount}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.eventsContainer}>
          <TouchableOpacity
            style={[
              styles.addEventButton,
              selectedDateIsPast && styles.addEventButtonDisabled,
            ]}
            onPress={handleAddPress}
            activeOpacity={selectedDateIsPast ? 1 : 0.7}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addEventText}>Adicionar Tarefa</Text>
          </TouchableOpacity>

          <View style={styles.eventsSection}>
            <View style={styles.dayHeader}>
              <Text style={styles.sectionTitle}>Horários do dia</Text>
              <Text style={styles.sectionHint}>
                {selectedDay
                  ? new Date(year, monthIndex, selectedDay).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                    })
                  : 'Selecione um dia'}
              </Text>
            </View>
            {dayEvents.length === 0 ? (
              <View style={styles.emptyDay}>
                <Ionicons name="time-outline" size={26} color="#B0B0B0" />
                <Text style={styles.emptyDayText}>Nenhuma tarefa para este dia.</Text>
              </View>
            ) : (
              dayEvents
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                .map((event) => (
                  <View key={event.id} style={styles.eventItem}>
                    <View style={styles.eventDot} />
                    <Text style={[styles.eventText, event.completed && styles.eventTextCompleted]}>
                      <Text style={styles.eventTime}>{event.time} </Text>
                      {event.title}
                    </Text>
                    <View style={styles.eventActions}>
                      <TouchableOpacity onPress={() => handleToggleTaskCompleted(event.id)}>
                        <Ionicons
                          name={event.completed ? 'checkmark-circle' : 'ellipse-outline'}
                          size={20}
                          color={event.completed ? PRIMARY_COLOR : '#B0B0B0'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openEditModal(event)}>
                        <Ionicons name="create-outline" size={20} color="#777" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteEvent(event.id)}>
                        <Ionicons name="trash-outline" size={20} color="#d33" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
            )}
          </View>

          {monthEvents.length > 0 && (
            <View style={styles.eventsSection}>
              {monthEvents
                .sort((a, b) => a.day - b.day)
                .map((event, index, array) => {
                  const nextEvent = array[index + 1];
                  const hasConnection = nextEvent && nextEvent.day > event.day;
                  return (
                    <Pressable
                      key={event.id}
                      style={styles.datedEventContainer}
                      onPress={() => handleToggleTaskCompleted(event.id)}
                      onLongPress={() => openEditModal(event)}
                    >
                      <View style={styles.datedEventLeft}>
                        <Text style={styles.datedEventDay}>{event.day}</Text>
                        {hasConnection && <View style={styles.dateConnector} />}
                      </View>
                      <View style={styles.datedEventRight}>
                        <Text style={[styles.datedEventText, event.completed && styles.eventTextCompleted]}>
                          {event.title}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
            </View>
          )}
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </Text>

            <TextInput
                placeholder="Título da tarefa"
                style={styles.input}
                value={inputTitle}
                onChangeText={setInputTitle}
              placeholderTextColor="#555"
              />

            <TextInput
                placeholder="Dia (1-31)"
                style={styles.input}
                value={inputDay}
                onChangeText={setInputDay}
                keyboardType="numeric"
              placeholderTextColor="#555"
              />

            <TextInput
              placeholder="Horário (HH:MM)"
              style={styles.input}
              value={inputTime}
              onChangeText={(value) => {
                const digits = value.replace(/\D/g, '').slice(0, 4);
                let formatted = digits;
                if (digits.length >= 3) {
                  formatted = `${digits.slice(0, 2)}:${digits.slice(2)}`;
                }
                setInputTime(formatted);
              }}
              keyboardType="numeric"
              placeholderTextColor="#555"
              maxLength={5}
            />

              <View style={styles.modalActions}>
                {editingTask && (
                  <Pressable style={[styles.modalBtn, { backgroundColor: '#f5f5f5' }]} onPress={deleteCurrentTask}>
                    <Text style={{ color: '#d33' }}>Remover</Text>
                  </Pressable>
                )}

                <View style={{ flex: 1 }} />

                <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#333' }}>Cancelar</Text>
                </Pressable>

                <Pressable style={[styles.modalBtn, { backgroundColor: PRIMARY_COLOR }]} onPress={saveTask}>
                  <Text style={{ color: '#fff' }}>{editingTask ? 'Salvar' : 'Adicionar'}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  calendarCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthNavText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  monthNavCurrent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDayCell: {
    width: (WINDOW_WIDTH - 72) / 7,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (WINDOW_WIDTH - 72) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellFaded: {
    opacity: 0.4,
  },
  dayInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInnerSelected: {
    backgroundColor: PRIMARY_COLOR,
  },
  dayInnerHasEvent: {
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  dayTextFaded: {
    color: '#999',
  },
  dayTextSelected: {
    color: '#fff',
  },
  dayCount: {
    fontSize: 10,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  dayCountSelected: {
    color: '#fff',
  },
  eventsContainer: {
    paddingBottom: 20,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  addEventButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  addEventText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  eventsSection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9A9A9A',
  },
  emptyDay: {
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 12,
  },
  emptyDayText: {
    color: '#9A9A9A',
    marginTop: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_COLOR,
    marginRight: 12,
  },
  eventText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  eventTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  eventTime: {
    fontWeight: '600',
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datedEventContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  datedEventLeft: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  datedEventDay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  dateConnector: {
    width: 2,
    height: 40,
    backgroundColor: '#D0D0D0',
    marginTop: 4,
    marginBottom: -4,
  },
  datedEventRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  datedEventText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    paddingTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 8,
    backgroundColor: '#f2f2f2',
  },
});