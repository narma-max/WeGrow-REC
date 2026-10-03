// ============================================================
// Screen: Home
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  colors,
  AlertCard,
  SectionCard,
  SectionTitle,
  EmptyState,
} from '../components/ui';
import { RegionalAlert } from '../types/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { session } = useAuth();
  const { t } = useLanguage();

  const [alerts, setAlerts] = useState<RegionalAlert[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [locRes, sumRes] = await Promise.allSettled([
        api.analytics.locationTime(),
        api.analytics.summary('24h'),
      ]);

      if (locRes.status === 'fulfilled') {
        setAlerts(locRes.value.reports_by_area.slice(0, 5));
      }
      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      }
    } catch {}
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const quickActions = [
    { label: t.checkMessage, icon: '💬', screen: 'ScamChecker' as const },
    { label: t.checkUrl, icon: '🔗', screen: 'URLChecker' as const },
    { label: t.reportFraud, icon: '🚨', screen: 'ReportFraud' as const },
  ];

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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>WE GROW</Text>
          <Text style={styles.subtitle}>Fraud Intelligence</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>
          {session?.role === 'ANALYST' || session?.role === 'ADMIN'
            ? `👋 Welcome back, ${session.role}`
            : '🛡️ Stay safe from fraud'}
        </Text>
        <Text style={styles.phoneMasked}>{session?.phone_masked}</Text>
      </View>

      {/* Analyst shortcut */}
      {(session?.role === 'ANALYST' || session?.role === 'ADMIN') && (
        <TouchableOpacity
          style={styles.analystBanner}
          onPress={() => navigation.navigate('CommunityAlerts')}
        >
          <Text style={styles.analystBannerText}>
            📊 Open Intelligence Dashboard →
          </Text>
        </TouchableOpacity>
      )}

      {/* Stats row */}
      {summary && (
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{summary.recent_reports}</Text>
            <Text style={styles.statLabel}>Last hour</Text>
          </View>
          <View style={[styles.statCell, styles.statCellBorder]}>
            <Text style={[styles.statValue, { color: colors.amber }]}>
              {summary.total_reports}
            </Text>
            <Text style={styles.statLabel}>Total reports</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: colors.red }]}>
              {summary.active_campaigns}
            </Text>
            <Text style={styles.statLabel}>Active campaigns</Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <SectionCard>
        <SectionTitle title="Quick Actions" />
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.screen}
              style={styles.actionBtn}
              onPress={() => navigation.navigate(action.screen as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SectionCard>

      {/* Secondary nav */}
      <View style={styles.navGrid}>
        {[
          { label: t.communityAlerts, icon: '⚠️', screen: 'CommunityAlerts' },
          { label: t.relatedFraud, icon: '🕸️', screen: 'RelatedFraud' },
          { label: t.help, icon: '❓', screen: 'Help' },
          { label: t.profile, icon: '👤', screen: 'Profile' },
        ].map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.navBtn}
            onPress={() => navigation.navigate(item.screen as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Community Alerts */}
      <SectionCard>
        <SectionTitle title={t.recentActivity} />
        {alerts.length === 0 ? (
          <EmptyState message={t.noActivity} />
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert.area}
              area={alert.area}
              count={alert.count}
              onPress={() => navigation.navigate('CommunityAlerts')}
            />
          ))
        )}
      </SectionCard>

      {/* Warning footer */}
      <View style={styles.footerWarn}>
        <Text style={styles.footerWarnText}>🔒 {t.neverShareOtp}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 4,
  },
  subtitle: { color: colors.blue, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  profileBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileIcon: { fontSize: 20 },
  greetingBox: {
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.20)',
    gap: 4,
  },
  greetingText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  phoneMasked: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  analystBanner: {
    backgroundColor: 'rgba(139,92,246,0.10)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
  },
  analystBannerText: {
    color: colors.purpleLight,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statCellBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 22, fontWeight: '900', color: colors.text },
  statLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '600', marginTop: 2 },
  actionsGrid: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(59,130,246,0.10)',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.25)',
  },
  actionIcon: { fontSize: 28 },
  actionLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  navBtn: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navIcon: { fontSize: 22 },
  navLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerWarn: {
    padding: 14,
    backgroundColor: 'rgba(245,158,11,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.15)',
    marginBottom: 20,
  },
  footerWarnText: {
    color: colors.amber,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
