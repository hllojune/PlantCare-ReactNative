import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize } from '../../theme';

interface StatusChipProps {
  label: string;
  variant?: 'success' | 'warning' | 'info' | 'error';
}

const variantColors = {
  success: { bg: Colors.successBg, text: Colors.successText },
  warning: { bg: Colors.warningBg, text: Colors.warningText },
  info: { bg: Colors.infoBg, text: Colors.infoText },
  error: { bg: Colors.errorBg, text: Colors.errorText },
};

export function StatusChip({ label, variant = 'success' }: StatusChipProps) {
  const colors = variantColors[variant];
  return (
    <View style={[styles.chip, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
