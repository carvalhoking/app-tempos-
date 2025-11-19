import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#FF0049';

const FeedbackScreen = () => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva seu feedback antes de enviar.');
      return;
    }

    setLoading(true);

    try {
      // Criar FormData para enviar ao FormSquash
      const formData = new FormData();
      formData.append('message', message.trim());

      const response = await fetch('https://formsquash.io/f/TV1SltdEGuZJPqpt5SAI', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        Alert.alert(
          'Sucesso!',
          'Seu feedback foi enviado com sucesso. Obrigado pela sua contribuição!',
          [
            {
              text: 'OK',
              onPress: () => setMessage(''),
            },
          ]
        );
      } else {
        throw new Error('Erro ao enviar feedback');
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível enviar seu feedback. Por favor, tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Envie um feedback</Text>
          <Text style={styles.subtitle}>Conte como podemos melhorar sua experiência</Text>
          <TextInput
            style={styles.input}
            placeholder="Escreva aqui..."
            placeholderTextColor="#999"
            multiline
            value={message}
            onChangeText={setMessage}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default FeedbackScreen;

