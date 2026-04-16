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

// ─── API 설정 ───────────────────────────────────────────
// const BASE_URL = 'http://10.0.2.2:8080'; // Android 에뮬레이터
// const DEV_BASE_URL = 'http://localhost:8080';
const BASE_URL = 'http://172.16.106.231:8080'; // GateWay 포트
// const BASE_URL = 'http://192.168.219.53:8084';  // ai서비스 다이렉트

const PLANT_ID = 1; // TODO : 추후 실제 로그인한 사용자의 plantId로 교체

// ─── 타입 ───────────────────────────────────────────────
interface DiagnosisResult {
  diagnosisId: number;
  plantId: number;
  title: string;
  details: string;
  result: string; // "진단완료" | "진단실패"
  imageUrl: string;
  diagnosisDate: string;
}

export function AIDiagnosisScreen({ onNavigate }: NavigationProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // ─── 갤러리에서 이미지 선택 ─────────────────────────
  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('권한 상태:', permission.status);
    if (!permission.granted) {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }
    console.log('갤러리 열기 시도');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    console.log('갤러리 결과:', result);
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDiagnosisResult(null);
    }
  };

  // ─── 카메라로 촬영 ───────────────────────────────────
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDiagnosisResult(null);
    }
  };

  // ─── AI 진단 API 호출 ────────────────────────────────
  const handleDiagnose = async () => {
    if (!imageUri) {
      Alert.alert('이미지 필요', '먼저 식물 사진을 업로드해주세요.');
      return;
    }
    setLoading(true);
    

    try {
      console.log('진단 시작 - 요청 URL:', `${BASE_URL}/ai/gemini`);
      
      const formData = new FormData();
      
      // 파일명과 확장자 추출
      const filename = imageUri.split('/').pop() || 'plant.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // FormData 구성
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      formData.append('plantId', String(PLANT_ID));

      const response = await fetch(`${BASE_URL}/ai/gemini`, {
        method: 'POST',
        body: formData,
        // headers는 절대 넣지 마세요 (fetch가 자동으로 boundary 설정)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`서버 응답 오류(${response.status}): ${errorText}`);
      }

      const data: DiagnosisResult = await response.json();
      console.log('진단 성공:', data);
      setDiagnosisResult(data);
    } catch (error: any) {
      Alert.alert('진단 실패', `서버 연결을 확인해주세요.\n${error.message}`);
      console.error('상세 에러 로그:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>식물 이미지 업로드</Text>

          <View style={styles.imageBox}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <TouchableOpacity style={styles.uploadPlaceholder} activeOpacity={0.8} onPress={pickFromGallery}>
                <View style={styles.uploadIconWrap}>
                  <Ionicons name="camera-outline" size={32} color={Colors.primaryLight} />
                </View>
                <Text style={styles.uploadTitle}>사진 촬영 또는 업로드</Text>
                <Text style={styles.uploadSub}>최상의 결과를 위해 문제 부위를 촬영해 주세요</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 이미지 선택 후 버튼들 */}
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

        {/* 진단 버튼 (이미지 선택 후, 결과 없을 때) */}
        {imageUri && !diagnosisResult && (
          <PrimaryButton fullWidth onPress={handleDiagnose} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : 'AI 진단 시작'}
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
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>상태</Text>
                <Text style={styles.resultValue}>{diagnosisResult.title}</Text>
              </View>

              <View>
                <Text style={styles.resultLabel}>상세 내용</Text>
                <Text style={[styles.resultValue, { marginTop: 4 }]}>
                  {diagnosisResult.details}
                </Text>
              </View>

              <View style={styles.tipBox}>
                <Text style={styles.tipText}>
                  💡 <Text style={styles.tipBold}>진단일:</Text> {diagnosisResult.diagnosisDate?.slice(0, 10)}
                </Text>
              </View>
            </View>

            {isSuccess && (
              <PrimaryButton fullWidth onPress={() => onNavigate('diary')}>
                일지에 저장
              </PrimaryButton>
            )}

            {/* 다시 진단 */}
            <TouchableOpacity
              style={styles.retakeBtn}
              onPress={() => { setDiagnosisResult(null); setImageUri(null); }}
            >
              <Ionicons name="refresh-outline" size={16} color={Colors.textPrimary} />
              <Text style={styles.retakeBtnText}>다시 진단하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 사용 가이드 (이미지 없을 때) */}
        {!imageUri && (
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

// styles는 기존 것 그대로 사용
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  appBar: {
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg, gap: Spacing.md,
  },
  backBtn: { padding: Spacing.sm, marginLeft: -Spacing.sm },
  appBarTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  scrollContent: { padding: Spacing.lg, gap: Spacing.xxl, paddingBottom: 40 },
  section: { gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary },
  imageBox: {
    borderRadius: BorderRadius.xl, borderWidth: 2, borderStyle: 'dashed',
    borderColor: Colors.border, overflow: 'hidden', backgroundColor: Colors.white,
  },
  previewImage: { width: '100%', height: 256 },
  uploadPlaceholder: { paddingVertical: 48, alignItems: 'center', gap: Spacing.sm },
  uploadIconWrap: {
    width: 72, height: 72, borderRadius: BorderRadius.full,
    backgroundColor: `${Colors.primaryLight}1A`, alignItems: 'center',
    justifyContent: 'center', marginBottom: Spacing.sm,
  },
  uploadTitle: { fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: '500' },
  uploadSub: { fontSize: FontSize.sm, color: Colors.textTertiary, textAlign: 'center', paddingHorizontal: Spacing.lg },
  retakeRow: { flexDirection: 'row', gap: Spacing.sm },
  retakeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.white, borderWidth: 1,
    borderColor: Colors.border, borderRadius: BorderRadius.lg, paddingVertical: Spacing.sm,
  },
  retakeBtnText: { fontSize: FontSize.sm, color: Colors.textPrimary },
  resultSection: { gap: Spacing.lg },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg,
    gap: Spacing.lg, shadowColor: Colors.black, shadowOpacity: 0.05,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    borderWidth: 1, borderColor: Colors.borderLight,
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
  },
  guideTitle: { fontSize: FontSize.base, fontWeight: '600', color: '#1e3a5f', marginBottom: 4 },
  guideRow: { flexDirection: 'row', gap: Spacing.sm },
  guideStep: { fontSize: FontSize.sm, color: '#2d5a8e' },
  guideText: { flex: 1, fontSize: FontSize.sm, color: '#2d5a8e', lineHeight: 20 },
});