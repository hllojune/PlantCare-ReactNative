import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {
  ArrowLeft,
  Cpu,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
  Pencil,
  Power,
  RefreshCw,
  Signal,
  AlertCircle,
  Check,
} from 'lucide-react-native';

// 안드로이드 아코디언 애니메이션 활성화
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Types ---
export interface SensorDevicesProps {
  onNavigate: (screen: string, plantId?: string) => void;
}

export interface Device {
  id: string;
  nickname: string;
  mac: string;
  plantName: string;
  online: boolean;
  battery: number;
  signal: number; // 1-4
  firmware: string;
  ssid: string;
  lastSync: string;
  threshold: number;
  duration: number;
}

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface InfoRowProps {
  label: string;
  value: string;
  onPress?: () => void;
  showArrow?: boolean;
}

// --- Mock Data ---
const initialDevices: Device[] = [
  {
    id: "d1",
    nickname: "거실 창가 센서",
    mac: "AA:BB:CC:DD:EE:01",
    plantName: "몬스테라 델리시오사",
    online: true,
    battery: 78,
    signal: 4,
    firmware: "v1.4.2",
    ssid: "Home_WiFi_5G",
    lastSync: "방금 전",
    threshold: 30,
    duration: 3000,
  },
  {
    id: "d2",
    nickname: "베란다 센서",
    mac: "AA:BB:CC:DD:EE:02",
    plantName: "연결된 식물 없음",
    online: false,
    battery: 15,
    signal: 1,
    firmware: "v1.4.0",
    ssid: "Home_WiFi_2.4G",
    lastSync: "2일 전",
    threshold: 40,
    duration: 5000,
  },
];

// --- Sub Components ---
const StatBox: React.FC<StatBoxProps> = ({ icon, label, value }) => (
  <View style={styles.statBox}>
    <View style={styles.statBoxIcon}>{icon}</View>
    <Text style={styles.statBoxLabel}>{label}</Text>
    <Text style={styles.statBoxValue}>{value}</Text>
  </View>
);

const InfoRow: React.FC<InfoRowProps> = ({ label, value, onPress, showArrow }) => {
  const Content = (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer}>
        <Text style={styles.infoValue}>{value}</Text>
        {showArrow && <ChevronRight size={16} color="#9CA3AF" />}
      </View>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{Content}</TouchableOpacity>;
  }
  return Content;
};

// --- Main Component ---
export function SensorDevices({ onNavigate }: SensorDevicesProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [expandedId, setExpandedId] = useState<string | null>(initialDevices[0]?.id || null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
    setConfirmRemoveId(null); // 다른 항목 열 때 삭제 확인 상태 초기화
  };

  const handleRemove = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setConfirmRemoveId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate("settings")}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기기 관리</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate("sensor-register")}>
          <Plus color="#3a7d44" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {devices.map((device) => {
          const isExpanded = expandedId === device.id;
          const isConfirming = confirmRemoveId === device.id;

          return (
            <View 
              key={device.id} 
              style={[styles.deviceCard, isExpanded && styles.deviceCardExpanded]}
            >
              {/* Card Header */}
              <TouchableOpacity 
                style={styles.cardHeader} 
                onPress={() => toggleExpand(device.id)}
                activeOpacity={0.7}
              >
                <View style={styles.headerLeft}>
                  <View style={[styles.statusDot, { backgroundColor: device.online ? '#10B981' : '#D1D5DB' }]} />
                  <View>
                    <View style={styles.nicknameRow}>
                      <Text style={styles.deviceNickname}>{device.nickname}</Text>
                      {device.online ? (
                        <View style={styles.onlineBadge}>
                          <Text style={styles.onlineBadgeText}>온라인</Text>
                        </View>
                      ) : (
                        <View style={styles.offlineBadge}>
                          <Text style={styles.offlineBadgeText}>오프라인</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.deviceMac}>{device.mac}</Text>
                  </View>
                </View>
                {isExpanded ? <ChevronDown size={20} color="#9CA3AF" /> : <ChevronRight size={20} color="#9CA3AF" />}
              </TouchableOpacity>

              {/* Expanded Content */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  {/* Stats Row */}
                  <View style={styles.statsRow}>
                    <StatBox
                      icon={device.battery > 20 ? <Battery size={16} color="#10B981" /> : <BatteryLow size={16} color="#EF4444" />}
                      label="배터리"
                      value={`${device.battery}%`}
                    />
                    <StatBox
                      icon={<Signal size={16} color={device.online ? "#3B82F6" : "#9CA3AF"} />}
                      label="신호 강도"
                      value={device.online ? `${device.signal}/4` : "-"}
                    />
                    <StatBox
                      icon={<Cpu size={16} color="#8B5CF6" />}
                      label="펌웨어"
                      value={device.firmware}
                    />
                  </View>

                  <View style={styles.divider} />

                  {/* Info Rows */}
                  <View style={styles.infoList}>
                    <InfoRow 
                      label="연결된 식물" 
                      value={device.plantName} 
                      onPress={() => {}} 
                      showArrow 
                    />
                    <InfoRow 
                      label="Wi-Fi 네트워크" 
                      value={device.ssid} 
                      onPress={() => {}} 
                      showArrow 
                    />
                    <InfoRow 
                      label="마지막 동기화" 
                      value={device.lastSync} 
                    />
                  </View>

                  <View style={styles.divider} />

                  {/* Action Buttons */}
                  <View style={styles.actionContainer}>
                    {isConfirming ? (
                      <View style={styles.confirmBox}>
                        <View style={styles.confirmHeader}>
                          <AlertCircle size={16} color="#EF4444" />
                          <Text style={styles.confirmText}>정말 삭제하시겠습니까?</Text>
                        </View>
                        <View style={styles.confirmButtons}>
                          <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={() => setConfirmRemoveId(null)}
                          >
                            <Text style={styles.cancelButtonText}>취소</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.removeButton} 
                            onPress={() => handleRemove(device.id)}
                          >
                            <Text style={styles.removeButtonText}>연결 해제</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.initRemoveButton} 
                        onPress={() => setConfirmRemoveId(device.id)}
                      >
                        <Power size={16} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text style={styles.initRemoveText}>기기 연결 해제</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  iconButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // Device Card
  deviceCard: { backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  deviceCardExpanded: { borderColor: '#7CCB8A', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  nicknameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  deviceNickname: { fontSize: 16, fontWeight: '700', color: '#111827', marginRight: 8 },
  onlineBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  onlineBadgeText: { fontSize: 10, fontWeight: '600', color: '#059669' },
  offlineBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  offlineBadgeText: { fontSize: 10, fontWeight: '600', color: '#6B7280' },
  deviceMac: { fontSize: 12, color: '#9CA3AF', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },

  // Expanded Content
  expandedContent: { paddingHorizontal: 16, paddingBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 4 },
  
  // Stat Box
  statBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  statBoxIcon: { marginBottom: 4 },
  statBoxLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 2 },
  statBoxValue: { fontSize: 14, fontWeight: '700', color: '#111827' },

  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },

  // Info Row
  infoList: { gap: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValueContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#111827' },

  // Action Buttons
  actionContainer: { marginTop: 4 },
  initRemoveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingVertical: 14 },
  initRemoveText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
  
  // Confirm Remove
  confirmBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#FECACA' },
  confirmHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  confirmText: { fontSize: 14, fontWeight: '600', color: '#991B1B' },
  confirmButtons: { flexDirection: 'row', gap: 8 },
  cancelButton: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  removeButton: { flex: 1, backgroundColor: '#EF4444', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  removeButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
});