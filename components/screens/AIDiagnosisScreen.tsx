import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../shared/PrimaryButton';
import { StatusChip } from '../shared/StatusChip';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

export function AIDiagnosisScreen({ onNavigate }: NavigationProps) {
  const [hasResult, setHasResult] = useState(true);

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>AI 식물 진단</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>식물 이미지 업로드</Text>

          <View style={styles.imageBox}>
            {hasResult ? (
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800' }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <TouchableOpacity
                style={styles.uploadPlaceholder}
                activeOpacity={0.8}
                onPress={() => setHasResult(true)}
              >
                <View style={styles.uploadIconWrap}>
                  <Ionicons name="camera-outline" size={32} color={Colors.primaryLight} />
                </View>
                <Text style={styles.uploadTitle}>사진 촬영 또는 업로드</Text>
                <Text style={styles.uploadSub}>
                  최상의 결과를 위해 문제 부위를 촬영해 주세요
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {hasResult && (
            <View style={styles.retakeRow}>
              <TouchableOpacity
                style={styles.retakeBtn}
                activeOpacity={0.8}
                onPress={() => setHasResult(false)}
              >
                <Ionicons name="camera-outline" size={16} color={Colors.textPrimary} />
                <Text style={styles.retakeBtnText}>다시 촬영</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.retakeBtn}
                activeOpacity={0.8}
                onPress={() => setHasResult(false)}
              >
                <Ionicons name="cloud-upload-outline" size={16} color={Colors.textPrimary} />
                <Text style={styles.retakeBtnText}>새로 업로드</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Result Card */}
        {hasResult && (
          <View style={styles.resultSection}>
            <View style={styles.card}>
              <View style={styles.resultHeader}>
                <Text style={styles.cardTitle}>진단 결과</Text>
                <StatusChip label="건강함" variant="success" />
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>상태</Text>
                <Text style={styles.resultValue}>매우 건강함</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>신뢰도</Text>
                <View style={styles.confidenceRow}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: '94%' }]} />
                  </View>
                  <Text style={styles.confidenceValue}>94%</Text>
                </View>
              </View>

              <View>
                <Text style={styles.resultLabel}>권장 사항</Text>
                <View style={styles.recommendList}>
                  {[
                    '잎이 선명한 초록색이며 변색이 없어요',
                    '해충이나 질병의 징후가 보이지 않아요',
                    '현재 물주기와 조명 관리를 유지하세요',
                    '2주 내에 비료 주는 것을 고려해 보세요',
                  ].map((item, i) => (
                    <View key={i} style={styles.recommendRow}>
                      <Text style={styles.checkMark}>✓</Text>
                      <Text style={styles.recommendText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.tipBox}>
                <Text style={styles.tipText}>
                  💡 <Text style={styles.tipBold}>팁:</Text> 정기적인 모니터링은 문제를 조기에 발견하는 데
                  도움이 됩니다. 매주 식물의 변화를 확인하세요.
                </Text>
              </View>
            </View>

            <PrimaryButton fullWidth onPress={() => onNavigate('diary')}>
              일지에 저장
            </PrimaryButton>
          </View>
        )}

        {/* How to use guide */}
        {!hasResult && (
          <View style={styles.guideBox}>
            <Text style={styles.guideTitle}>AI 진단 사용 방법</Text>
            {[
              '식물 또는 문제 부위의 선명한 사진을 촬영하세요',
              'AI가 이미지를 분석합니다',
              '진단 결과와 관리 권장 사항을 받아보세요',
            ].map((step, i) => (
              <View key={i} style={styles.guideRow}>
                <Text style={styles.guideStep}>{i + 1}.</Text>
                <Text style={styles.guideText}>{step}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  scrollContent: { padding: Spacing.lg, gap: Spacing.xxl, paddingBottom: 40 },
  section: { gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  imageBox: {
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  previewImage: { width: '100%', height: 256 },
  uploadPlaceholder: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadIconWrap: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primaryLight}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  uploadTitle: { fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: '500' },
  uploadSub: { fontSize: FontSize.sm, color: Colors.textTertiary, textAlign: 'center', paddingHorizontal: Spacing.lg },
  retakeRow: { flexDirection: 'row', gap: Spacing.sm },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
  },
  retakeBtnText: { fontSize: FontSize.sm, color: Colors.textPrimary },
  resultSection: { gap: Spacing.lg },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  resultRow: { gap: 4 },
  resultLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  resultValue: { fontSize: FontSize.base, color: Colors.textPrimary },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
  },
  confidenceValue: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  recommendList: { gap: Spacing.sm, marginTop: Spacing.sm },
  recommendRow: { flexDirection: 'row', gap: Spacing.sm },
  checkMark: { color: Colors.primaryLight, fontSize: FontSize.base },
  recommendText: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  tipBox: {
    backgroundColor: Colors.blueBg,
    borderWidth: 1,
    borderColor: `${Colors.blue}40`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  tipText: { fontSize: FontSize.sm, color: '#1e3a5f', lineHeight: 20 },
  tipBold: { fontWeight: '600' },
  guideBox: {
    backgroundColor: Colors.blueBg,
    borderWidth: 1,
    borderColor: `${Colors.blue}40`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  guideTitle: { fontSize: FontSize.base, fontWeight: '600', color: '#1e3a5f', marginBottom: 4 },
  guideRow: { flexDirection: 'row', gap: Spacing.sm },
  guideStep: { fontSize: FontSize.sm, color: '#2d5a8e' },
  guideText: { flex: 1, fontSize: FontSize.sm, color: '#2d5a8e', lineHeight: 20 },
});
