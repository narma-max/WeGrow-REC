// ============================================================
// Screen: Splash
// ============================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../components/ui';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  const { isLoading, isAuthenticated, session } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && session) {
      // Check if language has been chosen
      if (!session.preferred_language) {
        navigation.replace('Language');
      } else {
        navigation.replace('Home');
      }
    } else {
      navigation.replace('Login');
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>WE GROW</Text>
        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>FRAUD INTELLIGENCE PLATFORM</Text>
          <View style={styles.taglineLine} />
        </View>
      </View>

      <Text style={styles.loading}>Initializing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(139,92,246,0.10)',
  },
  logoContainer: {
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 8,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taglineLine: {
    width: 30,
    height: 1,
    backgroundColor: colors.blue,
  },
  tagline: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
  },
  loading: {
    position: 'absolute',
    bottom: 60,
    color: colors.textDim,
    fontSize: 12,
    letterSpacing: 1,
  },
});
