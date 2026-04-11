# PlantCare RN — React Native + TypeScript

웹용(React.js) PlantCare 앱을 **React Native + TypeScript + Expo SDK 54** 기반으로 전체 변환한 프로젝트입니다.

---

## 📁 프로젝트 구조

```
PlantCareRN/
├── App.tsx                          # 앱 진입점 + 하단 탭 네비게이션
├── theme.ts                         # 색상, 간격, 폰트 크기 상수
├── types/
│   └── navigation.ts                # 화면(Screen) 타입 정의
├── components/
│   ├── shared/                      # 공통 컴포넌트
│   │   ├── PrimaryButton.tsx
│   │   ├── StatusChip.tsx
│   │   ├── PlantCard.tsx
│   │   ├── SensorWidget.tsx
│   │   ├── ChartPlaceholder.tsx
│   │   └── NotificationCard.tsx
│   └── screens/                     # 화면 컴포넌트 (12개)
│       ├── OnboardingScreen.tsx
│       ├── LoginScreen.tsx
│       ├── SignupScreen.tsx
│       ├── HomeScreen.tsx
│       ├── PlantDetailScreen.tsx
│       ├── AddPlantScreen.tsx
│       ├── AIDiagnosisScreen.tsx
│       ├── GrowthDiaryScreen.tsx
│       ├── SensorDashboardScreen.tsx
│       ├── NotificationsScreen.tsx
│       ├── PlantEncyclopediaScreen.tsx
│       └── SettingsScreen.tsx
├── package.json
├── tsconfig.json
└── app.json
```

---

## 🚀 시작 방법 (이 순서대로 정확히 실행)

### 1. 기존 node_modules 완전 삭제 후 재설치
```bash
# node_modules와 package-lock.json 삭제
rm -rf node_modules package-lock.json

# 클린 설치
npm install --legacy-peer-deps
```

### 2. 앱 실행
```bash
npx expo start
```

> 이후 터미널에 QR 코드가 뜨면:
> - **iOS**: Expo Go 앱으로 QR 스캔
> - **Android**: Expo Go 앱으로 QR 스캔
> - **시뮬레이터**: `i` (iOS) 또는 `a` (Android) 키 입력

### Windows에서 삭제 명령어
```powershell
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
```

---

## ⚠️ 주의사항

- `npx expo install --fix` 또는 `--check`는 **실행하지 마세요** — peer dependency 충돌이 발생합니다.
- 반드시 `npm install --legacy-peer-deps` 로 설치하세요.
- Node.js 18 이상 권장.

---

## 🔄 변환 요약

| 웹 (React.js)            | RN (React Native)              |
|--------------------------|--------------------------------|
| `div`, `span`            | `View`                         |
| `p`, `h1~h6`             | `Text`                         |
| `img`                    | `Image`                        |
| `input`, `textarea`      | `TextInput`                    |
| `button`                 | `TouchableOpacity`             |
| `className` (Tailwind)   | `StyleSheet.create()`          |
| `lucide-react` 아이콘    | `@expo/vector-icons` Ionicons  |
| CSS flexbox              | RN flexbox (기본 column 방향)  |
| `position: fixed`        | `position: absolute` / Modal   |
| `overflow-y: auto`       | `ScrollView`                   |
| `min-h-screen`           | `flex: 1`                      |

---

## 📦 의존성 (Expo SDK 54 기준)

| 패키지 | 버전 |
|--------|------|
| expo | ~54.0.33 |
| react | 19.1.0 |
| react-native | 0.81.5 |
| @expo/vector-icons | ^15.0.3 |
| expo-font | ~13.3.1 |
| expo-status-bar | ~3.0.9 |
| react-native-safe-area-context | ~5.6.0 |
| react-native-screens | ~4.16.0 |

