// ============================================================
// Screen: Analysis Result
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import {
  colors,
  RiskCard,
  ScoreBreakdown,
  EvidenceList,
  CommunityCard,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
  SectionTitle,
  getRiskColor,
} from '../components/ui';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AnalysisResult'>;
  route: RouteProp<RootStackParamList, 'AnalysisResult'>;
};

export default function AnalysisResultScreen({ navigation, route }: Props) {
  const { result } = route.params;
  const { t } = useLanguage();

  const isHighRisk = ['HIGH', 'CRITICAL'].includes(result.risk_level?.toUpperCase());
  const isAwareness = result.message?.intent === 'awareness';

  const messageScore = result.message_score ?? result.message?.score;
  const urlScore = result.url_score ?? result.url?.score;
  const graphScore = result.graph?.score;

  const communityInfo = result.extracted_urls?.[0]?.community_info
    ?? result.url_analysis?.community_info;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Risk card */}
      <RiskCard
        score={result.overall_score}
        level={result.risk_level}
        scamType={result.scam_type ?? result.message?.scam_type}
        language={result.language ?? result.message?.language}
      />

      {/* Awareness notice */}
      {isAwareness && (
        <View style={styles.awarenessBox}>
          <Text style={styles.awarenessText}>
            ✅ This message appears to be a safety awareness message, not a scam.
          </Text>
        </View>
      )}

      {/* Low risk guidance */}
      {!isHighRisk && !isAwareness && (
        <View style={styles.lowRiskBox}>
          <Text style={styles.lowRiskText}>
            ✓ No significant threat indicators detected.
          </Text>
          <Text style={styles.lowRiskSub}>
            Always verify sensitive requests through official channels.
          </Text>
        </View>
      )}

      {/* Score breakdown */}
      <SectionCard>
        <SectionTitle title="Score Breakdown" />
        <ScoreBreakdown
          items={[
            { label: 'Overall', score: result.overall_score, color: getRiskColor(result.risk_level) },
            { label: 'Message', score: messageScore, color: colors.blue },
            { label: 'URL', score: urlScore, color: colors.amber },
            { label: 'Graph', score: graphScore, color: colors.purple },
          ]}
        />
      </SectionCard>

      {/* Reasons */}
      {result.reasons?.length > 0 && (
        <SectionCard>
          <EvidenceList
            title={t.whyRisky}
            items={result.reasons}
            icon="⚠️"
            color={colors.amber}
          />
        </SectionCard>
      )}

      {/* Signals */}
      {(result.signals?.length > 0 || result.message?.signals?.length > 0) && (
        <SectionCard>
          <EvidenceList
            title="Signals Detected"
            items={result.signals?.length ? result.signals : (result.message?.signals ?? [])}
            icon="🔍"
            color={colors.textMuted}
          />
        </SectionCard>
      )}

      {/* Recommended Actions */}
      {result.recommended_actions?.length > 0 && (
        <SectionCard>
          <EvidenceList
            title="Recommended Actions"
            items={result.recommended_actions}
            icon="→"
            color={colors.green}
          />
        </SectionCard>
      )}

      {/* Community info */}
      {communityInfo && (
        <CommunityCard
          totalReports={communityInfo.total_reports}
          uniqueReporters={communityInfo.unique_reporters}
          recentReports={communityInfo.recent_reports}
          affectedAreas={communityInfo.affected_areas}
          communityScore={communityInfo.community_score}
        />
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        {isHighRisk && (
          <PrimaryButton
            label={t.whatHappened}
            onPress={() =>
              navigation.navigate('IncidentResponse', {
                analysisId: result.analysis_id,
                riskLevel: result.risk_level,
                scamType: result.scam_type ?? result.message?.scam_type,
              })
            }
          />
        )}

        <SecondaryButton
          label={t.reportFraud}
          onPress={() =>
            navigation.navigate('ReportFraud', {
              prefill: {
                scam_type: result.scam_type ?? result.message?.scam_type,
                url: result.url_analysis?.canonical_url,
              },
            })
          }
        />

        <SecondaryButton
          label={`${t.relatedFraud} →`}
          onPress={() => navigation.navigate('RelatedFraud', { fromAnalysis: true })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 12 },
  awarenessBox: {
    backgroundColor: 'rgba(16,185,129,0.10)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
  },
  awarenessText: {
    color: colors.greenLight,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  lowRiskBox: {
    backgroundColor: 'rgba(16,185,129,0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.18)',
    gap: 6,
  },
  lowRiskText: {
    color: colors.green,
    fontSize: 15,
    fontWeight: '700',
  },
  lowRiskSub: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  actions: { gap: 10, marginBottom: 32 },
});
