import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InitialScreen from '../screens/InitialScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TimeScreen from '../screens/TimeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import AccountInfoScreen from '../screens/AccountInfoScreen';
import AboutScreen from '../screens/AboutScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import SubjectDetailScreen from '../screens/SubjectDetailScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

export type RootStackParamList = {
  Initial: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  HomeScreen: undefined;
  TimeScreen: undefined;
  CalendarScreen: undefined;
  SubjectsScreen: undefined;
  AccountInfo: undefined;
  About: undefined;
  Feedback: undefined;
  PrivacyPolicy: undefined;
  SubjectDetail: { subjectId: string; name: string; icon: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Initial"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Initial" component={InitialScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TimeScreen" component={TimeScreen} />
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="SubjectsScreen" component={SubjectsScreen} />
      <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
