// ============================================================
// Screen: Incident Response
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { api, ApiError } from '../services/api';
import {
  colors,
  PrimaryButton,
  ActionPlanView,
  LoadingState,
  ErrorState,
  SectionCard,
  SectionTitle,
} from '../components/ui';
import { ActionPlan } from '../types/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IncidentResponse'>;
  route: RouteProp<RootStackParamList, 'IncidentResponse'>;
};

const INCIDENT_STATES = [
  { id: 'SAFE_NO_ACTION', clicked: false, money_transferred: false },
  { id: 'CLICKED_NO_ENTRY', clicked: true, money_transferred: false },
  { id: 'DETAILS_ENTERED', clicked: true, credential_shared: true, money_transferred: false },
  { id: 'OTP_SHARED', clicked: true, otp_shared: true, money_transferred: false },
  { id: 'PERSONAL_DATA_SHARED', clicked: true, personal_data_shared: true, money_transferred: false },
  { id: 'APP_INSTALLED', clicked: true, app_installed: true, money_transferred: false },
  { id: 'MONEY_TRANSFERRED', clicked: true, money_transferred: true },
  { id: 'UNSURE', money_transferred: false },
];

export default function IncidentResponseScreen({ navigation, route }: Props) {
  const { analysisId, riskLevel, scamType } = route.params;
  const { t } = useLanguage();

  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

  async function handleSubmit() {
    if (!selected) return;
    const state = INCIDENT_STATES.find((s) => s.id === selected);
    if (!state) return;

    setLoading(true);
    setError(null);
    try {
      const result = await api.incidentResponse({
        analysis_id: analysisId,
        incident_state: state.id,
        clicked: (state as any).clicked ?? false,
        credential_shared: (state as any).credential_shared ?? false,
        otp_shared: (state as any).otp_shared ?? false,
        personal_data_shared: (state as any).personal_data_shared ?? false,
        app_installed: (state as any).app_installed ?? false,
        money_transferred: state.money_transferred,
        original_risk_level: riskLevel,
        original_scam_type: scamType,
      });
      setPlan(result);
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

  if (loading) return <LoadingState label="Getting your action plan..." />;

  if (plan) {
    return (
      <View style={styles.container}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{t.actionPlan}</Text>
          <View
            style={[
              styles.severityBadge,
              {
                backgroundColor:
                  plan.severity === 'CRITICAL'
                    ? 'rgba(239,68,68,0.15)'
                    : plan.severity === 'HIGH'
                    ? 'rgba(245,158,11,0.15)'
                    : 'rgba(16,185,129,0.12)',
              },
            ]}
          >
            <Text
              style={{
                color:
                  plan.severity === 'CRITICAL'
                    ? colors.red
                    : plan.severity === 'HIGH'
                    ? colors.amber
                    : colors.green,
                fontWeight: '800',
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              {plan.severity}
            </Text>
          </View>
        </View>
        <ActionPlanView plan={plan} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.whatHappened}</Text>
        <Text style={styles.subtitle}>
          Select what happened so we can give you the right steps to take.
        </Text>
      </View>

      <View style={styles.options}>
        {INCIDENT_STATES.map((state) => {
          const isSelected = selected === state.id;
          return (
            <TouchableOpacity
              key={state.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => setSelected(state.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {t.incidentOptions[state.id] ?? state.id}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <PrimaryButton
        label={t.actionPlan}
        onPress={handleSubmit}
        disabled={!selected}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, gap: 12, paddingBottom: 40 },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  planTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  severityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 50,
  },
  header: { paddingTop: 20, gap: 8, marginBottom: 8 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  options: { gap: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.blue,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  optionText: { color: colors.textMuted, fontSize: 15, flex: 1, lineHeight: 21 },
  optionTextSelected: { color: colors.text, fontWeight: '600' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.blue },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  errorText: { color: colors.redLight, fontSize: 13 },
});
