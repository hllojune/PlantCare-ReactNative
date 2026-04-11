import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlantCard } from '../shared/PlantCard';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

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
  {
    id: '4',
    name: '다육이 삼총사',
    species: 'Mixed Succulents',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
    statusText: '창가에서 잘 자라는 중',
  },
];

const sensorData = { temperature: 24, humidity: 62, soilMoisture: 48 };

export function HomeScreen({ onNavigate }: NavigationProps) {
  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appTitle}>SPPKL</Text>
        <View style={styles.appBarRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onNavigate('notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onNavigate('settings')}
          >
            <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sensor Status Card */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Text style={styles.sensorTitle}>실시간 정원 상태</Text>
            <View style={styles.activeDot} />
          </View>
          <View style={styles.sensorGrid}>
            {[
              { label: '온도', value: sensorData.temperature, unit: '°C' },
              { label: '습도', value: sensorData.humidity, unit: '%' },
              { label: '토양', value: sensorData.soilMoisture, unit: '%' },
            ].map((item) => (
              <View key={item.label} style={styles.sensorItem}>
                <Text style={styles.sensorLabel}>{item.label}</Text>
                <Text style={styles.sensorValue}>
                  {item.value}
                  <Text style={styles.sensorUnit}>{item.unit}</Text>
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.sensorFooter}>
            <Ionicons name="hardware-chip-outline" size={12} color={Colors.textTertiary} />
            <Text style={styles.sensorFooterText}>ESP32 센서 어레이 • 활성</Text>
          </View>
        </View>

        {/* My Plants */}
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 식물</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>전체 보기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.plantList}>
            {mockPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                {...plant}
                onPress={() => onNavigate('detail', plant.id)}
              />
            ))}

            {/* Add Plant */}
            <TouchableOpacity
              style={styles.addPlantBtn}
              activeOpacity={0.8}
              onPress={() => onNavigate('add-plant')}
            >
              <View style={styles.addIconWrap}>
                <Ionicons name="add" size={18} color={Colors.textSecondary} />
              </View>
              <Text style={styles.addPlantText}>새 식물 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
    gap: Spacing.xl,
  },
  sensorCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  sensorTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
    shadowColor: Colors.primaryLight,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  sensorGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sensorItem: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  sensorLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  sensorValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sensorUnit: {
    fontSize: FontSize.base,
    fontWeight: '400',
  },
  sensorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sensorFooterText: {
    fontSize: 10,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primaryLight,
  },
  plantList: {
    gap: Spacing.md,
  },
  addPlantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  addIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlantText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
