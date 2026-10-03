// ============================================================
// Screen: Community Alerts
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError } from '../services/api';
import {
  colors,
  AlertCard,
  SectionCard,
  SectionTitle,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../components/ui';
import { RegionalAlert } from '../types/api';

export default function CommunityAlertsScreen() {
  const { t } = useLanguage();

  const [alerts, setAlerts] = useState<RegionalAlert[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setError(null);
    try {
      const [locRes, trendRes, sumRes] = await Promise.allSettled([
        api.analytics.locationTime(),
        api.community.trending(),
        api.analytics.summary('24h'),
      ]);

      if (locRes.status === 'fulfilled') {
        setAlerts(locRes.value.reports_by_area);
      }
      if (trendRes.status === 'fulfilled') {
        setTrending(trendRes.value.trending ?? []);
      }
      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      }
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
        <Text style={styles.title}>{t.communityAlerts}</Text>
        <Text style={styles.subtitle}>
          {t.recentActivity}. Only aggregated community data is shown.
        </Text>
      </View>

      {/* Summary stats */}
      {summary && (
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{summary.recent_reports}</Text>
            <Text style={styles.statLabel}>Last Hour</Text>
          </View>
          <View style={[styles.statCell, styles.statCellBorder]}>
            <Text style={[styles.statValue, { color: colors.amber }]}>
              {summary.total_reports}
            </Text>
            <Text style={styles.statLabel}>Total (24h)</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: colors.red }]}>
              {summary.active_campaigns}
            </Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
        </View>
      )}

      {/* Alerts by area */}
      <SectionCard>
        <SectionTitle title="Reports by Area" />
        {alerts.length === 0 ? (
          <EmptyState message={t.noActivity} />
        ) : (
          alerts.map((alert) => (
            <AlertCard key={alert.area} area={alert.area} count={alert.count} />
          ))
        )}
      </SectionCard>

      {/* Trending indicators */}
      {trending.length > 0 && (
        <SectionCard>
          <SectionTitle title="Trending Fraud Indicators" />
          {trending.map((item: any, idx: number) => (
            <View key={idx} style={styles.trendingRow}>
              <View style={styles.trendingLeft}>
                <Text style={styles.trendingIndicator} numberOfLines={1}>
                  {item.indicator}
                </Text>
                <Text style={styles.trendingType}>{item.indicator_type}</Text>
              </View>
              <View style={styles.trendingRight}>
                <Text style={styles.trendingCount}>{item.reports_24h}</Text>
                <Text style={[styles.trendingGrowth, { color: colors.red }]}>
                  {item.growth}
                </Text>
              </View>
            </View>
          ))}
        </SectionCard>
      )}

      {/* Privacy notice */}
      <View style={styles.privacyNotice}>
        <Text style={styles.privacyText}>
          🔒 Only aggregated, anonymous community data is shown.
          No reporter identity or exact location is ever displayed.
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
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statCell: { flex: 1, padding: 16, alignItems: 'center' },
  statCellBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 22, fontWeight: '900', color: colors.text },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trendingLeft: { flex: 1 },
  trendingIndicator: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  trendingType: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  trendingRight: { alignItems: 'flex-end', gap: 2 },
  trendingCount: { color: colors.text, fontWeight: '900', fontSize: 18 },
  trendingGrowth: { fontSize: 11, fontWeight: '700' },
  privacyNotice: {
    padding: 14,
    backgroundColor: 'rgba(59,130,246,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.15)',
    marginBottom: 20,
  },
  privacyText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
