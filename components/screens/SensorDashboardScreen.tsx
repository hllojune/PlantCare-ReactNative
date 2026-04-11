import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

const tempSparkline = [20, 22, 21, 23, 22, 22.5, 22, 21.5, 22, 22.5];
const humidSparkline = [58, 60, 62, 64, 63, 65, 66, 64, 65, 65];
const soilSparkline = [70, 69, 68, 68, 67, 68, 68, 67, 68, 68];

interface SparklineProps {
  data: number[];
  max: number;
  color: string;
}

function Sparkline({ data, max, color }: SparklineProps) {
  return (
    <View style={styles.sparklineRow}>
      {data.map((val, i) => (
        <View
          key={i}
          style={[
            styles.sparkBar,
            { height: (val / max) * 48, backgroundColor: color },
          ]}
        />
      ))}
    </View>
  );
}

interface SensorCardProps {
  iconName: string;
  iconColor: string;
  iconBg: string;
  label: string;
  range: string;
  value: string;
  unit: string;
  sparklineData: number[];
  sparklineMax: number;
  sparklineColor: string;
}

function SensorCard({
  iconName,
  iconColor,
  iconBg,
  label,
  range,
  value,
  unit,
  sparklineData,
  sparklineMax,
  sparklineColor,
}: SensorCardProps) {
  return (
    <View style={styles.sensorCard}>
      <View style={styles.sensorCardHeader}>
        <View style={[styles.sensorIconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName as any} size={24} color={iconColor} />
        </View>
        <View>
          <Text style={styles.sensorCardLabel}>{label}</Text>
          <Text style={styles.sensorCardRange}>적정 범위: {range}</Text>
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.bigValue}>{value}</Text>
        <Text style={styles.bigUnit}>{unit}</Text>
      </View>
      <Sparkline data={sparklineData} max={sparklineMax} color={sparklineColor} />
    </View>
  );
}

export function SensorDashboardScreen({ onNavigate }: NavigationProps) {
  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>실시간 센서</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live indicator */}
        <View style={styles.liveCard}>
          <View style={styles.liveLeft}>
            <View style={styles.liveDotWrap}>
              <View style={styles.liveDot} />
            </View>
            <Text style={styles.liveText}>실시간 모니터링</Text>
          </View>
          <Text style={styles.liveTime}>방금 업데이트됨</Text>
        </View>

        {/* Sensor Cards */}
        <SensorCard
          iconName="thermometer-outline"
          iconColor="#ea580c"
          iconBg="#fff7ed"
          label="온도"
          range="18-24°C"
          value="22.5"
          unit="°C"
          sparklineData={tempSparkline}
          sparklineMax={24}
          sparklineColor="#fed7aa"
        />

        <SensorCard
          iconName="water-outline"
          iconColor="#2563eb"
          iconBg="#eff6ff"
          label="습도"
          range="50-70%"
          value="65"
          unit="%"
          sparklineData={humidSparkline}
          sparklineMax={80}
          sparklineColor="#bfdbfe"
        />

        <SensorCard
          iconName="rainy-outline"
          iconColor={Colors.primaryLight}
          iconBg={Colors.primaryBgLight}
          label="토양 수분"
          range="40-70%"
          value="68"
          unit="%"
          sparklineData={soilSparkline}
          sparklineMax={80}
          sparklineColor={`${Colors.primaryLight}66`}
        />

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="pulse-outline" size={20} color="#2563eb" style={{ marginTop: 2 }} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>센서 상태</Text>
            <Text style={styles.infoDesc}>
              모든 센서가 정상 작동 중입니다. 데이터는 5분마다 업데이트됩니다.
            </Text>
          </View>
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
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  liveCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  liveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  liveDotWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
  },
  liveText: {
    fontSize: FontSize.base,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  liveTime: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  sensorCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  sensorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sensorIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorCardLabel: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sensorCardRange: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  bigValue: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 56,
  },
  bigUnit: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  sparklineRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 48,
  },
  sparkBar: {
    flex: 1,
    borderRadius: 3,
    minHeight: 4,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  infoDesc: {
    fontSize: FontSize.sm,
    color: '#1e40af',
    lineHeight: 20,
  },
});
