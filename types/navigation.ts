export type Screen =
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'home'
  | 'encyclopedia'
  | 'detail'
  | 'add-plant'
  | 'ai-diagnosis'
  | 'diary'
  | 'sensor'
  | 'notifications'
  | 'settings';

export interface NavigationProps {
  onNavigate: (screen: Screen, plantId?: string) => void;
}
