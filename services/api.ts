import { Platform } from 'react-native';

const BASE_URL = 'http://172.16.xxx.xxx:8080'; // GateWay 포트 — 실제 IP로 교체 필요

export { BASE_URL };

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
    throw new Error((error as any).message ?? `HTTP ${response.status}`);
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
export const aiApi = {
  diagnose: async (imageUri: string, plantId: number): Promise<DiagnosisResult> => {
    const filename = imageUri.split('/').pop() || 'plant.jpg';
    const match    = /\.(\w+)$/.exec(filename);
    const type     = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('image', { uri: imageUri, name: filename, type } as any);
    formData.append('plantId', String(plantId));

    const response = await fetch(`${BASE_URL}/ai/gemini`, {
      method: 'POST',
      body: formData,
      ...(authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 응답 오류(${response.status}): ${errorText}`);
    }
    return response.json() as Promise<DiagnosisResult>;
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

export interface DiagnosisResult {
  diagnosisId:   number;
  plantId:       number;
  title:         string;
  details:       string;
  result:        string;
  imageUrl:      string;
  diagnosisDate: string;
}
