import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const PRIMARY_COLOR = '#FF0049';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function BottomNavBar() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const currentRoute = route.name;

  const isActive = (routeName: string) => currentRoute === routeName;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem} 
        accessibilityLabel="Home"
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Ionicons name="home" size={24} color={isActive('HomeScreen') ? '#000' : '#666'} />
        <Text style={isActive('HomeScreen') ? styles.navLabel : styles.navLabelInactive}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('TimeScreen')}
      >
        <Image
          source={require('../../assets/logotempos.png')}
          style={[styles.customIcon, { tintColor: isActive('TimeScreen') ? '#000' : '#666' }]}
        />
        <Text style={isActive('TimeScreen') ? styles.navLabel : styles.navLabelInactive}>Tempos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('CalendarScreen')}
      >
        <Ionicons name="calendar-outline" size={24} color={isActive('CalendarScreen') ? '#000' : '#666'} />
        <Text style={isActive('CalendarScreen') ? styles.navLabel : styles.navLabelInactive}>Calendário</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => navigation.navigate('SubjectsScreen')}
      >
        <Ionicons name="person-outline" size={24} color={isActive('SubjectsScreen') ? '#000' : '#666'} />
        <Text style={isActive('SubjectsScreen') ? styles.navLabel : styles.navLabelInactive}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
    elevation: 2,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
    letterSpacing: 0.5,
  },

  navLabelInactive: {
    fontSize: 10,
    fontWeight: '500',
    color: '#999',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  customIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginBottom: 2,
    marginTop: 4,
  },
});

