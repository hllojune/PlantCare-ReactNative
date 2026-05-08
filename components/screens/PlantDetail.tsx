import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { 
  ChevronLeft, 
  MoreVertical, 
  Droplets, 
  Sun, 
  Thermometer, 
  Calendar,
  PlusCircle,
  Settings
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function PlantDetail({ route, navigation }: { route: any; navigation: any }) {
  // navigation을 통해 전달된 plantId를 사용합니다.
  // const { plantId } = route.params; 

  const goBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Overlapping Image */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={goBack}>
          <ChevronLeft color="#ffffff" size={28} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <MoreVertical color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        {/* Plant Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800' }}
            style={styles.mainImage}
          />
          <View style={styles.imageOverlay} />
        </View>

        {/* Content Section */}
        <View style={styles.contentCard}>
          {/* Title & Species */}
          <View style={styles.titleSection}>
            <View>
              <Text style={styles.plantName}>몬스테라</Text>
              <Text style={styles.plantSpecies}>Monstera Deliciosa</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Droplets color="#ffffff" size={20} />
              <Text style={styles.actionButtonText}>물주기</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Status Info */}
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Calendar color="#6B7280" size={18} />
              <Text style={styles.statusText}>D+128</Text>
            </View>
            <View style={styles.statusItem}>
              <Droplets color="#3B82F6" size={18} />
              <Text style={styles.statusText}>2일 전</Text>
            </View>
          </View>

          {/* Real-time Sensor Data Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>실시간 상태</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SensorDashboard')}>
                <Text style={styles.detailLink}>상세 보기</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.sensorGrid}>
              <SensorWidget label="토양 수분" value="45%" icon={<Droplets color="#3B82F6" size={24} />} status="적정" />
              <SensorWidget label="주변 온도" value="24°C" icon={<Thermometer color="#EF4444" size={24} />} status="좋음" />
              <SensorWidget label="조도" value="Good" icon={<Sun color="#F59E0B" size={24} />} status="충분" />
            </View>
          </View>

          {/* Growth Diary Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>성장 일지</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DiaryWrite')}>
                <PlusCircle color="#3a7d44" size={24} />
              </TouchableOpacity>
            </View>
            
            {/* 임시 일지 카드 */}
            <View style={styles.diaryCard}>
              <Text style={styles.diaryDate}>2024.05.20</Text>
              <Text style={styles.diaryContent}>새 잎이 돋아나기 시작했어요! 너무 귀여워요.</Text>
            </View>
          </View>

          {/* Sensor Settings Button */}
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('SensorRegister')}
          >
            <Settings color="#374151" size={20} />
            <Text style={styles.secondaryButtonText}>센서 및 장치 설정</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- 하위 컴포넌트: SensorWidget ---
const SensorWidget = ({ label, value, icon, status }: { label: string; value: string; icon: React.ReactNode; status: string }) => (
  <View style={styles.sensorWidget}>
    {icon}
    <Text style={styles.sensorValue}>{value}</Text>
    <Text style={styles.sensorLabel}>{label}</Text>
    <View style={[styles.statusTag, { backgroundColor: '#E8F5E9' }]}>
      <Text style={styles.statusTagText}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // 이미지 영역이 상단까지 차도록
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    backgroundColor: '#f5f5f0',
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  contentCard: {
    marginTop: -30,
    backgroundColor: '#f5f5f0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  plantName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  plantSpecies: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#3a7d44',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  detailLink: {
    color: '#3a7d44',
    fontSize: 14,
    fontWeight: '600',
  },
  sensorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  sensorWidget: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  sensorLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusTag: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E7D32',
  },
  diaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  diaryDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  diaryContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
});