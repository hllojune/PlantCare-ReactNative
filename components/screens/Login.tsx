import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
  Modal, ActivityIndicator, StatusBar,
} from 'react-native';
import { Sprout, Mail, EyeOff, Eye, X, Check } from 'lucide-react-native';

const googleAccounts = [
  { name: '김식물', email: 'kimplant@gmail.com', color: '#4285F4' },
  { name: 'Garden Lover', email: 'gardenlover@gmail.com', color: '#34A853' },
];

export function Login({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stage, setStage] = useState<'choose' | 'consent' | 'loading' | 'success'>('choose');
  const [provider, setProvider] = useState<'google' | 'apple' | null>(null);

  const openProvider = (p: 'google' | 'apple') => {
    setProvider(p);
    setStage(p === 'apple' ? 'consent' : 'choose');
    setIsModalOpen(true);
  };

  const handleConsent = () => {
    setStage('loading');
    setTimeout(() => setStage('success'), 1300);
    setTimeout(() => {
      setIsModalOpen(false);
      setStage('choose');
      onNavigate('home');
    }, 2100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Sprout color="#3a7d44" size={32} />
            </View>
            <Text style={styles.title}>다시 오신 것을 환영해요</Text>
            <Text style={styles.subtitle}>초록빛 일상을 SPPKL과 함께 이어가세요.</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
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

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>비밀번호</Text>
                <TouchableOpacity><Text style={styles.forgotText}>비밀번호 찾기</Text></TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPw}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeIcon}>
                  {showPw ? <Eye color="#9CA3AF" size={20} /> : <EyeOff color="#9CA3AF" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={() => onNavigate('home')}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
          </View>

          {/* Social */}
          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는 다음으로 계속</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialButton} onPress={() => openProvider('google')}>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={() => openProvider('apple')}>
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => onNavigate('signup')}>
              <Text style={styles.signupLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Social Login Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {provider === 'google' ? 'Google 계정으로 로그인' : 'Apple로 로그인'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X color="#374151" size={24} />
              </TouchableOpacity>
            </View>

            {stage === 'choose' && (
              <View style={styles.sheetContent}>
                {googleAccounts.map((acc, idx) => (
                  <TouchableOpacity key={idx} style={styles.accountItem} onPress={handleConsent}>
                    <View style={[styles.avatar, { backgroundColor: acc.color }]}>
                      <Text style={styles.avatarText}>{acc.name[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.accName}>{acc.name}</Text>
                      <Text style={styles.accEmail}>{acc.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {stage === 'consent' && (
              <View style={styles.sheetContent}>
                <Text style={styles.consentText}>서비스 이용을 위해 정보 제공에 동의해 주세요.</Text>
                <TouchableOpacity style={styles.consentButton} onPress={handleConsent}>
                  <Text style={styles.consentButtonText}>동의하고 계속하기</Text>
                </TouchableOpacity>
              </View>
            )}

            {stage === 'loading' && (
              <View style={[styles.sheetContent, styles.center]}>
                <ActivityIndicator size="large" color="#3a7d44" />
                <Text style={styles.loadingText}>로그인 중...</Text>
              </View>
            )}

            {stage === 'success' && (
              <View style={[styles.sheetContent, styles.center]}>
                <View style={styles.successBadge}>
                  <Check color="#ffffff" size={32} />
                </View>
                <Text style={styles.successText}>로그인 성공!</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 48 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  formContainer: { gap: 20 },
  inputGroup: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  forgotText: { fontSize: 12, color: '#3a7d44', fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 16, paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, height: 56, fontSize: 16, color: '#111827' },
  eyeIcon: { padding: 8 },
  loginButton: {
    backgroundColor: '#2d5a27', height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  loginButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  socialSection: { marginTop: 32 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 12, color: '#9CA3AF' },
  socialButtonsRow: { flexDirection: 'row', gap: 12 },
  socialButton: {
    flex: 1, height: 56, borderRadius: 16, borderWidth: 1,
    borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
  },
  socialButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  appleButton: { backgroundColor: '#000000', borderColor: '#000000' },
  appleButtonText: { color: '#ffffff' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  footerText: { fontSize: 14, color: '#6B7280' },
  signupLink: { fontSize: 14, color: '#3a7d44', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, minHeight: 350,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  sheetContent: { gap: 16 },
  accountItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
    borderRadius: 16, backgroundColor: '#F9FAFB', marginBottom: 12,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { color: '#ffffff', fontWeight: '700' },
  accName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  accEmail: { fontSize: 13, color: '#6B7280' },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 16, color: '#6B7280' },
  successBadge: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#3a7d44', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  successText: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },
  consentText: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 20 },
  consentButton: {
    backgroundColor: '#3a7d44', height: 50, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  consentButtonText: { color: '#ffffff', fontWeight: '600' },
});
