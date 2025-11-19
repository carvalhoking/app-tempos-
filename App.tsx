import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { TasksProvider } from './src/context/TasksContext';
import { SubjectsProvider } from './src/context/SubjectsContext';

// Este arquivo é o ponto principal de navegação do app
export default function App() {
  return (
    <SubjectsProvider>
      <TasksProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TasksProvider>
    </SubjectsProvider>
  );
}
