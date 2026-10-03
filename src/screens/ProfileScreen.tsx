// ============================================================
// Screen: Profile
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { colors, PrimaryButton, SectionCard, SectionTitle } from '../components/ui';
import { Language } from '../types/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const LANGUAGES: { id: Language; label: string; native: string }[] = [
  { id: 'english', label: 'English', native: 'English' },
  { id: 'tamil', label: 'Tamil', native: 'தமிழ்' },
  { id: 'tanglish', label: 'Tanglish', native: 'Tanglish' },
];

export default function ProfileScreen({ navigation }: Props) {
  const { session, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
            navigation.replace('Login');
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.profile}</Text>
      </View>

      {/* Account info */}
      <SectionCard>
        <SectionTitle title="Account" />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{session?.phone_masked ?? '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor:
                  session?.role === 'CITIZEN'
                    ? 'rgba(59,130,246,0.10)'
                    : 'rgba(139,92,246,0.10)',
              },
            ]}
          >
            <Text
              style={{
                color:
                  session?.role === 'CITIZEN' ? colors.blue : colors.purpleLight,
                fontWeight: '700',
                fontSize: 12,
              }}
            >
              {session?.role}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Verification</Text>
          <Text
            style={[
              styles.infoValue,
              { color: session?.is_verified ? colors.green : colors.amber },
            ]}
          >
            {session?.is_verified ? '✓ Verified' : 'Unverified'}
          </Text>
        </View>
      </SectionCard>

      {/* Language selector */}
      <SectionCard>
        <SectionTitle title={t.language} />
        <View style={styles.langOptions}>
          {LANGUAGES.map((lang) => {
            const selected = language === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[styles.langOption, selected && styles.langOptionSelected]}
                onPress={() => setLanguage(lang.id)}
              >
                <Text style={[styles.langNative, selected && { color: colors.blue }]}>
                  {lang.native}
                </Text>
                {selected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </SectionCard>

      {/* Analyst shortcut */}
      {(session?.role === 'ANALYST' || session?.role === 'ADMIN') && (
        <SectionCard>
          <SectionTitle title="Intelligence" />
          <Text style={styles.analystNote}>
            Full analytics dashboard is available via the web interface.
          </Text>
          <TouchableOpacity style={styles.analystBtn} onPress={() => navigation.navigate('CommunityAlerts')}>
            <Text style={styles.analystBtnText}>📊 View Mobile Intelligence →</Text>
          </TouchableOpacity>
        </SectionCard>
      )}

      {/* Logout */}
      <PrimaryButton
        label={loggingOut ? 'Logging out...' : t.logout}
        onPress={handleLogout}
        disabled={loggingOut}
        style={styles.logoutBtn}
      />

      <Text style={styles.privacyNote}>
        Your data is processed securely. No OTP, PIN, or password is ever
        requested by WeGrow. No exact location is stored.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 12, paddingTop: 40 },
  header: { marginBottom: 8 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: { color: colors.textMuted, fontSize: 14 },
  infoValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
  },
  langOptions: { gap: 8 },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langOptionSelected: {
    borderColor: colors.blue,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  langNative: { color: colors.text, fontWeight: '700', fontSize: 16 },
  checkMark: { color: colors.blue, fontSize: 16, fontWeight: '900' },
  analystNote: { color: colors.textMuted, fontSize: 13, marginBottom: 12, lineHeight: 19 },
  analystBtn: {
    backgroundColor: 'rgba(139,92,246,0.10)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
  },
  analystBtnText: {
    color: colors.purpleLight,
    fontWeight: '700',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.30)',
    marginTop: 8,
  },
  privacyNote: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 40,
  },
});
