import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
    title: '실시간 정원 모니터링',
    desc: 'ESP32 센서로 식물의 온도, 습도, 토양 수분을 실시간으로 확인하세요.',
  },
  {
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
    title: '똑똑한 AI 건강 진단',
    desc: '사진 한 장으로 식물의 병해충을 진단하고 전문적인 케어 가이드를 받으세요.',
  },
  {
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    title: '나만의 식물 성장 일기',
    desc: '식물의 모든 성장 순간을 기록하고 타임라인으로 감상하세요.',
  },
  {
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800',
    title: '함께 초록빛\n일상을 만들어요',
    desc: '지금 SPPKL과 함께 당신의 디지털 온실을 시작해보세요.',
  },
];

const buttonLabels = ['시작하기', 'Next', '다음 단계로', '시작하기'];

export function OnboardingScreen({ onNavigate }: NavigationProps) {
  const [current, setCurrent] = useState(0);
  const isLast = current === slides.length - 1;
  const slide = slides[current];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="leaf" size={22} color={Colors.primary} />
          <Text style={styles.logoText}>SPPKL</Text>
        </View>
        {!isLast && (
          <TouchableOpacity onPress={() => onNavigate('login')}>
            <Text style={styles.skip}>SKIP</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isLast && (
        <Text style={styles.pageIndicator}>
          {current + 1} / {slides.length} Onboarding
        </Text>
      )}

      {/* Image */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: slide.image }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === current ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Text */}
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.desc}>{slide.desc}</Text>

      {/* Bottom */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.mainButton}
          activeOpacity={0.85}
          onPress={() => {
            if (isLast) onNavigate('login');
            else setCurrent(current + 1);
          }}
        >
          <Text style={styles.mainButtonText}>{buttonLabels[current]}</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>

        {current === 0 && (
          <Text style={styles.loginHint}>
            이미 계정이 있으신가요?{' '}
            <Text style={styles.loginLink} onPress={() => onNavigate('login')}>
              로그인
            </Text>
          </Text>
        )}

        {isLast && (
          <Text style={styles.versionText}>DIGITAL GREENHOUSE V1.0</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.xxl,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  skip: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  pageIndicator: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'right',
    marginBottom: Spacing.xl,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  dot: {
    borderRadius: BorderRadius.full,
    height: 10,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 10,
    backgroundColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  desc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  bottom: {
    gap: Spacing.lg,
    marginTop: 'auto',
  },
  mainButton: {
    backgroundColor: Colors.dark,
    borderRadius: BorderRadius.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  mainButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  loginHint: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
});
