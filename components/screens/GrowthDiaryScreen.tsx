import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

const diaryEntries = [
  {
    id: '1',
    date: '2025년 11월 18일',
    time: '오전 10:30',
    plant: '몬스테라 델리시오사',
    image: 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=400',
    note: '새 잎이 펼쳐지고 있어요! 아름다운 짙은 초록색의 새 잎이 나왔어요.',
    type: '성장 기록',
  },
  {
    id: '2',
    date: '2025년 11월 15일',
    time: '오후 2:15',
    plant: '산세베리아',
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400',
    note: '더 큰 화분으로 분갈이했어요. 배수를 위해 새 배양토와 펄라이트를 섞었어요.',
    type: '관리',
  },
  {
    id: '3',
    date: '2025년 11월 10일',
    time: '오전 9:00',
    plant: '몬스테라 델리시오사',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    note: '물과 액체 비료를 줬어요. 잎이 싱싱하고 건강해 보여요.',
    type: '일상 관리',
  },
  {
    id: '4',
    date: '2025년 11월 5일',
    time: '오전 11:45',
    plant: '스파티필럼',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
    note: '하얀 꽃이 피었어요! 이번 시즌 첫 꽃이에요. 현재 위치에서 잘 자라고 있어요.',
    type: '개화',
  },
];

export function GrowthDiaryScreen({ onNavigate }: NavigationProps) {
  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>성장 일지</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline */}
        <View style={styles.timeline}>
          {/* Vertical line */}
          <View style={styles.timelineLine} />

          {diaryEntries.map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
              {/* Timeline dot */}
              <View style={styles.dotWrap}>
                <View style={styles.dotOuter}>
                  <View style={styles.dotInner} />
                </View>
              </View>

              {/* Entry Card */}
              <View style={styles.card}>
                <Image
                  source={{ uri: entry.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.plantName}>{entry.plant}</Text>
                      <Text style={styles.dateText}>
                        {entry.date} • {entry.time}
                      </Text>
                    </View>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{entry.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.noteText}>{entry.note}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
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
  backBtn: { padding: Spacing.sm, marginLeft: -Spacing.sm },
  appBarTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100 },
  timeline: { position: 'relative', gap: Spacing.xxl },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.border,
    zIndex: 0,
  },
  entryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dotWrap: {
    width: 40,
    alignItems: 'center',
    paddingTop: Spacing.sm,
    zIndex: 1,
  },
  dotOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primaryLight}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardImage: { width: '100%', height: 192 },
  cardContent: { padding: Spacing.lg, gap: Spacing.sm },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  plantName: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  dateText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  typeBadge: {
    backgroundColor: `${Colors.primaryLight}1A`,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    flexShrink: 0,
  },
  typeBadgeText: { fontSize: FontSize.sm, color: Colors.primaryLight, fontWeight: '500' },
  noteText: { fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
