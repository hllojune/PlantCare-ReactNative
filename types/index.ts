export type Screen =
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'home'
  | 'encyclopedia'
  | 'encyclopedia-detail'
  | 'detail'
  | 'add-plant'
  | 'ai-diagnosis'
  | 'diary'
  | 'diary-write'
  | 'sensor'
  | 'sensor-register'
  | 'sensor-devices'
  | 'notifications'
  | 'settings';

export interface NavigationProps {
  onNavigate: (screen: string, plantId?: string) => void;
}

export interface DiaryEntry {
  id: string;
  date: string;
  time: string;
  plant: string;
  image: string;
  note: string;
  type: string;
  source: 'manual' | 'ai';
  confidence?: number;
}
