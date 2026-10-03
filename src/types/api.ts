// ============================================================
// WeGrow Mobile — API Types
// Mirrors backend/schemas.py exactly. Do not duplicate logic.
// ============================================================

export interface AuthRequest {
  phone_number: string;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp: string;
}

export interface AuthResponse {
  user_id: number;
  role: string;
  is_verified: boolean;
  phone_masked: string;
  access_token: string;
  token_type: string;
}

export interface Entities {
  phone_numbers: string[];
  urls: string[];
  upi_ids: string[];
}

export interface UrlFeatures {
  url_length: number;
  domain_length: number;
  subdomain_count: number;
  digit_count: number;
  hyphen_count: number;
  special_character_count: number;
  has_ip_address: boolean;
  https: boolean;
  suspicious_keywords: string[];
  suspicious_tld: boolean;
  possible_brand_impersonation: string[];
}

export interface UrlReputation {
  provider: string;
  is_flagged: boolean;
  details: string;
}

export interface RedirectInfo {
  redirect_count: number;
  destination_changed: boolean;
  final_url: string;
  final_domain: string;
  error?: string;
}

export interface DomainInfo {
  registrable_domain: string;
  creation_date?: string;
  age_days?: number;
  status: string;
}

export interface IdnInfo {
  is_idn: boolean;
  is_punycode: boolean;
  mixed_script: boolean;
  confusable_detected: boolean;
  normalized_display_domain: string;
}

export interface OfficialBrandInfo {
  is_official: boolean;
  is_subdomain_of_official: boolean;
  brand_impersonation_detected: boolean;
  impersonated_brand?: string;
  matched_brand?: string;
}

export interface CommunityInfo {
  indicator_type?: string;
  fingerprint?: string;
  total_reports: number;
  unique_reporters: number;
  recent_reports: number;
  reviewed_reports: number;
  verified_reports: number;
  duplicate_reports: number;
  first_seen?: string;
  last_seen?: string;
  affected_areas: number;
  community_score: number;
  confidence?: string;
  evidence: string[];
}

export interface AnalyzeUrlResponse {
  url_score: number;
  risk_level: string;
  features: UrlFeatures;
  reputation: UrlReputation;
  reputation_details: Record<string, any>[];
  redirects?: RedirectInfo;
  domain_info?: DomainInfo;
  idn_info?: IdnInfo;
  brand_info?: OfficialBrandInfo;
  community_info?: CommunityInfo;
  canonical_url?: string;
  url_fingerprint?: string;
  reasons: string[];
}

export interface MessageFusion {
  score?: number;
  probability?: number;
  probability_status: string;
  score_type: string;
  language: string;
  scam_type: string;
  intent: string;
  signals: string[];
}

export interface UrlFusion {
  score?: number;
  score_type: string;
  features?: Record<string, any>;
  reputation?: Record<string, any>;
  community?: Record<string, any>;
  redirects?: Record<string, any>;
  domain?: Record<string, any>;
  homograph?: Record<string, any>;
}

export interface GraphFusion {
  score?: number;
  campaign_status: string;
  related_indicators?: Record<string, any>;
  campaigns?: string[];
}

export interface Evidence {
  source: string;
  type: string;
  strength: string;
  detail: string;
}

export interface Confidence {
  level: string;
  reasons: string[];
}

export interface AnalyzeEndpointResponse {
  overall_score: number;
  risk_level: string;
  confidence: Confidence;
  message: MessageFusion;
  url: UrlFusion;
  graph: GraphFusion;
  threat_intelligence: Record<string, any>;
  component_scores: Record<string, any>;
  weighted_contributions: Record<string, number>;
  reasons: string[];
  recommended_actions: string[];
  evidence: Evidence[];
  extracted_urls: AnalyzeUrlResponse[];
  // Backward compat fields
  message_score?: number;
  url_score?: number;
  community_score?: any;
  threat_intelligence_score?: any;
  language?: string;
  scam_type?: string;
  intent?: string;
  signals: string[];
  entities?: Entities;
  url_analysis?: AnalyzeUrlResponse;
  analysis_id?: number;
}

export interface IncidentResponseRequest {
  analysis_id?: number;
  incident_state: string;
  clicked?: boolean;
  credential_shared?: boolean;
  otp_shared?: boolean;
  personal_data_shared?: boolean;
  app_installed?: boolean;
  money_transferred?: boolean;
  original_risk_level?: string;
  original_scam_type?: string;
}

export interface ActionPlan {
  incident_state: string;
  severity: string;
  immediate_actions: string[];
  do_not_do: string[];
  contact_guidance: string[];
  evidence_to_preserve: string[];
  reporting_guidance: string[];
}

export interface ReportCreate {
  message_content?: string;
  url?: string;
  phone_number?: string;
  scam_type?: string;
  user_id?: number;
  report_source?: string;
  location?: string;
  area_id?: string;
  area_name?: string;
  incident_at?: string | null;
}

export interface ReportResponse {
  id: number;
  scam_type?: string;
  created_at: string;
  report_source?: string;
  moderation_status?: string;
  location?: string;
  area_id?: string;
  area_name?: string;
  incident_at?: string;
  is_duplicate: boolean;
  duplicate_reason?: string;
  graph_sync_status?: string;
}

export interface RelatedIncident {
  related_indicators?: {
    phones: string[];
    urls: string[];
    domains: string[];
  };
  campaigns?: string[];
  report_count?: number;
  affected_areas?: string[];
}

export interface Campaign {
  campaign_id: string;
  status: string;
  phones: number;
  urls: number;
  total_reports?: number;
  report_count?: number;
  affected_areas?: string[];
  peak_time_window?: string;
  reports_in_peak_window?: number;
  first_seen?: string;
  last_seen?: string;
}

export interface TrendingIndicator {
  indicator: string;
  indicator_type: string;
  reports_24h: number;
  growth: string;
}

export interface RegionalAlert {
  area: string;
  count: number;
}

export interface LocationTimeResponse {
  status: string;
  recent_24h_activity: number;
  first_seen?: string;
  last_seen?: string;
  reports_by_area: RegionalAlert[];
  reports_over_time: { date: string; count: number }[];
}

export interface AnalyticsSummary {
  total_reports: number;
  active_campaigns: number;
  suspicious_urls: number;
  suspicious_phones: number;
  recent_reports: number;
  high_confidence_indicators: number;
}

export type Language = 'english' | 'tamil' | 'tanglish';

export interface UserSession {
  user_id: number;
  role: string;
  is_verified: boolean;
  phone_masked: string;
  access_token: string;
  preferred_language: Language;
}
