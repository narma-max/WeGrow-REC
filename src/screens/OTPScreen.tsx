// ============================================================
// Screen: OTP Verification
// ============================================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { colors, PrimaryButton, SecondaryButton } from '../components/ui';
import { ApiError } from '../services/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OTP'>;
  route: RouteProp<RootStackParamList, 'OTP'>;
};

export default function OTPScreen({ navigation, route }: Props) {
  const { verifyOtp, login } = useAuth();
  const { t } = useLanguage();
  const { phone } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleVerify() {
    if (!otp.trim()) {
      setError('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const session = await verifyOtp(phone, otp.trim());
      setSuccess(true);
      // Navigate based on whether language preference exists
      if (session.preferred_language) {
        navigation.replace('Home');
      } else {
        navigation.replace('Language');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Invalid or expired OTP. Please try again.');
        } else {
          setError(err.detail);
        }
      } else {
        setError(t.networkError);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await login(phone);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError(t.networkError);
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.appName}>WE GROW</Text>
          <Text style={styles.subtitle}>{t.verifyOtp}</Text>
          <Text style={styles.phoneMasked}>
            {phone.slice(0, 4)}****{phone.slice(-4)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t.enterOtp}</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="- - - - - -"
            placeholderTextColor={colors.textDim}
            keyboardType="number-pad"
            maxLength={8}
            returnKeyType="done"
            onSubmitEditing={handleVerify}
            autoFocus
          />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          <PrimaryButton
            label={t.verifyOtp}
            onPress={handleVerify}
            loading={loading}
            disabled={loading}
          />

          <SecondaryButton
            label={resending ? 'Resending...' : 'Resend OTP'}
            onPress={handleResend}
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
  header: { alignItems: 'center', marginBottom: 40, gap: 8 },
  appName: {
    fontSize: 32,
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
  phoneMasked: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
    paddingVertical: 16,
    color: colors.text,
    fontSize: 28,
    letterSpacing: 8,
    textAlign: 'center',
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
