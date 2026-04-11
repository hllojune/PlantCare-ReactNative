import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

// ─── Toggle ─────────────────────────────────────────────
interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}
function ToggleSwitch({ enabled, onToggle }: ToggleProps) {
  return (
    <Switch
      value={enabled}
      onValueChange={onToggle}
      trackColor={{ false: Colors.border, true: Colors.primary }}
      thumbColor={Colors.white}
      ios_backgroundColor={Colors.border}
    />
  );
}

// ─── Section Title ───────────────────────────────────────
function SectionTitle({ title }: { title: string }) {
  return (
    <Text style={styles.sectionTitle}>{title}</Text>
  );
}

// ─── Setting Row ─────────────────────────────────────────
interface SettingRowProps {
  iconName: string;
  iconBg: string;
  iconColor: string;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}
function SettingRow({
  iconName,
  iconBg,
  iconColor,
  label,
  description,
  right,
  onPress,
  danger,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName as any} size={18} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>
          {label}
        </Text>
        {description && (
          <Text style={styles.settingDesc}>{description}</Text>
        )}
      </View>
      {right ?? (
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
}

// ─── Confirmation Modal ──────────────────────────────────
interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  iconName: string;
  iconBg: string;
  iconColor: string;
  title: string;
  message: string;
  confirmLabel: string;
  confirmBg: string;
}
function ConfirmModal({
  visible, onClose, onConfirm,
  iconName, iconBg, iconColor,
  title, message, confirmLabel, confirmBg,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalIconWrap}>
            <View style={[styles.modalIcon, { backgroundColor: iconBg }]}>
              <Ionicons name={iconName as any} size={28} color={iconColor} />
            </View>
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalConfirmBtn, { backgroundColor: confirmBg }]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.modalConfirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────
export function SettingsScreen({ onNavigate }: NavigationProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [waterReminder, setWaterReminder] = useState(true);
  const [sensorAlert, setSensorAlert] = useState(true);
  const [aiResultAlert, setAiResultAlert] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);
  const [bluetoothPermission, setBluetoothPermission] = useState(true);
  const [wifiPermission, setWifiPermission] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('home')}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>설정</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="leaf" size={32} color={Colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>초록이 집사</Text>
            <View style={styles.profileEmailRow}>
              <Ionicons name="mail-outline" size={14} color={Colors.textTertiary} />
              <Text style={styles.profileEmail}>greenthumb@sppkl.app</Text>
            </View>
            <View style={styles.profileBadgeRow}>
              <View style={styles.profileBadgeGreen}>
                <Text style={styles.profileBadgeGreenText}>🌱 식물 4그루</Text>
              </View>
              <View style={styles.profileBadgeBlue}>
                <Text style={styles.profileBadgeBlueText}>가입 6개월</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* 알림 설정 */}
        <SectionTitle title="알림 설정" />
        <View style={styles.cardGroup}>
          <SettingRow iconName="notifications-outline" iconBg="#fff7ed" iconColor="#f97316"
            label="푸시 알림" description="앱 알림을 받습니다"
            right={<ToggleSwitch enabled={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />} />
          <View style={styles.divider} />
          <SettingRow iconName="notifications-outline" iconBg="#eff6ff" iconColor="#3b82f6"
            label="물주기 알림" description="물 줄 시간을 알려드려요"
            right={<ToggleSwitch enabled={waterReminder} onToggle={() => setWaterReminder(!waterReminder)} />} />
          <View style={styles.divider} />
          <SettingRow iconName="notifications-outline" iconBg={Colors.primaryBgLight} iconColor={Colors.primary}
            label="센서 이상 알림" description="온도·습도·토양 이상 시 알림"
            right={<ToggleSwitch enabled={sensorAlert} onToggle={() => setSensorAlert(!sensorAlert)} />} />
          <View style={styles.divider} />
          <SettingRow iconName="notifications-outline" iconBg="#f5f3ff" iconColor="#7c3aed"
            label="AI 진단 결과 알림" description="진단 완료 시 알림을 받습니다"
            right={<ToggleSwitch enabled={aiResultAlert} onToggle={() => setAiResultAlert(!aiResultAlert)} />} />
        </View>

        {/* 앱 권한 */}
        <SectionTitle title="앱 권한" />
        <View style={styles.cardGroup}>
          <SettingRow iconName="camera-outline" iconBg="#fdf2f8" iconColor="#ec4899"
            label="카메라" description="AI 진단 및 식물 사진 촬영"
            right={<ToggleSwitch enabled={cameraPermission} onToggle={() => setCameraPermission(!cameraPermission)} />} />
          <View style={styles.divider} />
          <SettingRow iconName="location-outline" iconBg="#fef2f2" iconColor="#ef4444"
            label="위치" description="지역 날씨 기반 관리 추천"
            right={<ToggleSwitch enabled={locationPermission} onToggle={() => setLocationPermission(!locationPermission)} />} />
          <View style={styles.divider} />
          <SettingRow iconName="bluetooth-outline" iconBg="#eff6ff" iconColor="#2563eb"
            label="블루투스" description="ESP32 센서 연결"
            right={<ToggleSwitch enabled={bluetoothPermission} onToggle={() => setBluetoothPermission(!bluetoothPermission)} />} />
          <View style={styles.divider} />
          <SettingRow iconName="wifi-outline" iconBg="#ecfeff" iconColor="#0891b2"
            label="Wi-Fi" description="센서 데이터 수신 및 동기화"
            right={<ToggleSwitch enabled={wifiPermission} onToggle={() => setWifiPermission(!wifiPermission)} />} />
        </View>

        {/* 일반 */}
        <SectionTitle title="일반" />
        <View style={styles.cardGroup}>
          <SettingRow iconName="moon-outline" iconBg="#eef2ff" iconColor="#6366f1"
            label="다크 모드" description="어두운 테마를 사용합니다"
            right={<ToggleSwitch enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />} />
          <View style={styles.divider} />
          <SettingRow iconName="globe-outline" iconBg="#ecfdf5" iconColor="#059669"
            label="언어" description="한국어" />
          <View style={styles.divider} />
          <SettingRow iconName="phone-portrait-outline" iconBg={Colors.backgroundGray} iconColor={Colors.textSecondary}
            label="센서 기기 관리" description="연결된 ESP32 기기 1대" />
        </View>

        {/* 지원 */}
        <SectionTitle title="지원" />
        <View style={styles.cardGroup}>
          <SettingRow iconName="help-circle-outline" iconBg="#fffbeb" iconColor="#d97706"
            label="도움말 및 FAQ" description="자주 묻는 질문과 가이드" />
          <View style={styles.divider} />
          <SettingRow iconName="document-text-outline" iconBg={Colors.backgroundGray} iconColor={Colors.textSecondary}
            label="이용약관" />
          <View style={styles.divider} />
          <SettingRow iconName="shield-checkmark-outline" iconBg={Colors.primaryBgLight} iconColor={Colors.primary}
            label="개인정보 처리방침" />
        </View>

        {/* 계정 */}
        <SectionTitle title="계정" />
        <View style={styles.cardGroup}>
          <SettingRow iconName="log-out-outline" iconBg="#fff7ed" iconColor="#f97316"
            label="로그아웃" description="현재 계정에서 로그아웃합니다"
            onPress={() => setShowLogoutModal(true)} />
          <View style={styles.divider} />
          <SettingRow iconName="trash-outline" iconBg="#fef2f2" iconColor="#ef4444"
            label="계정 삭제" description="모든 데이터가 영구 삭제됩니다"
            onPress={() => setShowDeleteModal(true)} danger />
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfo}>
          <View style={styles.appInfoLogoRow}>
            <Ionicons name="leaf-outline" size={16} color={Colors.primaryLight} />
            <Text style={styles.appInfoName}>SPPKL</Text>
          </View>
          <Text style={styles.appInfoVersion}>버전 1.0.0 (Build 2026.04)</Text>
          <Text style={styles.appInfoCopy}>© 2026 SPPKL. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => { setShowLogoutModal(false); onNavigate('login'); }}
        iconName="log-out-outline"
        iconBg="#fff7ed"
        iconColor="#f97316"
        title="로그아웃 하시겠어요?"
        message={`로그아웃해도 데이터는 유지됩니다.\n다시 로그인하면 이전 상태를 복원할 수 있어요.`}
        confirmLabel="로그아웃"
        confirmBg="#f97316"
      />

      {/* Delete Account Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => { setShowDeleteModal(false); onNavigate('onboarding'); }}
        iconName="trash-outline"
        iconBg="#fef2f2"
        iconColor="#ef4444"
        title="정말 계정을 삭제하시겠어요?"
        message={`이 작업은 되돌릴 수 없습니다.\n모든 식물 데이터, 일지, 센서 기록이 영구 삭제됩니다.`}
        confirmLabel="삭제하기"
        confirmBg="#ef4444"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingBottom: 48,
  },
  profileCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  profileEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileEmail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  profileBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  profileBadgeGreen: {
    backgroundColor: `${Colors.primaryLight}26`,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  profileBadgeGreenText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    color: Colors.primary,
  },
  profileBadgeBlue: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  profileBadgeBlueText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    color: '#2563eb',
  },
  editBtn: {
    padding: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
  },
  cardGroup: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 60,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    gap: Spacing.md,
    backgroundColor: Colors.white,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  settingLabelDanger: {
    color: Colors.error,
  },
  settingDesc: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: Spacing.lg,
    gap: 4,
  },
  appInfoLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appInfoName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  appInfoVersion: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  appInfoCopy: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalSheet: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xxl,
  },
  modalIconWrap: {
    marginBottom: Spacing.lg,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.white,
  },
});
