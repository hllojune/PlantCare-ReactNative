# 🌿 PlantCare RN (v2.0.0-alpha)

기존 웹(React.js) 기반 프로젝트를 **React Native + TypeScript + Expo** 환경으로 전면 재설계 및 마이그레이션한 버전입니다.

## 📌 주요 업데이트 및 기술 스택
* **Platform**: React Native (Expo SDK 54)
* **Language**: TypeScript (Strict Type Check 적용)
* **UI System**: `lucide-react-native`, Custom Native StyleSheet
* **Navigation**: React Navigation (Stack & Bottom Tab) 기반 라우팅

---

## 📁 프로젝트 구조 (아키텍처)
모바일 앱의 유지보수와 컴포넌트 재사용성을 위해 화면과 공통 요소를 분리했습니다.

```text
PlantCareRN/
├── App.tsx                  # 네비게이션 구조 및 앱 진입점
├── theme.ts                 # 전역 디자인 시스템 (Colors, Spacing)
├── types/                   # Navigation 및 API 전역 타입 정의
├── components/
│   ├── shared/              # 공통 UI 컴포넌트 (PlantCard, SensorWidget 등)
│   └── screens/             # 기능별 독립 화면 (12개 화면 변환 완료)
└── ...

```

---

## 🔄 주요 변환 사항 (Web to Native)

백엔드 및 IoT 연동 시 참고해야 할 UI/UX 기술적 변경점입니다.

| 구분 | 변경 내용 | 비고 |
| --- | --- | --- |
| **UI Components** | HTML Tag → Native Components | View, Text, Image, ScrollView 적용 |
| **Interaction** | Click → Touch Feedback | TouchableOpacity 적용으로 터치감 개선 |
| **Routing** | State Routing → React Navigation | Native Stack 기반의 부드러운 화면 전환 |
| **Layout** | CSS Flexbox → Yoga Engine | Flex-direction 기본값 Column 설정 |
| **Media** | HTML Input → Expo Image Picker | 기기 갤러리 및 카메라 연동 최적화 |

---

## 📦 의존성 현황

* **Core**: `expo`, `react-native`, `react`
* **UI/Icons**: `lucide-react-native`, `@expo/vector-icons`
* **Navigation**: `@react-navigation/native`, `@react-navigation/bottom-tabs`
* **Safe Area**: `react-native-safe-area-context`

---

**Note**: 본 버전은 UI/UX 전면 개편에 따른 메이저 업데이트(v2.0.0)입니다. 이후 작업은 백엔드 API 연동 및 실제 센서 데이터 매핑을 위주로 진행될 예정입니다.