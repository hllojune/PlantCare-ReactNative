import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  StatusBar
} from 'react-native';
import { ArrowLeft, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker'; // Expo 이미지 피커

export function AddPlant({ navigation }: { navigation: any }) {
  // 상태 관리 (이미지, 이름, 메모)
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [plantName, setPlantName] = useState('');
  const [memo, setMemo] = useState('');

  // 사진첩 열기 함수
  const pickImage = async () => {
    // 갤러리 접근 권한 요청 및 사진 선택
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // 사진 자르기 허용
      aspect: [4, 3],      // 자르기 비율
      quality: 0.8,        // 이미지 품질 (0~1)
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // TODO: 백엔드 API로 데이터(imageUri, plantName, memo) 전송 로직 추가
    console.log('등록할 식물:', { plantName, memo, imageUri });
    navigation.navigate('Home'); // 등록 후 홈으로 이동
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 식물 추가</Text>
        <View style={{ width: 24 }} /> {/* 타이틀 중앙 정렬용 여백 */}
      </View>

      {/* 키보드가 입력창을 가리지 않도록 KeyboardAvoidingView 사용 */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          
          {/* Photo Upload Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>식물 사진</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.iconCircle}>
                    <Upload color="#7CCB8A" size={32} />
                  </View>
                  <Text style={styles.uploadText}>식물 사진 업로드</Text>
                  <Text style={styles.uploadSubText}>JPG, PNG 최대 10MB</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Plant Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>식물 이름</Text>
            <TextInput
              style={styles.textInput}
              placeholder="예: 우리집 몬스테라"
              placeholderTextColor="#9CA3AF"
              value={plantName}
              onChangeText={setPlantName}
            />
          </View>

          {/* Memo Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>메모 (선택사항)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="식물에 대한 메모를 남겨보세요..."
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top" // 안드로이드 상단 정렬
              value={memo}
              onChangeText={setMemo}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button (하단 고정) */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            !plantName && styles.submitButtonDisabled // 이름이 없으면 비활성화 스타일
          ]} 
          onPress={handleSubmit}
          disabled={!plantName} // 이름이 없으면 터치 방지
        >
          <Text style={styles.submitButtonText}>식물 등록하기</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    gap: 24, // React Native >= 0.71 부터 지원
  },
  inputGroup: {
    marginBottom: 20, // gap이 미지원인 하위 버전을 위한 여백 설정
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  uploadBox: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 16,
    overflow: 'hidden', // 이미지가 둥근 모서리를 넘지 않도록
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(124, 203, 138, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  uploadSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 120,
  },
  bottomContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#3a7d44',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});