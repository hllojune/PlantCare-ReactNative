import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusChip } from '../shared/StatusChip';
import { SensorWidget } from '../shared/SensorWidget';
import { ChartPlaceholder } from '../shared/ChartPlaceholder';
import { PrimaryButton } from '../shared/PrimaryButton';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

type TabId = 'overview' | 'sensor' | 'diary' | 'ai';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: '개요' },
  { id: 'sensor', label: '센서 데이터' },
  { id: 'diary', label: '일지' },
  { id: 'ai', label: 'AI 결과' },
];

const plant = {
  name: '몬스테라 델리시오사',
  species: '스위스 치즈 플랜트',
  age: '2년 3개월',
  plantingDate: '2023년 3월 15일',
  image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
};

const diaryEntries = [
  {
    id: '1',
    date: '2025년 11월 18일',
    image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=200',
    note: '새 잎이 펼쳐지고 있어요! 성장 상태가 좋아 보여요.',
  },
  {
    id: '2',
    date: '2025년 11월 10일',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200',
    note: '물과 비료를 줬어요. 잎이 싱싱해 보여요.',
  },
];

export function PlantDetailScreen({ onNavigate }: NavigationProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>식물 상세정보</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image source={{ uri: plant.image }} style={styles.heroImage} />

        {/* Basic Info */}
        <View style={styles.basicInfo}>
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.plantSpecies}>{plant.species}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="leaf-outline" size={16} color={Colors.primaryLight} />
              <Text style={styles.metaText}>{plant.age}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primaryLight} />
              <Text style={styles.metaText}>심은 날짜: {plant.plantingDate}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <>
              <View style={styles.chipRow}>
                <StatusChip label="건강함" variant="success" />
                <StatusChip label="수분 충분" variant="info" />
                <StatusChip label="적정 온도" variant="success" />
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>관리 팁</Text>
                {[
                  '흙 표면 5cm가 마르면 물을 주세요',
                  '밝은 간접광을 제공해 주세요',
                  '주 1회 잎에 분무해 습도를 유지하세요',
                ].map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {activeTab === 'sensor' && (
            <>
              <View style={styles.sensorGrid}>
                <View style={{ flex: 1 }}>
                  <SensorWidget
                    icon={<Ionicons name="thermometer-outline" size={20} color={Colors.primaryLight} />}
                    label="온도"
                    value="22"
                    unit="°C"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <SensorWidget
                    icon={<Ionicons name="water-outline" size={20} color={Colors.primaryLight} />}
                    label="습도"
                    value="65"
                    unit="%"
                  />
                </View>
              </View>
              <SensorWidget
                icon={<Ionicons name="rainy-outline" size={20} color={Colors.primaryLight} />}
                label="토양 수분"
                value="68"
                unit="%"
              />
              <ChartPlaceholder title="24시간 센서 기록" />
            </>
          )}

          {activeTab === 'diary' && (
            <View style={styles.diaryList}>
              {diaryEntries.map((entry) => (
                <View key={entry.id} style={styles.diaryCard}>
                  <Image source={{ uri: entry.image }} style={styles.diaryImage} />
                  <View style={styles.diaryContent}>
                    <Text style={styles.diaryDate}>{entry.date}</Text>
                    <Text style={styles.diaryNote}>{entry.note}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'ai' && (
            <>
              <View style={styles.card}>
                <View style={styles.aiHeader}>
                  <Text style={styles.cardTitle}>최근 진단</Text>
                  <StatusChip label="건강함" variant="success" />
                </View>
                <Text style={styles.aiConfidence}>
                  <Text style={styles.aiConfidenceLabel}>신뢰도: </Text>94%
                </Text>
                <Text style={styles.aiDescription}>
                  식물이 생기 넘치는 초록색 잎을 가지고 있으며 질병이나 해충 피해의
                  징후가 없습니다. 현재의 관리 루틴을 계속 유지하세요.
                </Text>
              </View>
              <PrimaryButton fullWidth onPress={() => {}}>
                일지에 저장
              </PrimaryButton>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  appBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  backBtn: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  appBarTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  heroImage: {
    width: '100%',
    height: 256,
  },
  basicInfo: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  plantName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  plantSpecies: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tabBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  tabActive: {
    borderBottomColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  tabContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tipBullet: {
    color: Colors.primaryLight,
    fontSize: FontSize.base,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sensorGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  diaryList: {
    gap: Spacing.lg,
  },
  diaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  diaryImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    flexShrink: 0,
  },
  diaryContent: {
    flex: 1,
    gap: 4,
  },
  diaryDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  diaryNote: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiConfidence: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  aiConfidenceLabel: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  aiDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
