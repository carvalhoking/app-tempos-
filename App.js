import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

const PRIMARY_COLOR = '#FF0048';
const screenWidth = Dimensions.get('window').width - 60;

interface SubjectCard {
  id: number;
  title: string;
  progress: number;
  taskCount: number;
}

export default function HomeScreen() {
  // cards (quadrados de tarefas)
  const [cards, setCards] = useState<SubjectCard[]>([
    { id: 1, title: 'Matemática', progress: 40, taskCount: 2 },
    { id: 2, title: 'Inglês', progress: 70, taskCount: 3 },
  ]);

  const [editAddModalVisible, setEditAddModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SubjectCard | null>(null);
  const [cardTitleInput, setCardTitleInput] = useState('');

  const isEditing = !!selectedCard && editAddModalVisible;

  // abrir modal para criar novo quadrado de tarefa
  const handleOpenAddCard = () => {
    setSelectedCard(null);
    setCardTitleInput('');
    setEditAddModalVisible(true);
  };

  // salvar (novo ou edição)
  const handleSaveCard = () => {
    const title = cardTitleInput.trim();
    if (!title) return;

    if (selectedCard) {
      // edição
      setCards(prev =>
        prev.map(card =>
          card.id === selectedCard.id ? { ...card, title } : card
        )
      );
    } else {
      // novo card
      setCards(prev => [
        ...prev,
        {
          id: Date.now(),
          title,
          progress: 0,
          taskCount: 0,
        },
      ]);
    }

    setEditAddModalVisible(false);
    setSelectedCard(null);
    setCardTitleInput('');
  };

  // abrir opções (Editar / Remover)
  const handleOpenOptions = (card: SubjectCard) => {
    setSelectedCard(card);
    setOptionsModalVisible(true);
  };

  const handleRemoveCard = () => {
    if (!selectedCard) return;
    setCards(prev => prev.filter(card => card.id !== selectedCard.id));
    setSelectedCard(null);
    setOptionsModalVisible(false);
  };

  const handleEditFromOptions = () => {
    if (!selectedCard) return;
    setCardTitleInput(selectedCard.title);
    setOptionsModalVisible(false);
    setEditAddModalVisible(true);
  };

  // dados "vazios" do gráfico: barras iguais só pra compor visual
  const chartData = {
    labels: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
    datasets: [
      {
        data: [10, 10, 10, 10, 10, 10, 10], // placeholders
      },
    ],
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* HEADER - DATA + BOTÃO + */}
        <View style={styles.header}>
          <View style={styles.datePill}>
            <View style={styles.dateCircle}>
              <Text style={styles.dateDayNumber}>19</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.dateTodayText}>Hoje</Text>
              <Text style={styles.dateWeekday}>Terça-feira</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleOpenAddCard}
          >
            <Ionicons name="add" size={26} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>

        {/* TEXTOS DE BOAS-VINDAS */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcome}>Olá Gustavo,</Text>
          <Text style={styles.subtitle}>
            Explore o que separamos para você
          </Text>
        </View>

        {/* CARD GRÁFICO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Relatório semanal</Text>
          <BarChart
            data={chartData}
            width={screenWidth}
            height={180}
            fromZero
            withInnerLines={false}
            showBarTops={false}
            yAxisLabel=""
            yAxisSuffix=""
            withHorizontalLabels={false}
            chartConfig={{
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              barPercentage: 0.6,
              color: () => PRIMARY_COLOR, // cor sólida
              labelColor: () => '#777',
              fillShadowGradient: PRIMARY_COLOR,
              fillShadowGradientOpacity: 1,
              propsForBackgroundLines: {
                strokeWidth: 0,
              },
              propsForLabels: {
                fontFamily: 'Poppins-Bold',
              },
            }}
            style={styles.chart}
          />
        </View>

        {/* QUADRADOS DAS TAREFAS */}
        <View style={styles.subjectContainer}>
          {cards.map(card => (
            <View key={card.id} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Ionicons
                  name="book-outline"
                  size={24}
                  color={PRIMARY_COLOR}
                />
                <TouchableOpacity onPress={() => handleOpenOptions(card)}>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.subjectTitle}>{card.title}</Text>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${card.progress}%` },
                  ]}
                />
              </View>

              <View style={styles.subjectFooter}>
                <Text style={styles.badge}>
                  {card.taskCount} tarefas
                </Text>
                <Text style={styles.progressText}>
                  {card.progress}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL EDITAR / ADICIONAR QUADRADO */}
      <Modal
        transparent
        visible={editAddModalVisible}
        animationType="fade"
        onRequestClose={() => {
          setEditAddModalVisible(false);
          setSelectedCard(null);
          setCardTitleInput('');
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Editar tarefa' : 'Nova tarefa'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Ex: História"
              placeholderTextColor="#aaa"
              value={cardTitleInput}
              onChangeText={setCardTitleInput}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => {
                  setEditAddModalVisible(false);
                  setSelectedCard(null);
                  setCardTitleInput('');
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSaveCard}
              >
                <Text style={styles.modalButtonPrimaryText}>
                  {isEditing ? 'Salvar' : 'Adicionar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL OPÇÕES (EDITAR / REMOVER) */}
      <Modal
        transparent
        visible={optionsModalVisible}
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.optionsContent}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleEditFromOptions}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={PRIMARY_COLOR}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.optionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleRemoveCard}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#ff3b30"
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.optionText, { color: '#ff3b30' }]}>
                Remover
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { justifyContent: 'center' }]}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text style={styles.optionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* HEADER / DATA */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  dateCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDayNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  dateTodayText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  dateWeekday: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* TEXTOS INICIAIS */
  welcomeBox: {
    marginTop: 24,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
    fontFamily: 'Poppins',
  },

  /* CARD GRÁFICO */
  card: {
    backgroundColor: '#F5F5F7',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111',
    fontFamily: 'Poppins-Bold',
  },
  chart: {
    borderRadius: 16,
  },

  /* QUADRADOS DAS TAREFAS */
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  subjectCard: {
    backgroundColor: '#F2F2F4',
    width: '48%',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#222',
    fontFamily: 'Poppins-Bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 999,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 999,
  },
  subjectFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#FFE0EB',
    color: PRIMARY_COLOR,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    fontFamily: 'Poppins-Bold',
  },

  /* MODAIS */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
    fontFamily: 'Poppins-Bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButtonSecondary: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  modalButtonSecondaryText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins',
  },
  modalButtonPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: PRIMARY_COLOR,
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },

  optionsContent: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Poppins',
  },
});

