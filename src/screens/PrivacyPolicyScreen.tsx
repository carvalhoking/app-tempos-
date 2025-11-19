import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Política de Privacidade</Text>
        <Text style={styles.body}>
        A privacidade dos nossos usuários é uma prioridade no TEMPOS. Coletamos apenas os dados essenciais para o funcionamento do aplicativo, como nome, e-mail e informações relacionadas aos seus hábitos de estudo. Essas informações são utilizadas exclusivamente para personalizar sua experiência, permitir o acompanhamento do seu progresso, salvar suas tarefas e manter suas configurações sincronizadas. Não coletamos dados desnecessários e jamais vendemos ou compartilhamos suas informações pessoais com terceiros sem sua permissão. Além disso, utilizamos medidas de segurança adequadas para proteger seus dados contra acessos não autorizados, uso indevido ou qualquer forma de risco.
        </Text>
        <Text style={styles.body}>
        Ao utilizar o TEMPOS, você concorda com esta Política de Privacidade e com o uso das informações conforme descrito. Caso haja mudanças relevantes, notificaremos você diretamente no aplicativo para que possa revisar e decidir sobre as atualizações. Você também pode solicitar a exclusão da sua conta e de todos os seus dados a qualquer momento, garantindo total controle sobre suas informações. Nosso compromisso é oferecer uma experiência segura, transparente e confiável, para que você possa se concentrar no que realmente importa: seus estudos.
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

export default PrivacyPolicyScreen;

