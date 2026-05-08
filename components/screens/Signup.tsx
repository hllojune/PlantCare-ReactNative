import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // 그라데이션 배경용
import { Leaf, ArrowRight, User, Mail, Lock } from 'lucide-react-native';

export function Signup({ onNavigate }: { onNavigate: (screen: string) => void }) {
  // 상태 관리
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!nickname || !email || !password) {
      Alert.alert("알림", "모든 정보를 입력해 주세요.");
      return;
    }
    // TODO: 백엔드 회원가입 API 호출 로직 (user-service 연동)
    console.log("회원가입 정보:", { nickname, email, password });
    
    // 가입 성공 시뮬레이션 후 홈으로 이동
    onNavigate('home'); 
  };

  return (
    <View style={styles.flex1}>
      <StatusBar barStyle="dark-content" />
      {/* 상단 그라데이션 배경 */}
      <LinearGradient
        colors={['#e8f5e9', '#ffffff']}
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex1}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Leaf color="#3a7d44" size={32} />
              </View>
              <Text style={styles.title}>초록빛 일상에 함께하세요</Text>
              <Text style={styles.subtitle}>
                SPPKL의 디지털 온실에서 식물 집사 생활을 시작해보세요.
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* Nickname Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>닉네임</Text>
                <View style={styles.inputWrapper}>
                  <User color="#9CA3AF" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="멋진 식물 집사"
                    placeholderTextColor="#9CA3AF"
                    value={nickname}
                    onChangeText={setNickname}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>이메일</Text>
                <View style={styles.inputWrapper}>
                  <Mail color="#9CA3AF" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="name@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호</Text>
                <View style={styles.inputWrapper}>
                  <Lock color="#9CA3AF" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
                <Text style={styles.helperText}>
                  영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
                <Text style={styles.submitButtonText}>계정 만들기</Text>
                <ArrowRight color="#ffffff" size={20} />
              </TouchableOpacity>
            </View>

            {/* Bottom Navigation Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>이미 계정이 있으신가요? </Text>
              <TouchableOpacity onPress={() => onNavigate('Login')}>
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 40, paddingBottom: 60 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  inputGroup: { marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  textInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#111827',
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#2d5a27',
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#3a7d44',
    fontWeight: '700',
  },
});