// ============================================================
// Screen: URL Checker
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
  RiskCard,
  CommunityCard,
  EvidenceList,
} from '../components/ui';
import { AnalyzeUrlResponse } from '../types/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'URLChecker'>;
};

export default function URLCheckerScreen({ navigation }: Props) {
  const { t } = useLanguage();

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeUrlResponse | null>(null);

  async function handleCheck() {
    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.analyze.url(url.trim());
      setResult(res);
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
        <View style={styles.header}>
          <Text style={styles.title}>{t.checkUrl}</Text>
          <Text style={styles.subtitle}>
            Check any URL for phishing, brand impersonation, and community reports.
          </Text>
        </View>

        <SectionCard>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder={t.urlPlaceholder}
            placeholderTextColor={colors.textDim}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={handleCheck}
          />
        </SectionCard>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <PrimaryButton
          label={loading ? t.analyzing : t.analyze}
          onPress={handleCheck}
          loading={loading}
        />

        {/* Results */}
        {result && !loading && (
          <>
            <RiskCard
              score={result.url_score}
              level={result.risk_level}
            />

            {/* Canonical URL */}
            {result.canonical_url && (
              <SectionCard>
                <SectionTitle title="CANONICAL URL" />
                <Text style={styles.monoText}>{result.canonical_url}</Text>
              </SectionCard>
            )}

            {/* Reasons */}
            <SectionCard>
              <EvidenceList
                title="Why Risky?"
                items={result.reasons}
                icon="⚠️"
                color={colors.amber}
              />
            </SectionCard>

            {/* Reputation */}
            <SectionCard>
              <SectionTitle title="REPUTATION" />
              <View style={styles.reputationRow}>
                <Text style={styles.reputationProvider}>
                  {result.reputation.provider}
                </Text>
                <View
                  style={[
                    styles.reputationBadge,
                    {
                      backgroundColor: result.reputation.is_flagged
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(16,185,129,0.12)',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: result.reputation.is_flagged
                        ? colors.red
                        : colors.green,
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    {result.reputation.is_flagged ? '🚨 FLAGGED' : '✓ CLEAN'}
                  </Text>
                </View>
              </View>
              <Text style={styles.reputationDetail}>{result.reputation.details}</Text>
            </SectionCard>

            {/* Domain */}
            {result.domain_info && (
              <SectionCard>
                <SectionTitle title="DOMAIN" />
                <Text style={styles.domainName}>
                  {result.domain_info.registrable_domain}
                </Text>
                {result.domain_info.age_days != null && (
                  <Text style={styles.domainAge}>
                    Age: {result.domain_info.age_days} days
                    {result.domain_info.age_days < 90 ? ' ⚠️ New domain' : ''}
                  </Text>
                )}
                <Text style={styles.domainStatus}>{result.domain_info.status}</Text>
              </SectionCard>
            )}

            {/* Redirects */}
            {result.redirects && (
              <SectionCard>
                <SectionTitle title="REDIRECTS" />
                <Text style={styles.redirectCount}>
                  {result.redirects.redirect_count} redirect
                  {result.redirects.redirect_count !== 1 ? 's' : ''}
                  {result.redirects.destination_changed ? ' · Destination changed ⚠️' : ''}
                </Text>
                <Text style={styles.finalUrl} numberOfLines={2}>
                  Final: {result.redirects.final_url}
                </Text>
              </SectionCard>
            )}

            {/* IDN / Look-alike */}
            {result.idn_info && (
              <SectionCard>
                <SectionTitle title="LOOK-ALIKE DETECTION" />
                <View style={styles.idnRow}>
                  {[
                    {
                      label: 'IDN',
                      value: result.idn_info.is_idn,
                      warn: result.idn_info.is_idn,
                    },
                    {
                      label: 'Mixed Script',
                      value: result.idn_info.mixed_script,
                      warn: result.idn_info.mixed_script,
                    },
                    {
                      label: 'Confusable',
                      value: result.idn_info.confusable_detected,
                      warn: result.idn_info.confusable_detected,
                    },
                  ].map((item) => (
                    <View
                      key={item.label}
                      style={[
                        styles.idnCell,
                        item.warn && { borderColor: colors.amber + '60' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.idnValue,
                          { color: item.warn ? colors.amber : colors.green },
                        ]}
                      >
                        {item.value ? '⚠️' : '✓'}
                      </Text>
                      <Text style={styles.idnLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </SectionCard>
            )}

            {/* Community */}
            {result.community_info && (
              <CommunityCard
                totalReports={result.community_info.total_reports}
                uniqueReporters={result.community_info.unique_reporters}
                recentReports={result.community_info.recent_reports}
                affectedAreas={result.community_info.affected_areas}
                communityScore={result.community_info.community_score}
              />
            )}
          </>
        )}
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
  monoText: {
    color: colors.blue,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
  },
  reputationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reputationProvider: { color: colors.text, fontWeight: '700', fontSize: 15 },
  reputationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  reputationDetail: { color: colors.textMuted, fontSize: 13 },
  domainName: { color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: 4 },
  domainAge: { color: colors.amber, fontSize: 13, marginBottom: 2 },
  domainStatus: { color: colors.textMuted, fontSize: 12 },
  redirectCount: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  finalUrl: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  idnRow: { flexDirection: 'row', gap: 8 },
  idnCell: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  idnValue: { fontSize: 18, marginBottom: 4 },
  idnLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '600', textAlign: 'center' },
});
