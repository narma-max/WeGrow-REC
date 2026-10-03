// ============================================================
// Screen: Help / Reporting
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors, SectionCard } from '../components/ui';

interface FaqItem {
  question: string;
  answer: string;
}

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setOpen(!open)}
      activeOpacity={0.85}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={styles.faqChevron}>{open ? '▲' : '▼'}</Text>
      </View>
      {open && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const { t, language } = useLanguage();

  const faqs: FaqItem[] = [
    {
      question: t.whatIsPhishing,
      answer:
        language === 'tamil'
          ? 'ஃபிஷிங் என்பது உங்கள் வங்கி விவரங்கள், OTP, கடவுச்சொல் போன்றவற்றை திருட முயலும் ஒரு சைபர் மோசடி ஆகும். குற்றவாளிகள் அதிகாரிகளாக நடித்து, போலி இணைப்புகள் அல்லது செய்திகளை பயன்படுத்துகின்றனர்.'
          : language === 'tanglish'
          ? 'Phishing nu enna na, unga bank details, OTP, password-a thirudum oru cyber fraud. Criminals official-a maadiri nadichhu, fake links or messages use pannuvanga.'
          : 'Phishing is a cyber fraud where criminals try to steal your bank details, OTP, or password by pretending to be officials and sending fake links or messages.',
    },
    {
      question: t.howToIdentify,
      answer:
        language === 'tamil'
          ? '• திடீர் அவசரம் உருவாக்கும் செய்திகள் - கவனமாக இருங்கள்\n• KYC, Account block என்று பயமுறுத்துவது - சரிபார்க்கவும்\n• "Click here" அல்லது "Verify now" லிங்க்கள் - கிளிக் வேண்டாம்\n• அதிகாரிகள் OTP கேட்க மாட்டார்கள்\n• தெரியாத வங்கி எண்ணிலிருந்து அழைப்பு வந்தால் வாங்காதீர்கள்'
          : language === 'tanglish'
          ? '• Sudden urgency create panra messages - careful-a iru\n• KYC, Account block nu bayamurutthal - verify pannunga\n• "Click here" or "Verify now" links - click pannaadheenga\n• Officials OTP keytka maatanga\n• Theriyaadha number-la call vandhaa edukkaadheega'
          : '• Messages creating sudden urgency — be careful\n• Threats of KYC, account block — verify through official channels\n• "Click here" or "Verify now" links — do not click\n• Legitimate officials never ask for OTP\n• Unknown bank numbers calling — do not answer or share details',
    },
    {
      question: t.afterClicking,
      answer:
        language === 'tamil'
          ? '1. எந்த தகவலும் உள்ளிட வேண்டாம்\n2. அந்த தட்டிலிருந்து வெளியேறுங்கள்\n3. உங்கள் வங்கியை தொடர்பு கொள்ளுங்கள்\n4. WeGrow-ல் புகாரளியுங்கள்\n5. Screenshots வையுங்கள்'
          : language === 'tanglish'
          ? '1. Ethuvum enter pannaadheenga\n2. Andha page-la irundhu veliyae vaanga\n3. Unga bank-a contact pannunga\n4. WeGrow-la report pannunga\n5. Screenshots vachukonga'
          : '1. Do not enter any information\n2. Leave the page immediately\n3. Contact your bank\n4. Report on WeGrow\n5. Take screenshots as evidence',
    },
    {
      question: t.sharedOtp,
      answer:
        language === 'tamil'
          ? '• உடனடியாக உங்கள் வங்கியை தொடர்பு கொள்ளுங்கள் (24/7 helpline)\n• கார்டு/கணக்கை freeze செய்யுங்கள்\n• Transaction செய்யப்பட்டிருந்தால் police complaint பண்ணுங்கள்\n• Cybercrime: 1930 என்ற எண்ணில் புகாரளியுங்கள்\n• WeGrow-ல் report பண்ணுங்கள்'
          : language === 'tanglish'
          ? '• Immediately unga bank-a contact pannunga (24/7 helpline)\n• Card/account-a freeze pannunga\n• Transaction aagindha irundhaa police complaint pannunga\n• Cybercrime: 1930 la report pannunga\n• WeGrow-la report pannunga'
          : '• Call your bank immediately (24/7 helpline)\n• Freeze your card and account\n• File a police complaint if a transaction occurred\n• Report to Cybercrime: 1930\n• Report on WeGrow',
    },
    {
      question: t.moneyTransferred,
      answer:
        language === 'tamil'
          ? '• உடனடியாக வங்கி helpline-ஐ அழையுங்கள்\n• Transaction-ஐ dispute செய்யுங்கள்\n• Police complaint பண்ணுங்கள்\n• Cybercrime helpline: 1930\n• Online: cybercrime.gov.in\n• Transaction reference number வையுங்கள்'
          : language === 'tanglish'
          ? '• Immediately bank helpline-a call pannunga\n• Transaction-a dispute pannunga\n• Police complaint pannunga\n• Cybercrime helpline: 1930\n• Online: cybercrime.gov.in\n• Transaction reference number vachukonga'
          : '• Call your bank helpline immediately\n• Dispute the transaction\n• File a police complaint\n• Cybercrime helpline: 1930\n• Online: cybercrime.gov.in\n• Keep your transaction reference number safe',
    },
    {
      question: t.howToReport,
      answer:
        language === 'tamil'
          ? '1. WeGrow app-ல் "மோசடியை புகாரளி" பயன்படுத்துங்கள்\n2. Cybercrime helpline: 1930\n3. cybercrime.gov.in\n4. உங்கள் வங்கியை நேரடியாக தொடர்பு கொள்ளுங்கள்\n5. TRAI: 1909 (spam calls மற்றும் SMS)'
          : language === 'tanglish'
          ? '1. WeGrow app-la "Fraud Report Pannunga" use pannunga\n2. Cybercrime helpline: 1930\n3. cybercrime.gov.in\n4. Directly unga bank-a contact pannunga\n5. TRAI: 1909 (spam calls and SMS)'
          : '1. Use "Report Fraud" in the WeGrow app\n2. Cybercrime helpline: 1930\n3. cybercrime.gov.in\n4. Contact your bank directly\n5. TRAI: 1909 (spam calls and SMS)',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.help}</Text>
        <Text style={styles.subtitle}>
          Stay informed and stay safe. Information is available in all three languages.
        </Text>
      </View>

      {/* Emergency contacts */}
      <SectionCard>
        <Text style={styles.emergencyTitle}>🆘 Emergency Contacts</Text>
        <View style={styles.contactGrid}>
          {[
            { label: 'Cybercrime', number: '1930' },
            { label: 'TRAI Spam', number: '1909' },
            { label: 'Police', number: '100' },
            { label: 'Online', number: 'cybercrime.gov.in' },
          ].map((c) => (
            <View key={c.label} style={styles.contactCell}>
              <Text style={styles.contactNumber}>{c.number}</Text>
              <Text style={styles.contactLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* FAQ */}
      <SectionCard>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, idx) => (
          <FaqAccordion key={idx} item={faq} />
        ))}
      </SectionCard>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          WeGrow does not ask for OTP, PIN, CVV, or passwords.
          If anyone claims to be from WeGrow and asks for these, it is a scam.
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
  emergencyTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 12,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactCell: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.20)',
    gap: 4,
  },
  contactNumber: {
    color: colors.red,
    fontWeight: '900',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  contactLabel: { color: colors.textMuted, fontSize: 11 },
  faqTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 12,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 14,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  faqChevron: { color: colors.textMuted, fontSize: 12, marginLeft: 12 },
  faqAnswer: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },
  footer: {
    padding: 14,
    backgroundColor: 'rgba(239,68,68,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.15)',
    marginBottom: 40,
  },
  footerText: {
    color: colors.amber,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
  },
});
