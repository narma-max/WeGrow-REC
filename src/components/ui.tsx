// ============================================================
// WeGrow Mobile — Reusable UI Components
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

// ---------------------------------------------------------------------------
// Colors & Theme
// ---------------------------------------------------------------------------

export const colors = {
  bg: '#0a0a0f',
  surface: '#111827',
  surfaceAlt: '#1a2035',
  border: '#1f2937',
  borderLight: '#374151',
  text: '#f9fafb',
  textMuted: '#9ca3af',
  textDim: '#6b7280',
  blue: '#3b82f6',
  blueLight: '#60a5fa',
  red: '#ef4444',
  redLight: '#fca5a5',
  amber: '#f59e0b',
  amberLight: '#fcd34d',
  green: '#10b981',
  greenLight: '#6ee7b7',
  purple: '#8b5cf6',
  purpleLight: '#c4b5fd',
};

export const getRiskColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'high':
    case 'critical':
      return colors.red;
    case 'medium':
      return colors.amber;
    case 'low':
      return colors.green;
    default:
      return colors.textMuted;
  }
};

export const getRiskBg = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'rgba(239,68,68,0.12)';
    case 'medium':
      return 'rgba(245,158,11,0.12)';
    case 'low':
      return 'rgba(16,185,129,0.12)';
    default:
      return 'rgba(156,163,175,0.08)';
  }
};

// ---------------------------------------------------------------------------
// LoadingState
// ---------------------------------------------------------------------------

export function LoadingState({ label }: { label?: string }) {
  const { t } = useLanguage();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.blue} />
      <Text style={styles.loadingText}>{label ?? t.loading}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ErrorState
// ---------------------------------------------------------------------------

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const { t } = useLanguage();
  return (
    <View style={styles.center}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryBtnText}>{t.tryAgain}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// RiskCard
// ---------------------------------------------------------------------------

