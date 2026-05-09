import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform, StatusBar,
} from 'react-native';
import { Plus, Bell, CloudRain } from 'lucide-react-native';
import { PlantCard } from '../shared/PlantCard';

const mockPlants = [
  {
    id: '1',
    name: '몬스테라',
    species: 'Monstera Deliciosa',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    statusText: '2일 전 물을 줬어요',
  },
  {
    id: '2',
    name: '산세베리아',
    species: 'Sansevieria trifasciata',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400',
    statusText: '토양 수분 안정적',
  },
  {
    id: '3',
    name: '보스턴 고사리',
    species: 'Nephrolepis exaltata',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
    statusText: '곧 분무가 필요해요',
  },
];

interface HomeProps { navigation: any; }

export function Home({ navigation }: HomeProps) {
  const onNavigate = (screen: string, params: Record<string, unknown> = {}) =>
    navigation.navigate(screen, params);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* AppBar */}
        <View style={styles.appBar}>
          <Text style={styles.appTitle}>PlantCare</Text>
          <View style={styles.appBarRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate('notifications')}>
              <Bell color="#374151" size={24} />
              <View style={styles.badge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => onNavigate('settings')}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.mainContent}>
          {/* Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingTitle}>좋은 아침입니다, 김식물님! ☀️</Text>
            <Text style={styles.greetingSubtitle}>오늘 물을 기다리는 식물이 2개 있어요.</Text>
          </View>

          {/* Weather Widget */}
          <View style={styles.weatherWidget}>
            <View style={styles.weatherIconContainer}>
              <CloudRain color="#2E7D32" size={40} strokeWidth={1.8} />
              <Text style={styles.temperature}>22°C</Text>
            </View>
            <View style={styles.weatherTextContainer}>
              <Text style={styles.weatherText}>
                오늘은 하루 종일 비가 와요. 식물들의 과습에 주의하세요!
              </Text>
            </View>
          </View>

          {/* My Plants */}
          <View style={styles.myPlantsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>내 식물</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>전체 보기</Text></TouchableOpacity>
            </View>

            {mockPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                {...plant}
                onPress={() => onNavigate('detail', { plantId: plant.id })}
              />
            ))}

            <TouchableOpacity style={styles.addPlantButton} onPress={() => onNavigate('add-plant')}>
              <View style={styles.addIconCircle}>
                <Plus color="#9CA3AF" size={20} />
              </View>
              <Text style={styles.addPlantText}>새 식물 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: '#f5f5f0' },
  contentContainer: { paddingBottom: 100 },
  appBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16,
    backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  appTitle: { fontSize: 20, fontWeight: '700', color: '#3a7d44' },
  appBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: { padding: 8, position: 'relative' },
  badge: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4,
  },
  profileButton: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, borderColor: 'rgba(124, 203, 138, 0.4)', overflow: 'hidden',
  },
  profileImage: { width: '100%', height: '100%' },
  mainContent: { padding: 16 },
  greetingSection: { marginBottom: 16 },
  greetingTitle: { fontSize: 24, fontWeight: '700', color: '#2E7D32', lineHeight: 32 },
  greetingSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  weatherWidget: {
    flexDirection: 'row', backgroundColor: '#F1F8E9', borderRadius: 16,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(46, 125, 50, 0.1)', marginBottom: 24,
  },
  weatherIconContainer: { minWidth: 80, alignItems: 'center', justifyContent: 'center' },
  temperature: { fontSize: 24, fontWeight: '700', color: '#2E7D32', marginTop: 4 },
  weatherTextContainer: {
    flex: 1, borderLeftWidth: 1, borderLeftColor: 'rgba(46, 125, 50, 0.15)', paddingLeft: 16,
  },
  weatherText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  myPlantsSection: { marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  seeAllText: { fontSize: 14, color: '#7CCB8A' },
  addPlantButton: {
    flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed', marginTop: 4,
  },
  addIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  addPlantText: { fontSize: 14, fontWeight: '500', color: '#9CA3AF' },
});
