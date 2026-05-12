import React, { useState, useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Home as HomeIcon } from 'lucide-react-native';

// API 파일에서 방금 만든 함수 불러오기
import { restoreAuth } from './services/api';

// Screens
import { Onboarding } from './components/screens/Onboarding';
import { Login } from './components/screens/Login';
import { Signup } from './components/screens/Signup';
import { Home } from './components/screens/Home';
import { PlantDetail } from './components/screens/PlantDetail';
import { AddPlant } from './components/screens/AddPlant';
import { AIDiagnosis } from './components/screens/AIDiagnosis';
import { GrowthDiary } from './components/screens/GrowthDiary';
import { DiaryWrite } from './components/screens/DiaryWrite';
import { SensorDashboard } from './components/screens/SensorDashboard';
import { Notifications } from './components/screens/Notifications';
import { PlantEncyclopedia } from './components/screens/PlantEncyclopedia';
import { Settings } from './components/screens/Settings';

import { Colors, FontSize, Spacing } from './theme';

// 네비게이터 생성
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 💡 하단 탭 네비게이터 (바텀 네비게이션이 보이는 화면들)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // 상단 기본 헤더 숨김
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : Spacing.sm,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'encyclopedia') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'ai-diagnosis') iconName = focused ? 'camera' : 'camera-outline';
          else if (route.name === 'diary') iconName = focused ? 'journal' : 'journal-outline';

          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="home" component={Home} options={{ title: '홈' }} />
      <Tab.Screen name="encyclopedia" component={PlantEncyclopedia} options={{ title: '식물도감' }} /> 
      <Tab.Screen name="ai-diagnosis">
        {(props) => <AIDiagnosis {...props} onNavigate={(screen) => props.navigation.navigate(screen)} />}
      </Tab.Screen>
      <Tab.Screen name="diary" options={{ title: '일지' }}>
        {(props) => <GrowthDiary {...props} onNavigate={(screen) => props.navigation.navigate(screen)} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// 💡 전체 스택 네비게이터 (앱의 최상위 라우터)
export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('onboarding'); // 기본값은 온보딩 화면

  useEffect(() => {
    const initApp = async () => {
      // 기기에 저장된 토큰이 있는지 확인
      const hasToken = await restoreAuth();

      if (hasToken) {
        // 토큰이 있다면 바로 메인 탭으로 이동시킴
        setInitialRoute('MainTabs');
      }

      // 검사가 끝나면 앱을 보여줌
      setIsReady(true);
    };

    initApp();
  }, []);

  // 토큰을 검사하는 찰나의 순간 동안 보여줄 로딩 화면
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }} // 모든 화면에서 기본 헤더 숨김
        >
          {/* 인증 및 온보딩 (바텀 탭 없음) */}
          <Stack.Screen name="onboarding">
            {(props) => <Onboarding onNavigate={() => props.navigation.navigate('login' as never)} />}
          </Stack.Screen>
          <Stack.Screen name="login">
            {(props) => <Login {...props} onNavigate={(screen) => props.navigation.navigate(screen as never)} />}
          </Stack.Screen>
          <Stack.Screen name="signup">
            {(props) => <Signup {...props} onNavigate={(screen) => props.navigation.navigate(screen as never)} />}
          </Stack.Screen>

          {/* 메인 탭 화면들 (여기로 이동하면 바텀 탭이 나타남) */}
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />

          {/* 상세 및 기타 화면들 (바텀 탭 없음) */}
          <Stack.Screen name="detail" component={PlantDetail} />
          <Stack.Screen name="add-plant" component={AddPlant} />
          <Stack.Screen name="sensor" component={SensorDashboard} />
          <Stack.Screen name="notifications">
            {(props) => <Notifications {...props} onNavigate={(screen) => props.navigation.navigate(screen)} />}
          </Stack.Screen>
          <Stack.Screen name="settings">
            {(props) => <Settings {...props} onNavigate={(screen) => props.navigation.navigate(screen)} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
