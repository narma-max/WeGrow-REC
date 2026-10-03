// ============================================================
// Navigation Types
// ============================================================

import { AnalyzeEndpointResponse } from '../types/api';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OTP: { phone: string };
  Language: undefined;
  Home: undefined;
  ScamChecker: undefined;
  URLChecker: undefined;
  AnalysisResult: { result: AnalyzeEndpointResponse };
  IncidentResponse: {
    analysisId?: number;
    riskLevel?: string;
    scamType?: string;
  };
  ReportFraud: {
    prefill?: {
      scam_type?: string;
      url?: string;
    };
  };
  CommunityAlerts: undefined;
  RelatedFraud: { fromAnalysis?: boolean };
  Profile: undefined;
  Help: undefined;
};
