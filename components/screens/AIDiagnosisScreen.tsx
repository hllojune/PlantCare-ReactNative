import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../shared/PrimaryButton';
import { StatusChip } from '../shared/StatusChip';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';
import { aiApi, DiagnosisResult } from '../../services/api';

export function AIDiagnosisScreen({ onNavigate }: NavigationProps) {
  const [imageUri, setImageUri]     = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [result, setResult]         = useState<DiagnosisResult | null>(null);

  // ── 이미지 선택 (갤러리) ──────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,          // 파일 크기 줄이기
      base64: true,          // base64로 변환해서 받기
    });
    if (!picked.canceled && picked.assets[0]) {
      setImageUri(picked.assets[0].uri);
      setResult(null);       // 이전 결과 초기화
    }
  };

  // ── 카메라 촬영 ───────────────────────────────────────
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }
    const taken = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!taken.canceled && taken.assets[0]) {
      setImageUri(taken.assets[0].uri);
      setResult(null);
    }
  };

  // ── AI 진단 요청 ──────────────────────────────────────
  const handleDiagnose = async () => {
    if (!imageUri) return;

    setDiagnosing(true);
    try {
      // uri → base64 변환
      const response = await fetch(imageUri);
      const blob     = await response.blob();
      const base64   = await new Promise<string>((resolve, reject) => {
        const reader  = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const data = await aiApi.diagnose(base64);
      setResult(data);
    } catch (e: any) {
      Alert.alert('진단 실패', e.message ?? '서버 연결을 확인해주세요.');
    } finally {
      setDiagnosing(false);
    }
  };

  // ── 결과 상태에 따른 StatusChip variant ──────────────
  const getVariant = (status: string) => {
    if (status.includes('건강')) return 'success';
    if (status.includes('주의')) return 'warning';
    return 'error';
  };

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
        {/* 이미지 영역 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>식물 이미지 업로드</Text>

          <View style={styles.imageBox}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconWrap}>
                  <Ionicons name="camera-outline" size={32} color={Colors.primaryLight} />
                </View>
                <Text style={styles.uploadTitle}>사진 촬영 또는 업로드</Text>
                <Text style={styles.uploadSub}>
                  최상의 결과를 위해 문제 부위를 촬영해 주세요
                </Text>
              </View>
            )}
          </View>

          {/* 버튼 행 */}
          <View style={styles.retakeRow}>
            <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto} activeOpacity={0.8}>
              <Ionicons name="camera-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.retakeBtnText}>카메라 촬영</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retakeBtn} onPress={pickImage} activeOpacity={0.8}>
              <Ionicons name="images-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.retakeBtnText}>갤러리 선택</Text>
            </TouchableOpacity>
          </View>

          {/* 진단 요청 버튼 */}
          {imageUri && !result && (
            <TouchableOpacity
              style={[styles.diagnoseBtn, diagnosing && styles.diagnoseBtnDisabled]}
              onPress={handleDiagnose}
              disabled={diagnosing}
              activeOpacity={0.85}
            >
              {diagnosing ? (
                <View style={styles.diagnosingRow}>
                  <ActivityIndicator color={Colors.white} size="small" />
                  <Text style={styles.diagnoseBtnText}>AI 분석 중...</Text>
                </View>
              ) : (
                <Text style={styles.diagnoseBtnText}>AI 진단 시작</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* 진단 결과 */}
        {result && (
          <View style={styles.resultSection}>
            <View style={styles.card}>
              <View style={styles.resultHeader}>
                <Text style={styles.cardTitle}>진단 결과</Text>
                <StatusChip label={result.status} variant={getVariant(result.status)} />
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>상태</Text>
                <Text style={styles.resultValue}>{result.status}</Text>
              </View>

              // 신뢰도는 AI 모델의 확신 정도를 나타냅니다 (예: 85%).
              // 현재는 API에서 제공하지 않지만, 추후 모델 개선 시 추가할 수 있습니다.
              {/* <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>신뢰도</Text>
                <View style={styles.confidenceRow}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${result.confidence}%` }]} />
                  </View>
                  <Text style={styles.confidenceValue}>{result.confidence}%</Text>
                </View>
              </View> */}

              <View>
                <Text style={styles.resultLabel}>권장 사항</Text>
                <View style={styles.recommendList}>
                  {result.recommendations.map((item, i) => (
                    <View key={i} style={styles.recommendRow}>
                      <Text style={styles.checkMark}>✓</Text>
                      <Text style={styles.recommendText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.tipBox}>
                <Text style={styles.tipText}>
                  💡 <Text style={styles.tipBold}>팁:</Text> 정기적인 모니터링은 문제를
                  조기에 발견하는 데 도움이 됩니다. 매주 식물의 변화를 확인하세요.
                </Text>
              </View>
            </View>

            {/* 다시 진단 */}
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => { setImageUri(null); setResult(null); }}
            >
              <Text style={styles.retryBtnText}>다시 진단하기</Text>
            </TouchableOpacity>

            <PrimaryButton fullWidth onPress={() => onNavigate('diary')}>
              일지에 저장
            </PrimaryButton>
          </View>
        )}

        {/* 사용 가이드 (이미지 없을 때만) */}
        {!imageUri && !result && (
          <View style={styles.guideBox}>
            <Text style={styles.guideTitle}>AI 진단 사용 방법</Text>
            {[
              '카메라로 촬영하거나 갤러리에서 사진을 선택하세요',
              'AI 진단 시작 버튼을 눌러주세요',
              '진단 결과와 관리 권장 사항을 확인하세요',
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
  uploadPlaceholder: { paddingVertical: 48, alignItems: 'center', gap: Spacing.sm },
  uploadIconWrap: {
    width: 72, height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primaryLight}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  uploadTitle: { fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: '500' },
  uploadSub: {
    fontSize: FontSize.sm, color: Colors.textTertiary,
    textAlign: 'center', paddingHorizontal: Spacing.lg,
  },
  retakeRow: { flexDirection: 'row', gap: Spacing.sm },
  retakeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.white, borderWidth: 1,
    borderColor: Colors.border, borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
  },
  retakeBtnText: { fontSize: FontSize.sm, color: Colors.textPrimary },
  diagnoseBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  diagnoseBtnDisabled: { opacity: 0.7 },
  diagnosingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  diagnoseBtnText: { color: Colors.white, fontSize: FontSize.base, fontWeight: '600' },
  resultSection: { gap: Spacing.lg },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, gap: Spacing.lg,
    shadowColor: Colors.black, shadowOpacity: 0.05,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 2, borderWidth: 1, borderColor: Colors.borderLight,
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  resultRow: { gap: 4 },
  resultLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  resultValue: { fontSize: FontSize.base, color: Colors.textPrimary },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressTrack: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: BorderRadius.full },
  progressFill: { height: 8, backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.full },
  confidenceValue: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  recommendList: { gap: Spacing.sm, marginTop: Spacing.sm },
  recommendRow: { flexDirection: 'row', gap: Spacing.sm },
  checkMark: { color: Colors.primaryLight, fontSize: FontSize.base },
  recommendText: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  tipBox: {
    backgroundColor: Colors.blueBg, borderWidth: 1,
    borderColor: `${Colors.blue}40`, borderRadius: BorderRadius.lg, padding: Spacing.md,
  },
  tipText: { fontSize: FontSize.sm, color: '#1e3a5f', lineHeight: 20 },
  tipBold: { fontWeight: '600' },
  retryBtn: {
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.xl, paddingVertical: 12, alignItems: 'center',
  },
  retryBtnText: { fontSize: FontSize.base, color: Colors.textSecondary },
  guideBox: {
    backgroundColor: Colors.blueBg, borderWidth: 1,
    borderColor: `${Colors.blue}40`, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.sm,
  },
  guideTitle: { fontSize: FontSize.base, fontWeight: '600', color: '#1e3a5f', marginBottom: 4 },
  guideRow: { flexDirection: 'row', gap: Spacing.sm },
  guideStep: { fontSize: FontSize.sm, color: '#2d5a8e' },
  guideText: { flex: 1, fontSize: FontSize.sm, color: '#2d5a8e', lineHeight: 20 },
});