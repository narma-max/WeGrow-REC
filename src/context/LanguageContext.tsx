// ============================================================
// WeGrow Mobile — Language Context
// ============================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types/api';

// ---------------------------------------------------------------------------
// i18n strings
// ---------------------------------------------------------------------------

const strings = {
  english: {
    appName: 'WE GROW',
    tagline: 'Fraud Intelligence Platform',
    checkMessage: 'Check Message',
    checkUrl: 'Check URL',
    reportFraud: 'Report Fraud',
    communityAlerts: 'Community Alerts',
    relatedFraud: 'Related Fraud',
    help: 'Help',
    profile: 'Profile',
    analyzing: 'Analyzing...',
    highRisk: 'HIGH RISK',
    mediumRisk: 'MEDIUM RISK',
    lowRisk: 'LOW RISK',
    unknown: 'UNKNOWN',
    whyRisky: 'Why is this risky?',
    whatHappened: 'What happened?',
    actionPlan: 'Action Plan',
    doThisNow: 'DO THIS NOW',
    doNotDo: 'DO NOT',
    contactGuidance: 'CONTACT',
    reportTo: 'REPORT TO',
    preserveEvidence: 'EVIDENCE TO PRESERVE',
    submitReport: 'Submit Report',
    reportSuccess: 'Report submitted successfully.',
    reportDuplicate: 'This appears to duplicate an earlier report.',
    messagePlaceholder: 'Paste suspicious message here...',
    urlPlaceholder: 'https://suspicious-site.com',
    phonePlaceholder: '+91 9876543210',
    analyze: 'Analyze',
    logout: 'Logout',
    language: 'Language',
    english: 'English',
    tamil: 'Tamil',
    tanglish: 'Tanglish',
    networkError: 'Unable to reach WeGrow right now. Please try again.',
    sessionExpired: 'Session expired. Please log in again.',
    noActivity: 'No recent activity in your area.',
    recentActivity: 'Recent fraud activity in your area',
    possibleRelated: 'Possible related fraud activity',
    neverShareOtp: 'Never share your OTP, PIN, or password with anyone.',
    loginTitle: 'Login to WeGrow',
    enterPhone: 'Enter your phone number',
    sendOtp: 'Send OTP',
    enterOtp: 'Enter the OTP sent to your phone',
    verifyOtp: 'Verify OTP',
    chooseLanguage: 'Choose Your Language',
    languageDesc: 'Select the language for the WeGrow app interface.',
    continue: 'Continue',
    areaLabel: 'Area (optional)',
    incidentTime: 'When did this happen?',
    justNow: 'Just now',
    today: 'Today',
    yesterday: 'Yesterday',
    dontRemember: "I don't remember",
    viewDetails: 'View Details',
    tryAgain: 'Try Again',
    loading: 'Loading...',
    noData: 'No data available.',
    incidentOptions: {
      SAFE_NO_ACTION: 'I did not click anything',
      CLICKED_NO_ENTRY: 'I clicked but entered nothing',
      DETAILS_ENTERED: 'I entered my details',
      OTP_SHARED: 'I shared OTP / PIN',
      PERSONAL_DATA_SHARED: 'I shared personal information',
      APP_INSTALLED: 'I installed an app',
      MONEY_TRANSFERRED: 'I transferred money',
      UNSURE: "I'm not sure",
    } as Record<string, string>,
    whatIsPhishing: 'What is phishing?',
    howToIdentify: 'How to identify suspicious messages',
    afterClicking: 'What should I do after clicking?',
    sharedOtp: 'What if I shared OTP?',
    moneyTransferred: 'What if money was transferred?',
    howToReport: 'How to report fraud?',
  },

  tamil: {
    appName: 'WE GROW',
    tagline: 'மோசடி நுண்ணறிவு தளம்',
    checkMessage: 'செய்தியை சரிபார்',
    checkUrl: 'இணைப்பை சரிபார்',
    reportFraud: 'மோசடியை புகாரளி',
    communityAlerts: 'சமூக எச்சரிக்கைகள்',
    relatedFraud: 'தொடர்புடைய மோசடி',
    help: 'உதவி',
    profile: 'சுயவிவரம்',
    analyzing: 'பகுப்பாய்வு செய்கிறது...',
    highRisk: 'அதிக ஆபத்து',
    mediumRisk: 'நடுத்தர ஆபத்து',
    lowRisk: 'குறைந்த ஆபத்து',
    unknown: 'தெரியவில்லை',
    whyRisky: 'ஏன் ஆபத்தானது?',
    whatHappened: 'என்ன நடந்தது?',
    actionPlan: 'செயல் திட்டம்',
    doThisNow: 'இப்போதே செய்யுங்கள்',
    doNotDo: 'செய்யாதீர்கள்',
    contactGuidance: 'தொடர்பு கொள்ளுங்கள்',
    reportTo: 'புகாரளியுங்கள்',
    preserveEvidence: 'சான்றுகளை பாதுகாக்கவும்',
    submitReport: 'புகாரை சமர்ப்பி',
    reportSuccess: 'புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.',
    reportDuplicate: 'இது ஒரு முந்தைய புகாரை நகலெடுக்கிறது.',
    messagePlaceholder: 'சந்தேகமான செய்தியை இங்கே ஒட்டவும்...',
    urlPlaceholder: 'https://சந்தேகமான-தளம்.com',
    phonePlaceholder: '+91 9876543210',
    analyze: 'பகுப்பாய்வு செய்',
    logout: 'வெளியேறு',
    language: 'மொழி',
    english: 'English',
    tamil: 'தமிழ்',
    tanglish: 'Tanglish',
    networkError: 'WeGrow-ஐ தொடர்பு கொள்ள முடியவில்லை. மீண்டும் முயலவும்.',
    sessionExpired: 'அமர்வு காலாவதியானது. மீண்டும் உள்நுழைக.',
    noActivity: 'உங்கள் பகுதியில் சமீபத்திய செயல்பாடு இல்லை.',
    recentActivity: 'உங்கள் பகுதியில் சமீபத்திய மோசடி செயல்பாடு',
    possibleRelated: 'தொடர்புடைய மோசடி செயல்பாடு இருக்கலாம்',
    neverShareOtp: 'உங்கள் OTP, PIN அல்லது கடவுச்சொல்லை யாருடனும் பகிர வேண்டாம்.',
    loginTitle: 'WeGrow-ல் உள்நுழைக',
    enterPhone: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
    sendOtp: 'OTP அனுப்பு',
    enterOtp: 'உங்கள் தொலைபேசிக்கு அனுப்பப்பட்ட OTP-ஐ உள்ளிடவும்',
    verifyOtp: 'OTP சரிபார்',
    chooseLanguage: 'உங்கள் மொழியை தேர்வு செய்யவும்',
    languageDesc: 'WeGrow பயன்பாடு இடைமுகத்திற்கான மொழியை தேர்ந்தெடுக்கவும்.',
    continue: 'தொடர்க',
    areaLabel: 'பகுதி (விரும்பினால்)',
    incidentTime: 'இது எப்போது நடந்தது?',
    justNow: 'இப்போதுதான்',
    today: 'இன்று',
    yesterday: 'நேற்று',
    dontRemember: 'எனக்கு நினைவில்லை',
    viewDetails: 'விவரங்களை பார்',
    tryAgain: 'மீண்டும் முயல்க',
    loading: 'ஏற்றுகிறது...',
    noData: 'தரவு இல்லை.',
    incidentOptions: {
      SAFE_NO_ACTION: 'நான் எதையும் கிளிக் செய்யவில்லை',
      CLICKED_NO_ENTRY: 'கிளிக் செய்தேன், ஆனால் எதுவும் உள்ளிடவில்லை',
      DETAILS_ENTERED: 'என் விவரங்களை உள்ளிட்டேன்',
      OTP_SHARED: 'OTP / PIN பகிர்ந்தேன்',
      PERSONAL_DATA_SHARED: 'தனிப்பட்ட தகவல்களை பகிர்ந்தேன்',
      APP_INSTALLED: 'ஒரு பயன்பாட்டை நிறுவினேன்',
      MONEY_TRANSFERRED: 'பணம் அனுப்பினேன்',
      UNSURE: 'எனக்கு தெரியாது',
    } as Record<string, string>,
    whatIsPhishing: 'ஃபிஷிங் என்றால் என்ன?',
    howToIdentify: 'சந்தேகமான செய்திகளை எவ்வாறு அடையாளம் காண்பது',
    afterClicking: 'கிளிக் செய்த பிறகு என்ன செய்ய வேண்டும்?',
    sharedOtp: 'OTP பகிர்ந்தால் என்ன செய்வது?',
    moneyTransferred: 'பணம் அனுப்பப்பட்டால் என்ன செய்வது?',
    howToReport: 'மோசடியை எவ்வாறு புகாரளிப்பது?',
  },

  tanglish: {
    appName: 'WE GROW',
    tagline: 'Fraud Intelligence Platform',
    checkMessage: 'Message Check Pannunga',
    checkUrl: 'URL Check Pannunga',
    reportFraud: 'Fraud Report Pannunga',
    communityAlerts: 'Community Alerts',
    relatedFraud: 'Related Fraud',
    help: 'Help',
    profile: 'Profile',
    analyzing: 'Analysis nadakkuthu...',
    highRisk: 'ADHIGA APATHTHU',
    mediumRisk: 'NADUTTHARA APATHTHU',
    lowRisk: 'KURAINDHA APATHTHU',
    unknown: 'Theriyavillai',
    whyRisky: 'Yen apaththu?',
    whatHappened: 'Enna nadandhathu?',
    actionPlan: 'Action Plan',
    doThisNow: 'IPPOTHE SEYYUNGA',
    doNotDo: 'SEYYADHEENGA',
    contactGuidance: 'CONTACT PANNUNGA',
    reportTo: 'REPORT PANNUNGA',
    preserveEvidence: 'EVIDENCE VACHUKONGA',
    submitReport: 'Report Submit Pannunga',
    reportSuccess: 'Report successfully submit aaguthu.',
    reportDuplicate: 'Indha report munnaadiye submit aagirundhuchu.',
    messagePlaceholder: 'Sandheaga message-a idhe paste pannunga...',
    urlPlaceholder: 'https://sandheaga-thal.com',
    phonePlaceholder: '+91 9876543210',
    analyze: 'Analyze Pannunga',
    logout: 'Logout',
    language: 'Mozhi',
    english: 'English',
    tamil: 'Tamil',
    tanglish: 'Tanglish',
    networkError: 'WeGrow-a reach panna mudiyalai. Maadum try pannunga.',
    sessionExpired: 'Session expire aaguthu. Maadum login pannunga.',
    noActivity: 'Unga area-la recent activity illai.',
    recentActivity: 'Unga area-la recent fraud activity',
    possibleRelated: 'Related fraud activity irukka chance irukku',
    neverShareOtp: 'Unga OTP, PIN, password-a yaaridum share pannaadheenga.',
    loginTitle: 'WeGrow-la Login Pannunga',
    enterPhone: 'Unga phone number-a enter pannunga',
    sendOtp: 'OTP Anuppu',
    enterOtp: 'Unga phoneku vandha OTP-a enter pannunga',
    verifyOtp: 'OTP Verify Pannunga',
    chooseLanguage: 'Unga Mozhiya Theruvu Pannunga',
    languageDesc: 'WeGrow app-kku mozhi theruvu pannunga.',
    continue: 'Thoda',
    areaLabel: 'Area (optional)',
    incidentTime: 'Indha incident eppo nadandhathu?',
    justNow: 'Ippothe',
    today: 'Indru',
    yesterday: 'Nettru',
    dontRemember: 'Enaku nyabagam illai',
    viewDetails: 'Details Paaru',
    tryAgain: 'Maadium Try Pannunga',
    loading: 'Loading...',
    noData: 'Data illai.',
    incidentOptions: {
      SAFE_NO_ACTION: 'Naanum ethuvum click pannalai',
      CLICKED_NO_ENTRY: 'Click pannen, aana ethuvum enter pannalai',
      DETAILS_ENTERED: 'En details enter pannen',
      OTP_SHARED: 'OTP / PIN share pannen',
      PERSONAL_DATA_SHARED: 'Personal information share pannen',
      APP_INSTALLED: 'Oru app install pannen',
      MONEY_TRANSFERRED: 'Panam anupinen',
      UNSURE: 'Enakku theriyallai',
    } as Record<string, string>,
    whatIsPhishing: 'Phishing enna?',
    howToIdentify: 'Sandheaga messages-a epdi identify pannuvathu',
    afterClicking: 'Click panna piragu enna seyyanum?',
    sharedOtp: 'OTP share panniten na enna seyyanum?',
    moneyTransferred: 'Panam anupinen na enna seyyanum?',
    howToReport: 'Fraud-a epdi report pannuvathu?',
  },
};

type Strings = typeof strings.english;

interface LanguageContextType {
  language: Language;
  t: Strings;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('english');

  useEffect(() => {
    AsyncStorage.getItem('preferred_language').then((stored) => {
      if (stored) setLang(stored as Language);
    });
  }, []);

  function setLanguage(lang: Language) {
    setLang(lang);
    AsyncStorage.setItem('preferred_language', lang);
  }

  const t = strings[language] as Strings;

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
