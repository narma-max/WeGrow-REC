// ============================================================
// Screen: Login
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { colors, PrimaryButton, ErrorState } from '../components/ui';
import { ApiError } from '../services/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOtp() {
    const cleaned = phone.trim();
    if (!cleaned) {
      setError(t.enterPhone);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(cleaned);
      navigation.navigate('OTP', { phone: cleaned });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError(t.networkError);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.glowTop} />

        <View style={styles.header}>
          <Text style={styles.appName}>WE GROW</Text>
          <Text style={styles.subtitle}>{t.loginTitle}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t.enterPhone}</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder={t.phonePlaceholder}
            placeholderTextColor={colors.textDim}
            keyboardType="phone-pad"
            autoComplete="tel"
            returnKeyType="done"
            onSubmitEditing={handleSendOtp}
          />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          <PrimaryButton
            label={t.sendOtp}
            onPress={handleSendOtp}
            loading={loading}
            disabled={loading}
          />
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>🔒 {t.neverShareOtp}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(59,130,246,0.10)',
  },
  header: { alignItems: 'center', marginBottom: 40, gap: 8 },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 6,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  errorText: { color: colors.redLight, fontSize: 13 },
  warningBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.20)',
  },
  warningText: {
    color: colors.amber,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
