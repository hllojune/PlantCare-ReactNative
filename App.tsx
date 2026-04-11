import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from './types/navigation';

// Screens
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { SignupScreen } from './components/screens/SignupScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { PlantDetailScreen } from './components/screens/PlantDetailScreen';
import { AddPlantScreen } from './components/screens/AddPlantScreen';
import { AIDiagnosisScreen } from './components/screens/AIDiagnosisScreen';
import { GrowthDiaryScreen } from './components/screens/GrowthDiaryScreen';
import { SensorDashboardScreen } from './components/screens/SensorDashboardScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { PlantEncyclopediaScreen } from './components/screens/PlantEncyclopediaScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

import { Colors, FontSize, Spacing } from './theme';

type BottomTabId = 'home' | 'encyclopedia' | 'ai-diagnosis' | 'diary';

const BOTTOM_TABS: {
  id: BottomTabId;
  label: string;
  icon: string;
  activeIcon: string;
}[] = [
  { id: 'home', label: '홈', icon: 'home-outline', activeIcon: 'home' },
  { id: 'encyclopedia', label: '식물도감', icon: 'book-outline', activeIcon: 'book' },
  { id: 'ai-diagnosis', label: 'AI 카메라', icon: 'camera-outline', activeIcon: 'camera' },
  { id: 'diary', label: '일지', icon: 'journal-outline', activeIcon: 'journal' },
];

const NO_BOTTOM_NAV: Screen[] = [
  'onboarding', 'login', 'signup', 'detail', 'add-plant', 'settings',
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const handleNavigate = (screen: string, plantId?: string) => {
    setCurrentScreen(screen as Screen);
    if (plantId) setSelectedPlantId(plantId);
  };

  const showBottomNav = !NO_BOTTOM_NAV.includes(currentScreen);

  const renderScreen = () => {
    const props = { onNavigate: handleNavigate };
    switch (currentScreen) {
      case 'onboarding':     return <OnboardingScreen {...props} />;
      case 'login':          return <LoginScreen {...props} />;
      case 'signup':         return <SignupScreen {...props} />;
      case 'home':           return <HomeScreen {...props} />;
      case 'encyclopedia':   return <PlantEncyclopediaScreen {...props} />;
      case 'detail':         return <PlantDetailScreen {...props} />;
      case 'add-plant':      return <AddPlantScreen {...props} />;
      case 'ai-diagnosis':   return <AIDiagnosisScreen {...props} />;
      case 'diary':          return <GrowthDiaryScreen {...props} />;
      case 'sensor':         return <SensorDashboardScreen {...props} />;
      case 'notifications':  return <NotificationsScreen {...props} />;
      case 'settings':       return <SettingsScreen {...props} />;
      default:               return <HomeScreen {...props} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Screen Content */}
          <View style={styles.screenContainer}>
            {renderScreen()}
          </View>

          {/* Bottom Navigation */}
          {showBottomNav && (
            <View style={styles.bottomNav}>
              {BOTTOM_TABS.map((tab) => {
                const isActive = currentScreen === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={styles.tabItem}
                    onPress={() => handleNavigate(tab.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={(isActive ? tab.activeIcon : tab.icon) as any}
                      size={24}
                      color={isActive ? Colors.primary : Colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        isActive && styles.tabLabelActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 0 : Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
