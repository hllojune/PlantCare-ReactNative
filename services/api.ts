// services/api.ts
import { Platform } from 'react-native';

const BASE_URL = 'http://172.16.xxx.xxx:8080'; // GateWay 포트

export { BASE_URL }; // AIDiagnosisScreen에서 직접 fetch할 때 필요

let authToken: string | null = null;
export function setToken(token: string) { authToken = token; }
export function clearToken() { authToken = null; }

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

// ── auth-service ───────────────────────────────────────────
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

// ── plant-service ──────────────────────────────────────────
export const plantApi = {
  getAll:  () => request<Plant[]>('/plant'),
  getById: (id: string) => request<Plant>(`/plant/${id}`),
  create:  (data: CreatePlantDto) =>
    request<Plant>('/plant', { method: 'POST', body: JSON.stringify(data) }),
  update:  (id: string, data: Partial<CreatePlantDto>) =>
    request<Plant>(`/plant/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:  (id: string) => request<void>(`/plant/${id}`, { method: 'DELETE' }),
};

// ── sensor-service ─────────────────────────────────────────
export const sensorApi = {
  getLatest:  () => request<SensorData>('/sensor/latest'),
  getHistory: (plantId: string) => request<SensorData[]>(`/sensor/history/${plantId}`),
};

// ── ai-service ─────────────────────────────────────────────
// FormData(multipart) 전송이라 공통 request() 대신 직접 fetch 사용
export const aiApi = {
  diagnose: async (imageUri: string, plantId: number): Promise<DiagnosisResult> => {
    const filename = imageUri.split('/').pop() || 'plant.jpg';
    const match    = /\.(\w+)$/.exec(filename);
    const type     = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('image', { uri: imageUri, name: filename, type } as any);
    formData.append('plantId', String(plantId));

    console.log('AI 진단 요청:', `${BASE_URL}/ai/gemini`);

    const response = await fetch(`${BASE_URL}/ai/gemini`, {
      method: 'POST',
      body: formData,
      // Content-Type 헤더 절대 넣지 않음 (fetch가 boundary 자동 설정)
      ...(authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 응답 오류(${response.status}): ${errorText}`);
    }

    const data: DiagnosisResult = await response.json();
    console.log('AI 진단 성공:', data);
    return data;
  },
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

// 실제 백엔드 응답 구조에 맞춤
export interface DiagnosisResult {
  diagnosisId:   number;
  plantId:       number;
  title:         string;
  details:       string;
  result:        string; // "진단완료" | "진단실패"
  imageUrl:      string;
  diagnosisDate: string;
}