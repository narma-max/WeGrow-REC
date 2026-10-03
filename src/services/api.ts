// ============================================================
// WeGrow Mobile — Centralized API Service
// All backend calls go through here. No fetch() elsewhere.
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResponse,
  AnalyzeEndpointResponse,
  AnalyzeUrlResponse,
  IncidentResponseRequest,
  ActionPlan,
  ReportCreate,
  ReportResponse,
  RelatedIncident,
  Campaign,
  LocationTimeResponse,
  AnalyticsSummary,
} from '../types/api';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Replace with your machine's IP when testing on a physical device
// For Android emulator use 10.0.2.2 instead of localhost
const API_BASE = __DEV__
  ? 'http://10.0.2.2:8000'  // Android emulator → host machine
  : 'https://your-production-api.com'; // swap for prod

const TIMEOUT_MS = 15000;

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...(options.headers as Record<string, string> ?? {}),
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      // Clear session on 401
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user_session');
      throw new ApiError(401, 'Session expired. Please log in again.');
    }

    if (response.status === 403) {
      throw new ApiError(403, 'You do not have permission to perform this action.');
    }

    if (response.status === 429) {
      throw new ApiError(429, 'Too many requests. Please wait a moment and try again.');
    }

    if (!response.ok) {
      let detail = `Server error (${response.status})`;
      try {
        const body = await response.json();
        detail = body.detail || detail;
      } catch {}
      throw new ApiError(response.status, detail);
    }

    return response.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      throw new ApiError(0, 'Request timed out. Please check your connection.');
    }
    throw new ApiError(0, 'Unable to reach WeGrow right now. Please try again.');
  }
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const api = {
  auth: {
    requestOtp: (phone_number: string) =>
      request<{ status: string; message: string }>('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ phone_number }),
      }),

    verifyOtp: (phone_number: string, otp: string) =>
      request<AuthResponse>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone_number, otp }),
      }),

    logout: () =>
      request<{ status: string }>('/auth/logout', { method: 'POST' }),

    me: () =>
      request<{
        user_id: number;
        role: string;
        is_verified: boolean;
        phone_masked: string;
      }>('/auth/me'),
  },

  // ---------------------------------------------------------------------------
  // Analysis
  // ---------------------------------------------------------------------------

  analyze: {
    message: (payload: { message?: string; url?: string; phone?: string }) =>
      request<AnalyzeEndpointResponse>('/analyze', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    url: (url: string) =>
      request<AnalyzeUrlResponse>('/analyze-url', {
        method: 'POST',
        body: JSON.stringify({ url }),
      }),
  },

  // ---------------------------------------------------------------------------
  // Incident Response
  // ---------------------------------------------------------------------------

  incidentResponse: (payload: IncidentResponseRequest) =>
    request<ActionPlan>('/incident-response', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // ---------------------------------------------------------------------------
  // Reports
  // ---------------------------------------------------------------------------

  reports: {
    create: (payload: ReportCreate) =>
      request<ReportResponse>('/reports/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    list: () => request<ReportResponse[]>('/reports/'),
  },

  // ---------------------------------------------------------------------------
  // Community & Graph
  // ---------------------------------------------------------------------------

  community: {
    trending: () =>
      request<{ trending: any[] }>('/community/trending'),

    getInfo: (indicator_type: string, fingerprint: string) =>
      request<any>(`/community/${indicator_type}/${fingerprint}`),
  },

  relatedIncidents: (params: {
    phone?: string;
    url?: string;
    message?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params.phone) qs.set('phone', params.phone);
    if (params.url) qs.set('url', params.url);
    if (params.message) qs.set('message', params.message);
    return request<{ status: string; data: RelatedIncident }>(
      `/related-incidents/?${qs.toString()}`,
    );
  },

  campaigns: {
    list: () =>
      request<{ status: string; campaigns: Campaign[] }>('/graph/campaigns'),

    details: (campaignId: string) =>
      request<{ status: string; campaign: any }>(
        `/graph/campaigns/${campaignId}`,
      ),
  },

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  analytics: {
    summary: (range: string = '24h') =>
      request<AnalyticsSummary>(`/analytics/summary?range=${range}`),

    locationTime: () =>
      request<LocationTimeResponse>('/analytics/location-time'),

    scamTypes: (range: string = '24h') =>
      request<any[]>(`/analytics/scam-types?range=${range}`),
  },

  // ---------------------------------------------------------------------------
  // Health
  // ---------------------------------------------------------------------------

  health: () => request<{ status: string }>('/health'),
};

export { ApiError };
