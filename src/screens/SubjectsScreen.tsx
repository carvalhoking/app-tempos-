import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNavBar from '../components/BottomNavBar';
import { RootStackParamList } from '../navigation/AppNavigator';

const PRIMARY_COLOR = '#FF0049';

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  route?: keyof RootStackParamList;
  type?: 'logout';
};

export default function SubjectsScreen() {
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState<string>('Gustavo Carvalho');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // try to get user displayName from firebase auth
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser?.displayName) {
        setUserName(currentUser.displayName);
      }
    } catch (e) {
      // ignore if not configured
    }
  }, []);

  const menuItems: MenuItem[] = [
    { id: '1', label: 'Informações da conta', icon: 'person-outline', route: 'AccountInfo' },
    { id: '2', label: 'Sobre nós', icon: 'information-circle-outline', route: 'About' },
    { id: '3', label: 'Feedback', icon: 'chatbubble-outline', route: 'Feedback' },
    { id: '4', label: 'Política de Privacidade', icon: 'shield-outline', route: 'PrivacyPolicy' },
    { id: '5', label: 'Sair da conta', icon: 'log-out-outline', type: 'logout' },
  ];

  const handleMenuPress = async (item: MenuItem) => {
    if (item.type === 'logout') {
      Alert.alert(
        'Sair da conta',
        'Tem certeza que deseja sair da sua conta?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: async () => {
              try {
                const auth = getAuth();
                await auth.signOut();
              } catch (e) {
                // ignore logout errors for now
              }
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ]
      );
      return;
    }

    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Math.max(insets.top, 10) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + Math.max(insets.bottom, 10) }]}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.profileCardTitle}>Configuração do perfil</Text>
          
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={64} color="#999" />
          </View>
          
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.menuItem}
              android_ripple={{ color: '#eee' }}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={20} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          ))}
        </View>
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
  profileCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  profileCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

