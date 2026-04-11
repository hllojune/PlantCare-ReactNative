import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationCard } from '../shared/NotificationCard';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

type CategoryTab = 'all' | 'warnings' | 'care' | 'system';

interface Notification {
  id: string;
  type: 'warning' | 'care' | 'ai' | 'system';
  title: string;
  subtitle: string;
  timestamp: string;
  severity?: 'critical' | 'warning' | 'info' | 'resolved';
  isRead: boolean;
  date: 'today' | 'yesterday' | 'thisWeek';
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'warning', title: '토양 수분 부족 감지', subtitle: '몬스테라 토양 수분이 32%로 떨어졌어요', timestamp: '5분 전', severity: 'critical', isRead: false, date: 'today' },
  { id: '2', type: 'care', title: '몬스테라 물주기 알림', subtitle: '일정에 따라 물을 줄 시간이에요', timestamp: '1시간 전', severity: 'info', isRead: false, date: 'today' },
  { id: '3', type: 'warning', title: '온도가 권장 범위를 초과했어요', subtitle: '산세베리아 온도가 28°C에 도달했어요 (적정: 18-24°C)', timestamp: '2시간 전', severity: 'warning', isRead: true, date: 'today' },
  { id: '4', type: 'ai', title: 'AI 진단 결과가 준비되었어요', subtitle: '스파티필럼 스캔 결과를 확인해 보세요', timestamp: '3시간 전', severity: 'info', isRead: false, date: 'today' },
  { id: '5', type: 'care', title: '습도 안정', subtitle: '스파티필럼 습도 64%로 안정 - 완벽한 조건이에요!', timestamp: '어제', severity: 'resolved', isRead: true, date: 'yesterday' },
  { id: '6', type: 'system', title: '주간 성장 보고서 준비 완료', subtitle: '지난 7일간 식물의 성장 상태를 확인해 보세요', timestamp: '어제', severity: 'info', isRead: true, date: 'yesterday' },
  { id: '7', type: 'warning', title: '채광 부족 감지', subtitle: '산세베리아가 오늘 4시간 미만의 빛을 받았어요', timestamp: '어제', severity: 'warning', isRead: true, date: 'yesterday' },
  { id: '8', type: 'care', title: '비료 주기 알림', subtitle: '스파티필럼에 이번 주 비료를 줘야 해요', timestamp: '2일 전', severity: 'info', isRead: true, date: 'thisWeek' },
  { id: '9', type: 'ai', title: '건강 검진 완료', subtitle: '전체 식물 분석 완료 - 3개 건강, 이상 0건', timestamp: '3일 전', severity: 'resolved', isRead: true, date: 'thisWeek' },
  { id: '10', type: 'system', title: '센서 연결 복구됨', subtitle: '모든 센서 기기가 온라인 상태이며 데이터를 보고하고 있어요', timestamp: '4일 전', severity: 'resolved', isRead: true, date: 'thisWeek' },
];

const TABS: { id: CategoryTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'warnings', label: '경고' },
  { id: 'care', label: '관리' },
  { id: 'system', label: '시스템' },
];

export function NotificationsScreen({ onNavigate }: NavigationProps) {
  const [selectedTab, setSelectedTab] = useState<CategoryTab>('all');

  const filtered = mockNotifications.filter((n) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'warnings') return n.type === 'warning';
    if (selectedTab === 'care') return n.type === 'care';
    if (selectedTab === 'system') return n.type === 'system' || n.type === 'ai';
    return true;
  });

  const grouped = {
    today: filtered.filter((n) => n.date === 'today'),
    yesterday: filtered.filter((n) => n.date === 'yesterday'),
    thisWeek: filtered.filter((n) => n.date === 'thisWeek'),
  };

  const sections: { label: string; data: Notification[] }[] = [
    { label: '오늘', data: grouped.today },
    { label: '어제', data: grouped.yesterday },
    { label: '이번 주', data: grouped.thisWeek },
  ];

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>알림</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabChip, selectedTab === tab.id && styles.tabChipActive]}
              onPress={() => setSelectedTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabChipText, selectedTab === tab.id && styles.tabChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="notifications-outline" size={48} color={Colors.primaryLight} />
            </View>
            <Text style={styles.emptyTitle}>알림이 없습니다</Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === 'all'
                ? '모든 알림을 확인했어요! 현재 새로운 알림이 없습니다.'
                : `표시할 알림이 없습니다.`}
            </Text>
          </View>
        ) : (
          sections.map(({ label, data }) =>
            data.length === 0 ? null : (
              <View key={label} style={styles.section}>
                <Text style={styles.sectionLabel}>{label}</Text>
                <View style={styles.cardList}>
                  {data.map((n) => (
                    <NotificationCard
                      key={n.id}
                      type={n.type}
                      title={n.title}
                      subtitle={n.subtitle}
                      timestamp={n.timestamp}
                      severity={n.severity}
                      isRead={n.isRead}
                    />
                  ))}
                </View>
              </View>
            )
          )
        )}
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
  },
  backBtn: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingsBtn: {
    padding: Spacing.sm,
    marginRight: -Spacing.sm,
  },
  tabsWrap: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.md,
  },
  tabs: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  tabChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundGray,
  },
  tabChipActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabChipTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.xxl,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    paddingHorizontal: 4,
  },
  cardList: {
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryBgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
