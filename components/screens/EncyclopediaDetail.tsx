import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  Heart,
  Droplets,
  Sun,
  Thermometer,
  CloudRain,
  Plus,
  SquarePen, // 웹의 PenSquare 대체
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- Types ---
export interface EncyclopediaDetailProps {
  onNavigate: (screen: string, plantId?: string) => void;
  plantId: string | null;
}

export interface CareData {
  water: string;
  light: string;
  temperature: string;
  humidity: string;
}

export interface PlantData {
  name: string;
  scientificName: string;
  image: string;
  difficulty: string;
  description: string;
  care: CareData;
}

interface CareCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// --- Mock Data ---
const encyclopediaData: Record<string, PlantData> = {
  e1: {
    name: "몬스테라 델리시오사",
    scientificName: "Monstera Deliciosa",
    image: "https://images.unsplash.com/photo-1608327624934-69f40c5a819b?w=800",
    difficulty: "보통",
    description:
      "매력적인 구멍이 뚫린 커다란 잎이 특징인 열대 관엽식물입니다. 실내 환경에 잘 적응하며 공기 정화 능력이 뛰어나 초보자도 비교적 쉽게 키울 수 있습니다. 생명력이 강하고 성장 속도가 빨라 플랜테리어(Planterior) 식물로 인기가 높습니다.",
    care: {
      water: "겉흙이 말랐을 때 듬뿍",
      light: "반그늘에서 잘 자라요",
      temperature: "18–25°C (최저 15°C)",
      humidity: "60% 이상 (다습)",
    },
  },
  // 필요한 데이터 추가...
};

// --- Sub Component: Care Card ---
const CareCard: React.FC<CareCardProps> = ({ icon, label, value }) => (
  <View style={styles.careCard}>
    <View style={styles.careIconCircle}>{icon}</View>
    <View style={styles.careTextContainer}>
      <Text style={styles.careLabel}>{label}</Text>
      <Text style={styles.careValue} numberOfLines={2}>{value}</Text>
    </View>
  </View>
);

// --- Main Component ---
export function EncyclopediaDetail({ onNavigate, plantId }: EncyclopediaDetailProps) {
  // 해당하는 데이터가 없으면 기본값(e1) 사용
  const plant = plantId && encyclopediaData[plantId] ? encyclopediaData[plantId] : encyclopediaData["e1"];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate("encyclopedia")}>
          <ChevronLeft color="#111827" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Heart color="#EF4444" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Full Bleed Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: plant.image }} style={styles.heroImage} />
        </View>

        {/* Content Sheet (Overlaps Image) */}
        <View style={styles.contentSheet}>
          
          {/* Title & Difficulty */}
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.scientificName}>{plant.scientificName}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{plant.difficulty}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{plant.description}</Text>

          {/* Care Guidelines (Grid) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>관리 가이드</Text>
            <View style={styles.careGrid}>
              <CareCard 
                icon={<Droplets color="#3B82F6" size={20} />} 
                label="물주기" 
                value={plant.care.water} 
              />
              <CareCard 
                icon={<Sun color="#F59E0B" size={20} />} 
                label="일조량" 
                value={plant.care.light} 
              />
              <CareCard 
                icon={<Thermometer color="#EF4444" size={20} />} 
                label="적정 온도" 
                value={plant.care.temperature} 
              />
              <CareCard 
                icon={<CloudRain color="#0EA5E9" size={20} />} 
                label="적정 습도" 
                value={plant.care.humidity} 
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => onNavigate("add-plant")}
            >
              <Plus color="#ffffff" size={20} />
              <Text style={styles.primaryButtonText}>내 식물로 등록하기</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => onNavigate("diary-write")}
            >
              <SquarePen color="#3a7d44" size={18} />
              <Text style={styles.secondaryButtonText}>성장 기록 쓰기</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  imageContainer: {
    width: width,
    height: width * 1.1, // 이미지를 화면 상단에 큼직하게 배치
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentSheet: {
    flex: 1,
    marginTop: -40, // 이미지를 타고 올라가는 효과
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleLeft: {
    flex: 1,
    paddingRight: 16,
  },
  plantName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  difficultyBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // 최신 RN에서 지원하는 gap 속성
  },
  careCard: {
    width: (width - 48 - 12) / 2, // 전체 너비에서 패딩(48)과 갭(12)을 빼고 반으로 나눔
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12, // gap 미지원 기기 대비
  },
  careIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  careTextContainer: {
    flex: 1,
  },
  careLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  careValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 20,
  },
  actionContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#3a7d44',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f0',
    borderWidth: 1,
    borderColor: 'rgba(58, 125, 68, 0.3)',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#3a7d44',
    fontSize: 16,
    fontWeight: '700',
  },
});