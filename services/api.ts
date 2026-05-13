import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const DEVICE_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_DEVICE || 'http://localhost:8080';
const WEB_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL_WEB || 'http://localhost:8080';


const BASE_URL = Platform.OS === 'web' ? WEB_BASE_URL : DEVICE_BASE_URL;

export { BASE_URL };

const TOKEN_KEY = 'authToken';
const NICKNAME_KEY = 'userNickname';

// 앱이 실행되는 동안 사용할 메모리 캐시 (매번 디스크에서 읽으면 느리므로)
let authToken: string | null = null;
let currentNickname = '';

export function setToken(token: string) {
  authToken = token;
}

export function clearToken() {
  authToken = null;
  currentNickname = '';
}

export function setNickname(nickname: string) {
  currentNickname = nickname;
}

export function getNickname() {
  return currentNickname;
}

/**
 * [추가된 부분 1] 앱 시작 시 저장된 토큰을 불러오는 함수
 */
export const restoreAuth = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const nickname = await SecureStore.getItemAsync(NICKNAME_KEY);

    if (token) {
      authToken = token;
      currentNickname = nickname || '';
      return true; // 복원 성공 (자동 로그인)
    }
  } catch (error) {
    console.error('토큰 복원 실패:', error);
  }
  return false; // 복원 실패 (로그인 필요)
};

/**
 * [추가된 부분 2] 로그인 성공 시 토큰과 닉네임을 기기에 저장하는 함수
 * (Login.tsx에서 로그인 API 성공 직후 호출해야 함)
 */
export const setAuthData = async (token: string, nickname: string) => {
  try {
    authToken = token;
    currentNickname = nickname;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(NICKNAME_KEY, nickname);
  } catch (error) {
    console.error('토큰 저장 실패:', error);
  }
};

/**
 * [추가된 부분 3] 로그아웃 시 기기에서 토큰을 삭제하는 함수
 * (Settings.tsx의 로그아웃 버튼에서 호출해야 함)
 */
export const clearAuthData = async () => {
  try {
    authToken = null;
    currentNickname = '';
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(NICKNAME_KEY);
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
};

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios 요청 인터셉터 (F2 문제 해결)
 * 모든 백엔드 요청 헤더에 Authorization 토큰을 자동으로 실어 보냅니다.
 */
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

function toErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (typeof responseMessage === 'string' && responseMessage.length > 0) {
      return responseMessage;
    }

    if (error.code === AxiosError.ERR_NETWORK) {
      return `Network error. Check that the API is reachable at ${BASE_URL}.`;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected request failure.';
}

async function request<T>(config: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
}) {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw new Error(toErrorMessage(error));
  }
}

export const authApi = {
  async login(userId: string, password: string) {
    const response = await request<ApiResponse<{ token: string; nickname: string }>>({
      url: '/auth/login',
      method: 'POST',
      data: { userId, password },
    });

    return response.data;
  },

  async signup(userId: string, nickname: string, email: string, password: string) {
    const response = await request<ApiResponse<string>>({
      url: '/auth/signup',
      method: 'POST',
      data: { userId, nickname, email, password },
    });

    return response.data;
  },
};

export const plantApi = {
  getAll: () => request<Plant[]>({ url: '/plant', method: 'GET' }),
  getById: (id: string) => request<Plant>({ url: `/plant/${id}`, method: 'GET' }),
  create: (data: CreatePlantDto) => request<Plant>({ url: '/plant', method: 'POST', data }),
  update: (id: string, data: Partial<CreatePlantDto>) =>
    request<Plant>({ url: `/plant/${id}`, method: 'PUT', data }),
  delete: (id: string) => request<void>({ url: `/plant/${id}`, method: 'DELETE' }),
};

// plant-service의 도감 API: 응답 래퍼 없이 DTO/배열을 그대로 반환한다고 가정.
export const bookApi = {
  getAll: () => request<PlantBookItem[]>({ url: '/book', method: 'GET' }),
  search: (name: string) =>
    request<PlantBookItem[]>({
      url: `/book/search?name=${encodeURIComponent(name)}`,
      method: 'GET',
    }),
  getById: (speciesCode: string) =>
    request<PlantBookItem>({
      url: `/book/${encodeURIComponent(speciesCode)}`,
      method: 'GET',
    }),
};

export const sensorApi = {
  getLatest: () => request<SensorData>({ url: '/sensor/latest', method: 'GET' }),
  getHistory: (plantId: string) =>
    request<SensorData[]>({ url: `/sensor/history/${plantId}`, method: 'GET' }),
};

export const aiApi = {
  async diagnose(imageUri: string, plantId: number): Promise<DiagnosisResult> {
    const filename = imageUri.split('/').pop() || 'plant.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('image', { uri: imageUri, name: filename, type } as any);
    formData.append('plantId', String(plantId));

    try {
      const response = await apiClient.post<DiagnosisResult>('/ai/gemini', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(toErrorMessage(error));
    }
  },
};

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
  diagnosisId: number;
  plantId: number;
  title: string;
  details: string;
  result: string;
  imageUrl: string;
  diagnosisDate: string;
}

export interface PlantBookItem {
  speciesCode: string;
  name: string;
  scientificName?: string;
  imageUrl?: string;
  difficulty?: string;
}
