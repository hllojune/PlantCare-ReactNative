import axios, { AxiosError, AxiosHeaders } from 'axios';
import { Platform } from 'react-native';

const DEVICE_BASE_URL = 'http://192.168.219.51:8080';
const WEB_BASE_URL = 'http://localhost:8080';

const BASE_URL = Platform.OS === 'web' ? WEB_BASE_URL : DEVICE_BASE_URL;

export { BASE_URL };

let authToken: string | null = null;

export function setToken(token: string) {
  authToken = token;
}

export function clearToken() {
  authToken = null;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  config.headers = headers;
  return config;
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
    const response = await request<ApiResponse<{ token: string }>>({
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
