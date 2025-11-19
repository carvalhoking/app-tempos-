import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Text, Easing } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import logo from '../../assets/logo_tela_carregamento.png'; // ✅ caminho correto para seu caso

type InitialScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Initial'>;

interface Props {
  navigation: InitialScreenNavigationProp;
}

const InitialScreen: React.FC<Props> = ({ navigation }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotation]);

  const spinnerRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      <Animated.View style={[styles.loaderWrapper, { transform: [{ rotate: spinnerRotation }] }]}>
        <View style={styles.loaderRing} />
      </Animated.View>
      <Text style={styles.footer}>© 2025 TEMPOS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0049',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 250,
    height: 250,
    marginBottom: 80,
  },
  loaderWrapper: {
    marginTop: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderRing: {
    width: 56,
    height: 56,
    borderWidth: 8,
    borderRadius: 28,
    borderColor: '#FF5F7D',
    borderTopColor: '#000',
    backgroundColor: 'transparent',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#000',
    fontSize: 12,
  },
});

export default InitialScreen;
