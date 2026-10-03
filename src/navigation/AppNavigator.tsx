// ============================================================
// Navigation Stack
// ============================================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../components/ui';
import { RootStackParamList } from './types';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import LanguageScreen from '../screens/LanguageScreen';
import HomeScreen from '../screens/HomeScreen';
import ScamCheckerScreen from '../screens/ScamCheckerScreen';
import URLCheckerScreen from '../screens/URLCheckerScreen';
import AnalysisResultScreen from '../screens/AnalysisResultScreen';
import IncidentResponseScreen from '../screens/IncidentResponseScreen';
import ReportFraudScreen from '../screens/ReportFraudScreen';
import CommunityAlertsScreen from '../screens/CommunityAlertsScreen';
import RelatedFraudScreen from '../screens/RelatedFraudScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HelpScreen from '../screens/HelpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '800' as const, letterSpacing: 0.5 },
  headerBackTitle: '',
  contentStyle: { backgroundColor: colors.bg },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={screenOptions}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{ title: 'Verify OTP' }}
        />
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScamChecker"
          component={ScamCheckerScreen}
          options={{ title: 'Check Message' }}
        />
        <Stack.Screen
          name="URLChecker"
          component={URLCheckerScreen}
          options={{ title: 'Check URL' }}
        />
        <Stack.Screen
          name="AnalysisResult"
          component={AnalysisResultScreen}
          options={{ title: 'Analysis Result' }}
        />
        <Stack.Screen
          name="IncidentResponse"
          component={IncidentResponseScreen}
          options={{ title: 'What Happened?' }}
        />
        <Stack.Screen
          name="ReportFraud"
          component={ReportFraudScreen}
          options={{ title: 'Report Fraud' }}
        />
        <Stack.Screen
          name="CommunityAlerts"
          component={CommunityAlertsScreen}
          options={{ title: 'Community Alerts' }}
        />
        <Stack.Screen
          name="RelatedFraud"
          component={RelatedFraudScreen}
          options={{ title: 'Related Fraud' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: 'Help & Reporting' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
