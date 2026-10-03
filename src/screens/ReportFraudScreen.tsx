// ============================================================
// Screen: Report Fraud
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
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError } from '../services/api';
import {
  colors,
  PrimaryButton,
  SectionCard,
  SectionTitle,
  LoadingState,
} from '../components/ui';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportFraud'>;
  route: RouteProp<RootStackParamList, 'ReportFraud'>;
};

const AREAS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem',
  'Erode', 'Tirunelveli', 'Vellore', 'Thanjavur', 'Hosur',
  'Other',
];

const INCIDENT_TIMES = [
  { label: 'Just now', value: 'just_now' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: "I don't remember", value: 'unknown' },
];

export default function ReportFraudScreen({ navigation, route }: Props) {
  const { t } = useLanguage();
  const prefill = route.params?.prefill;

  const [message, setMessage] = useState('');
  const [url, setUrl] = useState(prefill?.url ?? '');
  const [phone, setPhone] = useState('');
  const [scamType, setScamType] = useState(prefill?.scam_type ?? '');
  const [area, setArea] = useState('');
  const [incidentTime, setIncidentTime] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  function getIncidentAt(): string | null {
    if (!incidentTime || incidentTime === 'unknown') return null;
    const now = new Date();
    if (incidentTime === 'just_now') return now.toISOString();
    if (incidentTime === 'today') {
      now.setHours(12, 0, 0, 0);
      return now.toISOString();
    }
    if (incidentTime === 'yesterday') {
      now.setDate(now.getDate() - 1);
      now.setHours(12, 0, 0, 0);
      return now.toISOString();
    }
    return null;
  }

  async function handleSubmit() {
    if (!message.trim() && !url.trim() && !phone.trim()) {
      setError('Please provide at least a message, URL, or phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.reports.create({
        message_content: message.trim() || undefined,
        url: url.trim() || undefined,
        phone_number: phone.trim() || undefined,
        scam_type: scamType.trim() || undefined,
        report_source: 'android',
        area_name: area || undefined,
        area_id: area ? area.toLowerCase().replace(/\s+/g, '_') : undefined,
        incident_at: getIncidentAt(),
      });

      setSuccess(true);
      setIsDuplicate(result.is_duplicate);
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

  if (loading) return <LoadingState label="Submitting report..." />;

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>{isDuplicate ? '⚠️' : '✅'}</Text>
        <Text style={styles.successTitle}>
          {isDuplicate ? 'Duplicate Report' : 'Report Submitted'}
        </Text>
        <Text style={styles.successText}>
          {isDuplicate ? t.reportDuplicate : t.reportSuccess}
        </Text>
        <PrimaryButton
          label="Back to Home"
          onPress={() => navigation.navigate('Home')}
          style={{ marginTop: 24 }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{t.reportFraud}</Text>
          <Text style={styles.subtitle}>
            Reports are used to protect the community. Backend handles all
            deduplication and graph analysis.
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
            numberOfLines={4}
            textAlignVertical="top"
          />
        </SectionCard>

        <SectionCard>
          <SectionTitle title="URL" />
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
          <SectionTitle title="Phone Number" />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder={t.phonePlaceholder}
            placeholderTextColor={colors.textDim}
            keyboardType="phone-pad"
          />
        </SectionCard>

        <SectionCard>
          <SectionTitle title={t.areaLabel} />
          <View style={styles.areaGrid}>
            {AREAS.map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.areaChip, area === a && styles.areaChipSelected]}
                onPress={() => setArea(area === a ? '' : a)}
              >
                <Text
                  style={[
                    styles.areaChipText,
                    area === a && styles.areaChipTextSelected,
                  ]}
                >
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        <SectionCard>
          <SectionTitle title={t.incidentTime} />
          <View style={styles.timeOptions}>
            {INCIDENT_TIMES.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.timeChip,
                  incidentTime === item.value && styles.timeChipSelected,
                ]}
                onPress={() => setIncidentTime(incidentTime === item.value ? '' : item.value)}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    incidentTime === item.value && styles.timeChipTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <PrimaryButton label={t.submitReport} onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  header: { paddingTop: 20, gap: 6, marginBottom: 8 },
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
  },
  textArea: { minHeight: 110, textAlignVertical: 'top', paddingTop: 14 },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  areaChipSelected: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: colors.blue,
  },
  areaChipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  areaChipTextSelected: { color: colors.blue },
  timeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  timeChipSelected: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderColor: colors.blue,
  },
  timeChipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  timeChipTextSelected: { color: colors.blue },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  errorText: { color: colors.redLight, fontSize: 13 },
  successContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  successIcon: { fontSize: 60 },
  successTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  successText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
