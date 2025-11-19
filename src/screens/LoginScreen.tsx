import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const PRIMARY_COLOR = '#FF0049';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Atenção', 'Digite seu email para recuperar a senha.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      Alert.alert('Atenção', 'Por favor, insira um email válido.');
      return;
    }

    setResetLoading(true);

    try {
      console.log('Enviando email de recuperação para:', resetEmail);
      await sendPasswordResetEmail(auth, resetEmail, {
        url: 'https://tempos-9f627.firebaseapp.com',
        handleCodeInApp: false,
      });
      console.log('✅ Email de recuperação enviado com sucesso!');
      Alert.alert(
        'Email enviado!',
        'Enviamos um link de recuperação de senha para o seu email. Verifique sua caixa de entrada e a pasta de spam.',
        [
          {
            text: 'OK',
            onPress: () => {
              setForgotPasswordModalVisible(false);
              setResetEmail('');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Erro ao enviar email de recuperação:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      
      let errorMessage = 'Erro ao enviar email de recuperação. Tente novamente.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Email não encontrado. Verifique o email digitado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido. Verifique o email digitado.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.code === 'auth/missing-continue-uri') {
        errorMessage = 'Erro de configuração. Entre em contato com o suporte.';
      } else if (error.code === 'auth/invalid-continue-uri') {
        errorMessage = 'Erro de configuração. Entre em contato com o suporte.';
      } else {
        errorMessage = `Erro: ${error.message || error.code || 'Erro desconhecido'}`;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Atenção', 'Por favor, insira um email válido.');
      return;
    }

    setLoading(true);

    try {
      // Autenticação com Firebase
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login efetuado com sucesso!');
      navigation.navigate('HomeScreen');
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado. Verifique o email digitado.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta. Tente novamente.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido. Verifique o email digitado.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou senha incorretos. Tente novamente.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas falhas. Tente novamente mais tarde.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Math.max(insets.top, 10), paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.container}>

        {/* Título centralizado */}
        <Text style={styles.title}>Entrar</Text>

        {/* Campo de Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex gustavo@gmail.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Campo de Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Senha:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex Gul23#"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* Botão Entrar */}
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Link Esqueceu a Senha */}
        <TouchableOpacity 
          style={styles.forgotPasswordLink}
          onPress={() => {
            setResetEmail(email); // Preenche com o email já digitado
            setForgotPasswordModalVisible(true);
          }}
        >
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Link Cadastre-se */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Não tem conta?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Register')}
            >
              Cadastre-se
            </Text>
          </Text>
        </View>

      </View>

      {/* Modal Esqueceu a Senha */}
      <Modal
        visible={forgotPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setForgotPasswordModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar Senha</Text>
            <Text style={styles.modalSubtitle}>
              Digite seu email e enviaremos um link para redefinir sua senha.
            </Text>
            
            <View style={styles.modalInputContainer}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: gustavo@gmail.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={resetEmail}
                onChangeText={setResetEmail}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setForgotPasswordModalVisible(false);
                  setResetEmail('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSend, resetLoading && styles.modalButtonDisabled]}
                onPress={handleForgotPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonSendText}>Enviar</Text>
                )}
              </Pressable>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // ✅ Centralização vertical
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
    textAlign: 'center',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: '#fff',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    width: '80%',
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordLink: {
    marginTop: 15,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'underline',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#888',
  },
  link: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: '#fff',
  },
  modalInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F2F2F4',
  },
  modalButtonCancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonSend: {
    backgroundColor: PRIMARY_COLOR,
  },
  modalButtonSendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
});

export default LoginScreen;
