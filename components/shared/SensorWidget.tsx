import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

interface SensorWidgetProps {
  iconName: string; // @expo/vector-icons Ionicons name
  label: string;
  value: string;
  unit: string;
  color?: string;
}

// We receive the rendered icon externally to avoid complex generic typing
interface SensorWidgetFullProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}

export function SensorWidget({ icon, label, value, unit }: SensorWidgetFullProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  unit: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});