export function RiskCard({
  score,
  level,
  scamType,
  language,
}: {
  score: number;
  level: string;
  scamType?: string;
  language?: string;
}) {
  const { t } = useLanguage();
  const riskColor = getRiskColor(level);
  const riskBg = getRiskBg(level);
  const labelMap: Record<string, string> = {
    high: t.highRisk,
    critical: t.highRisk,
    medium: t.mediumRisk,
    low: t.lowRisk,
  };
  const riskLabel = labelMap[level?.toLowerCase()] ?? t.unknown;

  return (
    <View style={[styles.riskCard, { backgroundColor: riskBg, borderColor: riskColor + '40' }]}>
      <View style={styles.riskHeader}>
        <View style={styles.riskLabelContainer}>
          <Text style={[styles.riskLabelText, { color: riskColor }]}>{riskLabel}</Text>
          {scamType ? (
            <Text style={styles.scamTypeText}>{scamType.toUpperCase()}</Text>
          ) : null}
          {language ? (
            <Text style={styles.langBadge}>{language.toUpperCase()}</Text>
          ) : null}
        </View>
        <View style={[styles.scoreBadge, { borderColor: riskColor }]}>
          <Text style={[styles.scoreText, { color: riskColor }]}>{score}</Text>
          <Text style={styles.scoreOf}>/100</Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ScoreBreakdown
// ---------------------------------------------------------------------------

export function ScoreBreakdown({
  items,
}: {
  items: { label: string; score?: number | null; color?: string }[];
}) {
  return (
    <View style={styles.scoreGrid}>
      {items.map((item) => (
        <View key={item.label} style={styles.scoreCell}>
          <Text style={[styles.scoreCellValue, { color: item.color ?? colors.blue }]}>
            {item.score ?? '—'}
          </Text>
          <Text style={styles.scoreCellLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// EvidenceList
// ---------------------------------------------------------------------------

export function EvidenceList({
  title,
  items,
  icon = '✓',
  color = colors.textMuted,
}: {
  title: string;
  items: string[];
  icon?: string;
  color?: string;
}) {
  if (!items?.length) return null;
  return (
    <View style={styles.evidenceContainer}>
      <Text style={styles.evidenceTitle}>{title}</Text>
      {items.map((item, idx) => (
        <View key={idx} style={styles.evidenceRow}>
          <Text style={[styles.evidenceIcon, { color }]}>{icon}</Text>
          <Text style={styles.evidenceText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// ActionPlan
// ---------------------------------------------------------------------------

export function ActionPlanView({ plan }: { plan: import('../types/api').ActionPlan }) {
  const { t } = useLanguage();
  return (
    <ScrollView style={styles.actionPlanContainer}>
      <EvidenceList
        title={t.doThisNow}
        items={plan.immediate_actions}
        icon="✓"
        color={colors.green}
      />
      <EvidenceList
        title={t.doNotDo}
        items={plan.do_not_do}
        icon="✕"
        color={colors.red}
      />
      <EvidenceList
        title={t.contactGuidance}
        items={plan.contact_guidance}
        icon="📞"
        color={colors.blue}
      />
      <EvidenceList
        title={t.reportTo}
        items={plan.reporting_guidance}
        icon="🚨"
        color={colors.amber}
      />
      <EvidenceList
        title={t.preserveEvidence}
        items={plan.evidence_to_preserve}
        icon="📋"
        color={colors.purple}
      />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// CommunityCard
// ---------------------------------------------------------------------------

export function CommunityCard({
  totalReports,
  uniqueReporters,
  recentReports,
  affectedAreas,
  communityScore,
}: {
  totalReports: number;
  uniqueReporters: number;
  recentReports: number;
  affectedAreas?: number;
  communityScore?: number;
}) {
  const cells = [
    { label: 'Total Reports', value: totalReports, color: colors.text },
    { label: 'Unique Reporters', value: uniqueReporters, color: colors.blue },
    { label: 'Last 24h', value: recentReports, color: colors.amber },
    ...(affectedAreas != null ? [{ label: 'Areas', value: affectedAreas, color: colors.purple }] : []),
  ];

  return (
    <View style={styles.communityCard}>
      <Text style={styles.communityTitle}>👥 Community Intelligence</Text>
      <View style={styles.communityGrid}>
        {cells.map((c) => (
          <View key={c.label} style={styles.communityCell}>
            <Text style={[styles.communityCellValue, { color: c.color }]}>{c.value}</Text>
            <Text style={styles.communityCellLabel}>{c.label}</Text>
          </View>
        ))}
      </View>
      {communityScore != null && (
        <Text style={styles.communityScore}>
          Community Risk Score: {communityScore}/100
        </Text>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// AlertCard
// ---------------------------------------------------------------------------

export function AlertCard({
  area,
  count,
  onPress,
}: {
  area: string;
  count: number;
  onPress?: () => void;
}) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity style={styles.alertCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.alertCardHeader}>
        <Text style={styles.alertCardIcon}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertCardArea}>{area}</Text>
          <Text style={styles.alertCardCount}>{count} reports</Text>
        </View>
        {onPress && <Text style={styles.alertCardChevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// PrimaryButton
// ---------------------------------------------------------------------------

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.primaryBtnText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// SecondaryButton
// ---------------------------------------------------------------------------

export function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      style={[styles.secondaryBtn, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// SectionCard
// ---------------------------------------------------------------------------

export function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.sectionCard, style]}>{children}</View>;
}

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------

export function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 8,
  },
  errorIcon: { fontSize: 40, marginBottom: 8 },
  errorText: {
    color: colors.redLight,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.blue,
    borderRadius: 12,
  },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  riskCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskLabelContainer: { flex: 1, gap: 6 },
  riskLabelText: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  scamTypeText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  langBadge: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreBadge: {
    borderRadius: 50,
    borderWidth: 3,
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: { fontSize: 24, fontWeight: '900' },
  scoreOf: { color: colors.textMuted, fontSize: 10 },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scoreCell: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreCellValue: { fontSize: 22, fontWeight: '900' },
  scoreCellLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  evidenceContainer: { gap: 8, marginBottom: 16 },
  evidenceTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  evidenceRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  evidenceIcon: { fontSize: 14, marginTop: 1, width: 16 },
  evidenceText: { color: colors.text, fontSize: 14, flex: 1, lineHeight: 20 },
  actionPlanContainer: { flex: 1 },
  communityCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  communityTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  communityCell: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  communityCellValue: { fontSize: 22, fontWeight: '900' },
  communityCellLabel: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  communityScore: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertCardIcon: { fontSize: 22 },
  alertCardArea: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  alertCardCount: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  alertCardChevron: {
    color: colors.textMuted,
    fontSize: 22,
  },
  primaryBtn: {
    backgroundColor: colors.blue,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 54,
  },
  secondaryBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
});
