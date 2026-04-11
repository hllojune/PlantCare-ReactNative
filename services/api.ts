// PlantCareRN/services/api.ts
import { Platform } from 'react-native';

// 개발 환경별 Gateway 주소
// - 실기기: ipconfig로 확인한 본인 PC의 실제 IP
// - Android 에뮬레이터: 10.0.2.2 (에뮬레이터 내부에서 호스트 PC를 가리키는 특수 IP)
// - iOS 시뮬레이터: localhost 가능
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080',      // Android 에뮬레이터 고정
  ios:     'http://본인 PC의 실제 IP:8080',         // ← 여기를 실제 IP로 변경
  default: 'http://본인 PC의 실제 IP:8080',
});

let authToken: string | null = null;

export function setToken(token: string) {
  authToken = token;
}
export function clearToken() {
  authToken = null;
}

// ── 공통 요청 함수 ─────────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ── auth-service  →  Gateway /auth/** ─────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; userId: number }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (nickname: string, email: string, password: string) =>
    request<{ userId: number }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ nickname, email, password }),
    }),

  getMe: () =>
    request<{ id: number; nickname: string; email: string }>('/auth/me'),
};

// ── plant-service  →  Gateway /plant/** ───────────────────
export const plantApi = {
  getAll: () =>
    request<Plant[]>('/plant'),

  getById: (id: string) =>
    request<Plant>(`/plant/${id}`),

  create: (data: CreatePlantDto) =>
    request<Plant>('/plant', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreatePlantDto>) =>
    request<Plant>(`/plant/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/plant/${id}`, { method: 'DELETE' }),
};

// ── sensor-service  →  Gateway /sensor/** ─────────────────
export const sensorApi = {
  getLatest: () =>
    request<SensorData>('/sensor/latest'),

  getHistory: (plantId: string) =>
    request<SensorData[]>(`/sensor/history/${plantId}`),
};

// ── ai-service  →  Gateway /ai/** ─────────────────────────
export const aiApi = {
  diagnose: (imageBase64: string) =>
    request<DiagnosisResult>('/ai/diagnose', {
      method: 'POST',
      body: JSON.stringify({ image: imageBase64 }),
    }),
};

// ── 타입 정의 ──────────────────────────────────────────────
export interface Plant {
  id: string;
  name: string;
  species: string;
  imageUrl?: string;
  memo?: string;
  plantedDate?: string;
}

export interface CreatePlantDto {
  name: string;
  species: string;
  memo?: string;
  plantedDate?: string;
}

export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  recordedAt: string;
}

export interface DiagnosisResult {
  status: string;          // '건강함' | '주의' | '위험'
  // confidence: number;      // 0 ~ 100
  recommendations: string[];
}