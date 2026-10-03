// ============================================================
// Screen: Related Fraud
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError } from '../services/api';
import {
  colors,
  SectionCard,
  SectionTitle,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../components/ui';
import { Campaign, RelatedIncident } from '../types/api';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RelatedFraud'>;
  route: RouteProp<RootStackParamList, 'RelatedFraud'>;
};

export default function RelatedFraudScreen({ navigation, route }: Props) {
  const { t } = useLanguage();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setError(null);
    try {
      const res = await api.campaigns.list();
      setCampaigns(res.campaigns ?? []);
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

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.blue}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t.relatedFraud}</Text>
        <Text style={styles.subtitle}>{t.possibleRelated}</Text>
      </View>

      {campaigns.length === 0 ? (
        <EmptyState message="No active campaigns detected." />
      ) : (
        campaigns.map((campaign) => (
          <SectionCard key={campaign.campaign_id}>
            <View style={styles.campaignHeader}>
              <Text style={styles.campaignId}>{campaign.campaign_id}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      campaign.status === 'active'
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(156,163,175,0.10)',
                  },
                ]}
              >
                <Text
                  style={{
                    color: campaign.status === 'active' ? colors.red : colors.textMuted,
                    fontSize: 11,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}
                >
                  {campaign.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Wording: "Possible related fraud activity" */}
            <Text style={styles.campaignDisclaimer}>
              🕸 Possible related fraud activity
            </Text>

            {/* Stats grid */}
            <View style={styles.statsGrid}>
              {[
                { label: 'Phones', value: campaign.phones, icon: '📱' },
                { label: 'URLs', value: campaign.urls, icon: '🔗' },
                { label: 'Reports', value: campaign.report_count ?? campaign.total_reports, icon: '📋' },
                {
                  label: 'Areas',
                  value: campaign.affected_areas?.length ?? 0,
                  icon: '📍',
                },
              ].map((s) => (
                <View key={s.label} style={styles.statCell}>
                  <Text style={styles.statIcon}>{s.icon}</Text>
                  <Text style={styles.statValue}>{s.value ?? '—'}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Time range */}
            {(campaign.first_seen || campaign.last_seen) && (
              <View style={styles.timeRow}>
                {campaign.first_seen && (
                  <Text style={styles.timeText}>
                    First seen: {new Date(campaign.first_seen).toLocaleDateString()}
                  </Text>
                )}
                {campaign.last_seen && (
                  <Text style={styles.timeText}>
                    Last seen: {new Date(campaign.last_seen).toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}

            {/* Areas */}
            {campaign.affected_areas && campaign.affected_areas.length > 0 && (
              <View style={styles.areaRow}>
                {campaign.affected_areas.slice(0, 4).map((area) => (
                  <View key={area} style={styles.areaChip}>
                    <Text style={styles.areaChipText}>📍 {area}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Simplified indicator list (MVP graph view) */}
            <SectionTitle title="RELATED INDICATORS" />
            <Text style={styles.indicatorNote}>
              {campaign.phones ?? 0} phone numbers →{' '}
              {campaign.urls ?? 0} URLs
            </Text>
          </SectionCard>
        ))
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ℹ️ These indicators may be associated. This does not confirm
          they are from the same source or actor.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 12 },
  header: { paddingTop: 20, gap: 6, marginBottom: 8 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  campaignId: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
    fontFamily: 'monospace',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  campaignDisclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statCell: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: { fontSize: 16 },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 18 },
  statLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '600' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  timeText: { color: colors.textDim, fontSize: 11 },
  areaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  areaChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(139,92,246,0.10)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
  },
  areaChipText: { color: colors.purpleLight, fontSize: 11, fontWeight: '600' },
  indicatorNote: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  disclaimer: {
    padding: 14,
    backgroundColor: 'rgba(245,158,11,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
    marginBottom: 20,
  },
  disclaimerText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
