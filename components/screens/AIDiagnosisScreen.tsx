import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { PrimaryButton } from '../shared/PrimaryButton';
import { StatusChip } from '../shared/StatusChip';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';
import { aiApi, DiagnosisResult } from '../../services/api'; // ← api.ts에서 import

const PLANT_ID = 1; // TODO: 로그인 후 실제 plantId로 교체

export function AIDiagnosisScreen({ onNavigate }: NavigationProps) {
  const [imageUri, setImageUri]             = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading]               = useState(false);

  // ── 갤러리 선택 ───────────────────────────────────────
  const pickFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.'); return; }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDiagnosisResult(null);
    }
  };

  // ─── 카메라로 촬영 ───────────────────────────────────
  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) { Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.'); return; }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDiagnosisResult(null);
    }
  };

  // ── AI 진단 요청 → api.ts의 aiApi.diagnose() 호출 ────
  const handleDiagnose = async () => {
    if (!imageUri) { Alert.alert('이미지 필요', '먼저 식물 사진을 업로드해주세요.'); return; }

    setLoading(true);
    try {
      const data = await aiApi.diagnose(imageUri, PLANT_ID); // ← 여기만 호출
      setDiagnosisResult(data);
    } catch (error: any) {
      Alert.alert('진단 실패', `서버 연결을 확인해주세요.\n${error.message}`);
      console.error('AI 진단 에러:', error);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  const isSuccess = diagnosisResult?.result === '진단완료';
  const isSuccess = diagnosisResult?.result === '진단완료';

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>AI 식물 진단</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 이미지 업로드 섹션 */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 이미지 업로드 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>식물 이미지 업로드</Text>

          <View style={styles.imageBox}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <TouchableOpacity style={styles.uploadPlaceholder} activeOpacity={0.8} onPress={pickFromGallery}>
              <TouchableOpacity style={styles.uploadPlaceholder} activeOpacity={0.8} onPress={pickFromGallery}>
                <View style={styles.uploadIconWrap}>
                  <Ionicons name="camera-outline" size={32} color={Colors.primaryLight} />
                </View>
                <Text style={styles.uploadTitle}>사진 촬영 또는 업로드</Text>
                <Text style={styles.uploadSub}>최상의 결과를 위해 문제 부위를 촬영해 주세요</Text>
              </TouchableOpacity>
                <Text style={styles.uploadSub}>최상의 결과를 위해 문제 부위를 촬영해 주세요</Text>
              </TouchableOpacity>
            )}
          </View>

          {imageUri && (
            <View style={styles.retakeRow}>
              <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={16} color={Colors.textPrimary} />
                <Text style={styles.retakeBtnText}>다시 촬영</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.retakeBtn} onPress={pickFromGallery}>
                <Ionicons name="cloud-upload-outline" size={16} color={Colors.textPrimary} />
                <Text style={styles.retakeBtnText}>새로 업로드</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 진단 버튼 */}
        {imageUri && !diagnosisResult && (
          <PrimaryButton fullWidth onPress={handleDiagnose} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : 'AI 진단 시작'
            }
          </PrimaryButton>
        )}

        {/* 진단 결과 카드 */}
        {diagnosisResult && (
          <View style={styles.resultSection}>
            <View style={styles.card}>
              <View style={styles.resultHeader}>
                <Text style={styles.cardTitle}>진단 결과</Text>
                <StatusChip
                  label={isSuccess ? diagnosisResult.title : '진단 실패'}
                  variant={isSuccess ? 'success' : 'error'}
                />
                <StatusChip
                  label={isSuccess ? diagnosisResult.title : '진단 실패'}
                  variant={isSuccess ? 'success' : 'error'}
                />
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>상태</Text>
                <Text style={styles.resultValue}>{diagnosisResult.title}</Text>
                <Text style={styles.resultValue}>{diagnosisResult.title}</Text>
              </View>

              <View>
                <Text style={styles.resultLabel}>상세 내용</Text>
                <Text style={[styles.resultValue, { marginTop: 4 }]}>
                  {diagnosisResult.details}
                </Text>
                <Text style={styles.resultLabel}>상세 내용</Text>
                <Text style={[styles.resultValue, { marginTop: 4 }]}>
                  {diagnosisResult.details}
                </Text>
              </View>

              <View style={styles.tipBox}>
                <Text style={styles.tipText}>
                  💡 <Text style={styles.tipBold}>진단일:</Text>{' '}
                  {diagnosisResult.diagnosisDate?.slice(0, 10)}
                </Text>
              </View>
            </View>

            {isSuccess && (
              <PrimaryButton fullWidth onPress={() => onNavigate('diary')}>
                일지에 저장
              </PrimaryButton>
            )}

            <TouchableOpacity
              style={styles.retakeBtn}
              onPress={() => { setDiagnosisResult(null); setImageUri(null); }}
              style={styles.retakeBtn}
              onPress={() => { setDiagnosisResult(null); setImageUri(null); }}
            >
              <Ionicons name="refresh-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.retakeBtnText}>다시 진단하기</Text>
              <Ionicons name="refresh-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.retakeBtnText}>다시 진단하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 사용 가이드 */}
        {!imageUri && (
          <View style={styles.guideBox}>
            <Text style={styles.guideTitle}>AI 진단 사용 방법</Text>
            {[
              '식물 또는 문제 부위의 선명한 사진을 촬영하세요',
              'AI가 이미지를 분석합니다',
              '진단 결과와 관리 권장 사항을 받아보세요',
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

// styles는 기존 것 그대로 사용
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  appBar: {
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, gap: Spacing.md,
  },
  backBtn: { padding: Spacing.sm, marginLeft: -Spacing.sm },
  appBarTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  scrollContent: { padding: Spacing.lg, gap: Spacing.xxl, paddingBottom: 40 },
  section: { gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  imageBox: {
    borderRadius: BorderRadius.xl, borderWidth: 2, borderStyle: 'dashed',
    borderColor: Colors.border, overflow: 'hidden', backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, borderWidth: 2, borderStyle: 'dashed',
    borderColor: Colors.border, overflow: 'hidden', backgroundColor: Colors.white,
  },
  previewImage: { width: '100%', height: 256 },
  uploadPlaceholder: { paddingVertical: 48, alignItems: 'center', gap: Spacing.sm },
  uploadIconWrap: {
    width: 72, height: 72, borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primaryLight}1A`,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  uploadTitle: { fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: '500' },
  uploadSub: { fontSize: FontSize.sm, color: Colors.textTertiary, textAlign: 'center', paddingHorizontal: Spacing.lg },
  retakeRow: { flexDirection: 'row', gap: Spacing.sm },
  retakeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.white, borderWidth: 1,
    borderColor: Colors.border, borderRadius: BorderRadius.lg, paddingVertical: Spacing.sm,
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.white, borderWidth: 1,
    borderColor: Colors.border, borderRadius: BorderRadius.lg, paddingVertical: Spacing.sm,
  },
  retakeBtnText: { fontSize: FontSize.sm, color: Colors.textPrimary },
  resultSection: { gap: Spacing.lg },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, gap: Spacing.lg, shadowColor: Colors.black,
    shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 2, borderWidth: 1, borderColor: Colors.borderLight,
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  resultRow: { gap: 4 },
  resultLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  resultValue: { fontSize: FontSize.base, color: Colors.textPrimary },
  tipBox: {
    backgroundColor: Colors.blueBg, borderWidth: 1,
    borderColor: `${Colors.blue}40`, borderRadius: BorderRadius.lg, padding: Spacing.md,
  },
  tipText: { fontSize: FontSize.sm, color: '#1e3a5f', lineHeight: 20 },
  tipBold: { fontWeight: '600' },
  guideBox: {
    backgroundColor: Colors.blueBg, borderWidth: 1, borderColor: `${Colors.blue}40`,
    borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.sm,
    backgroundColor: Colors.blueBg, borderWidth: 1, borderColor: `${Colors.blue}40`,
    borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.sm,
  },
  guideTitle: { fontSize: FontSize.base, fontWeight: '600', color: '#1e3a5f', marginBottom: 4 },
  guideRow: { flexDirection: 'row', gap: Spacing.sm },
  guideStep: { fontSize: FontSize.sm, color: '#2d5a8e' },
  guideText: { flex: 1, fontSize: FontSize.sm, color: '#2d5a8e', lineHeight: 20 },
});