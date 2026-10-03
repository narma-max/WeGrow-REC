// ============================================================
// Screen: Scam Checker
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError } from '../services/api';
import {
  colors,
  PrimaryButton,
  SectionCard,
  SectionTitle,
  LoadingState,
  ErrorState,
} from '../components/ui';
import { AnalyzeEndpointResponse } from '../types/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScamChecker'>;
};

export default function ScamCheckerScreen({ navigation }: Props) {
  const { t } = useLanguage();

  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!message.trim() && !url.trim() && !phone.trim()) {
      setError('Please enter at least a message, URL, or phone number.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.analyze.message({
        message: message.trim() || undefined,
        url: url.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      navigation.navigate('AnalysisResult', { result });
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

  if (loading) {
    return <LoadingState label={t.analyzing} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{t.checkMessage}</Text>
          <Text style={styles.subtitle}>
            Backend AI analyzes for scam risk. No logic runs locally.
          </Text>
        </View>

        <SectionCard>
          <SectionTitle title="Message" />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder={t.messagePlaceholder}
            placeholderTextColor={colors.textDim}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </SectionCard>

        <SectionCard>
          <SectionTitle title="URL (optional)" />
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder={t.urlPlaceholder}
            placeholderTextColor={colors.textDim}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </SectionCard>

        <SectionCard>
          <SectionTitle title="Phone Number (optional)" />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder={t.phonePlaceholder}
            placeholderTextColor={colors.textDim}
            keyboardType="phone-pad"
          />
        </SectionCard>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <PrimaryButton
          label={t.analyze}
          onPress={handleAnalyze}
          disabled={loading}
        />

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Analysis is performed server-side. Supports Tamil, English, and Tanglish.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 12 },
  header: { paddingTop: 20, marginBottom: 8, gap: 6 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 15,
    minHeight: 52,
  },
  textArea: {
    minHeight: 130,
    paddingTop: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  errorText: { color: colors.redLight, fontSize: 13 },
  footerNote: { marginTop: 8, marginBottom: 24 },
  footerNoteText: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
