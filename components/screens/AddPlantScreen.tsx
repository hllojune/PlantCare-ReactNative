import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../shared/PrimaryButton';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

export function AddPlantScreen({ onNavigate }: NavigationProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [date, setDate] = useState('');
  const [memo, setMemo] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* AppBar */}
        <View style={styles.appBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>새 식물 추가</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Photo Upload */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>식물 사진</Text>
            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.8}>
              <View style={styles.uploadIconWrap}>
                <Ionicons name="cloud-upload-outline" size={32} color={Colors.primaryLight} />
              </View>
              <Text style={styles.uploadTitle}>식물 사진 업로드</Text>
              <Text style={styles.uploadSub}>JPG, PNG 최대 10MB</Text>
            </TouchableOpacity>
          </View>

          {/* Plant Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>식물 이름</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="예: 우리집 몬스테라"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          {/* Species */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>품종</Text>
            <TextInput
              style={styles.textInput}
              value={species}
              onChangeText={setSpecies}
              placeholder="예: Monstera Deliciosa"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          {/* Planting Date */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>심은 날짜</Text>
            <TextInput
              style={styles.textInput}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
            />
          </View>

          {/* Memo */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>메모 (선택사항)</Text>
            <TextInput
              style={styles.textArea}
              value={memo}
              onChangeText={setMemo}
              placeholder="식물에 대한 메모를 남겨보세요..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <PrimaryButton fullWidth onPress={() => onNavigate('home')}>
            식물 등록하기
          </PrimaryButton>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    gap: Spacing.xxl,
    paddingBottom: 40,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  uploadArea: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    paddingVertical: 48,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadIconWrap: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primaryLight}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  uploadTitle: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  uploadSub: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    minHeight: 100,
  },
});
