import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';

const AccountInfoScreen = () => {
  const [displayName, setDisplayName] = useState<string>('Usuário');
  const [email, setEmail] = useState<string>('carregando...');

  useEffect(() => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        setDisplayName(currentUser.displayName || 'Usuário');
        setEmail(currentUser.email || 'E-mail não disponível');
      } else {
        setEmail('Nenhum usuário autenticado');
      }
    } catch (error) {
      setEmail('Não foi possível carregar o email');
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Informações da conta</Text>
        <Text style={styles.headerSubtitle}>Dados associados ao seu perfil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{displayName}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>Plano atual</Text>
        <Text style={styles.value}>Gratuito</Text>
      </ScrollView>
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
});

export default AccountInfoScreen;

