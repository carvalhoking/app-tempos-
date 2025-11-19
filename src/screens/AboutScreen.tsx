import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sobre o Tempos</Text>
        <Text style={styles.body}>
        O TEMPOS foi criado para quem quer estudar de forma mais inteligente, organizada e consistente. A gente sabe que não é fácil conciliar rotina, matérias, tarefas e ainda manter a motivação lá em cima — e é exatamente por isso que o nosso app existe. Ele reúne ferramentas simples e intuitivas que ajudam você a planejar seus horários, acompanhar seu desempenho, revisar conteúdos e transformar o estudo em um hábito real, não só uma tentativa. Aqui, cada detalhe foi pensado para facilitar a sua vida: desde o planejamento diário até o controle do seu progresso, tudo funciona de um jeito leve e direto, para você perder menos tempo se organizando e usar esse tempo para realmente aprender.
        </Text>
        <Text style={styles.body}>
        Mais do que um aplicativo, o TEMPOS é um parceiro de jornada. Nosso objetivo é apoiar você no caminho do conhecimento, oferecendo recursos que se adaptam à sua rotina, às suas metas e ao seu ritmo. Acreditamos que estudar não precisa ser pesado, confuso ou desmotivador — e por isso trabalhamos para trazer uma experiência cada vez mais completa, humana e eficiente. Estamos sempre evoluindo, ouvindo nossos usuários, testando novas ideias e melhorando o que já existe, porque queremos que você se sinta acompanhado do início ao fim da sua trajetória. No TEMPOS, aprender é mais do que uma tarefa: é uma construção diária, e nós estamos aqui para caminhar com você.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
});

export default AboutScreen;

