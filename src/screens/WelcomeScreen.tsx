import React, { useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Animated, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import logo from '../../assets/logo_tela_carregamento.png';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: NavigationProp;
}

const PRIMARY = '#FF0049';
const SCREEN_HEIGHT = Dimensions.get('window').height;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} translucent={false} />
      <View style={styles.topSection} />
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Animated.View
        style={[
          styles.bottomCard,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Bem-Vindo!</Text>
        <Text style={styles.subtitle}>Ao TEMPOS, organização na palma da sua mão.</Text>

        <View style={styles.buttonsColumn}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  topSection: {
    flex: 1,
    backgroundColor: PRIMARY,
    width: '100%',
  },
  logo: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.38 - 110,
    alignSelf: 'center',
    width: 220,
    height: 220,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.33,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B76',
    marginBottom: 24,
  },
  buttonsColumn: {
    width: '100%',
    gap: 14,
  },
  button: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: PRIMARY,
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F4',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default WelcomeScreen;

