// ============================================================
// Screen: Language Selection
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { colors, PrimaryButton } from '../components/ui';
import { Language } from '../types/api';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Language'>;
};

const LANGUAGES: { id: Language; label: string; native: string; desc: string }[] = [
  { id: 'english', label: 'English', native: 'English', desc: 'Full English interface' },
  { id: 'tamil', label: 'Tamil', native: 'தமிழ்', desc: 'தமிழ் இடைமுகம்' },
  {
    id: 'tanglish',
    label: 'Tanglish',
    native: 'Tanglish',
    desc: 'Tamil in English script',
  },
];

export default function LanguageScreen({ navigation }: Props) {
  const { setLanguage: setAuthLang } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  function handleSelect(lang: Language) {
    setLanguage(lang);
  }

  async function handleContinue() {
    await setAuthLang(language);
    navigation.replace('Home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>WE GROW</Text>
        <Text style={styles.title}>{t.chooseLanguage}</Text>
        <Text style={styles.desc}>{t.languageDesc}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {LANGUAGES.map((lang) => {
          const selected = language === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => handleSelect(lang.id)}
              activeOpacity={0.85}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionNative}>{lang.native}</Text>
                <Text style={styles.optionDesc}>{lang.desc}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton label={t.continue} onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
    paddingTop: 80,
  },
  header: { alignItems: 'center', marginBottom: 48, gap: 12 },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 6,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  desc: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: { gap: 12, marginBottom: 48 },
  option: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderColor: colors.blue,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  optionLeft: { gap: 4 },
  optionNative: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  optionDesc: {
    color: colors.textMuted,
    fontSize: 13,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.blue },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
  },
});
