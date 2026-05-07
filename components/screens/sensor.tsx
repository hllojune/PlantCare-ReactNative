import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface SensorRegisterProps {
  onNavigate: (screen: string) => void;
}

interface UnlinkedDevice {
  deviceId: string;
  active: boolean;
}

interface PlantOption {
  id: number;
  nickname: string;
  species: string;
}

const mockUnlinkedDevices: UnlinkedDevice[] = [
  { deviceId: 'AA:BB:CC:DD:EE:01', active: true },
  { deviceId: 'AA:BB:CC:DD:EE:02', active: true },
  { deviceId: 'AA:BB:CC:DD:EE:03', active: false }, // 오프라인 테스트용
];

const mockPlants: PlantOption[] = [
  { id: 1, nickname: '몬스테라', species: 'Monstera Deliciosa' },
  { id: 2, nickname: '산세베리아', species: 'Sansevieria trifasciata' },
  { id: 3, nickname: '보스턴 고사리', species: 'Nephrolepis exaltata' },
  { id: 4, nickname: '다육이 삼총사', species: 'Mixed Succulents' },
];

type Step = 'select-device' | 'name-device' | 'link-plant' | 'configure' | 'done';

// 임시 PrimaryButton 컴포넌트 (원래 외부 파일에 있던 것)
const PrimaryButton = ({ children, onClick, disabled, fullWidth }: any) => (
  <TouchableOpacity
    style={[
      styles.primaryBtn,
      fullWidth && styles.fullWidth,
      disabled && styles.disabledBtn,
    ]}
    onPress={onClick}
    disabled={disabled}
  >
    <Text style={styles.primaryBtnText}>{children}</Text>
  </TouchableOpacity>
);

export function SensorRegister({ onNavigate }: SensorRegisterProps) {
  const [step, setStep] = useState<Step>('select-device');
  const [selectedDevice, setSelectedDevice] = useState<UnlinkedDevice | null>(null);
  const [deviceName, setDeviceName] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<PlantOption | null>(null);
  const [threshold, setThreshold] = useState(30);
  const [duration, setDuration] = useState(3000);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const steps: Step[] = ['select-device', 'name-device', 'link-plant', 'configure', 'done'];
  const stepIndex = steps.indexOf(step);
  const totalSteps = 4;

  const handleComplete = () => {
    onNavigate('sensor');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => {
              if (step === 'select-device') onNavigate('sensor');
              else setStep(steps[stepIndex - 1]);
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>센서 등록</Text>
        </View>

        {/* Progress Bar */}
        {step !== 'done' && (
          <View style={styles.progressContainer}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressBar,
                  i <= stepIndex ? styles.progressActive : styles.progressInactive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Step 1: Select Device */}
        {step === 'select-device' && (
          <View style={styles.stepContainer}>
            <View style={styles.titleSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="hardware-chip-outline" size={32} color="#3a7d44" />
              </View>
              <Text style={styles.titleText}>ESP32 기기 선택</Text>
              <Text style={styles.subtitleText}>전원이 켜진 미연결 기기를 선택해주세요</Text>
            </View>

            <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
              <Ionicons name="refresh-outline" size={18} color="#3a7d44" />
              <Text style={styles.scanButtonText}>
                {isScanning ? '검색 중...' : '기기 다시 검색'}
              </Text>
            </TouchableOpacity>

            <View style={styles.listContainer}>
              {mockUnlinkedDevices.map((device) => (
                <TouchableOpacity
                  key={device.deviceId}
                  onPress={() => {
                    setSelectedDevice(device);
                    setStep('name-device');
                  }}
                  style={[
                    styles.card,
                    selectedDevice?.deviceId === device.deviceId && styles.cardActive,
                  ]}
                >
                  <View style={styles.deviceIconBox}>
                    <Ionicons
                      name={device.active ? "wifi" : "wifi-outline"}
                      size={20}
                      color={device.active ? "#7CCB8A" : "#ccc"}
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>ESP32 센서</Text>
                    <Text style={styles.cardSubtitle}>{device.deviceId}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Name Device */}
        {step === 'name-device' && (
          <View style={styles.stepContainer}>
            <View style={styles.titleSection}>
              <View style={styles.iconCircle}>
                <Ionicons name="hardware-chip-outline" size={32} color="#3a7d44" />
              </View>
              <Text style={styles.titleText}>기기 별명 설정</Text>
              <Text style={styles.subtitleText}>센서 기기를 쉽게 구분할 수 있는 이름을 지어주세요</Text>
            </View>

            <View style={styles.inputBox}>
              <View style={styles.selectedDeviceInfo}>
                <View style={styles.deviceIconBox}>
                  <Ionicons name="wifi" size={20} color="#7CCB8A" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>선택된 기기</Text>
                  <Text style={styles.cardSubtitle}>{selectedDevice?.deviceId}</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>기기 별명</Text>
              <TextInput
                style={styles.textInput}
                value={deviceName}
                onChangeText={setDeviceName}
                placeholder="예: 거실 창가 센서"
                placeholderTextColor="#999"
              />
            </View>

            <PrimaryButton fullWidth disabled={!deviceName.trim()} onClick={() => setStep('link-plant')}>
              다음
            </PrimaryButton>
          </View>
        )}

        {/* Step 3: Link Plant */}
        {step === 'link-plant' && (
          <View style={styles.stepContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>식물 연결</Text>
              <Text style={styles.subtitleText}>
                <Text style={styles.highlightText}>{deviceName}</Text>에 연결할 식물을 선택해주세요
              </Text>
            </View>

            <View style={styles.listContainer}>
              {mockPlants.map((plant) => (
                <TouchableOpacity
                  key={plant.id}
                  onPress={() => setSelectedPlant(plant)}
                  style={[
                    styles.card,
                    selectedPlant?.id === plant.id && styles.cardActive,
                  ]}
                >
                  <View style={styles.plantEmojiBox}>
                    <Text style={{ fontSize: 20 }}>🌿</Text>
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{plant.nickname}</Text>
                    <Text style={styles.cardSubtitle}>{plant.species}</Text>
                  </View>
                  {selectedPlant?.id === plant.id && (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <PrimaryButton fullWidth disabled={!selectedPlant} onClick={() => setStep('configure')}>
              다음
            </PrimaryButton>
          </View>
        )}

        {/* Step 4: Configure */}
        {step === 'configure' && (
          <View style={styles.stepContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>자동 급수 설정</Text>
              <Text style={styles.subtitleText}>토양 수분 임계값과 펌프 가동 시간을 설정해주세요</Text>
            </View>

            <View style={styles.configCard}>
              <View style={styles.configHeader}>
                <View style={styles.iconCircleSmall}>
                  <Ionicons name="water-outline" size={20} color="#2196F3" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>토양 수분 임계값</Text>
                  <Text style={styles.cardSubtitle}>이 값 이하로 내려가면 펌프가 작동합니다</Text>
                </View>
              </View>
              
              <View style={styles.sliderRow}>
                <Slider
                  style={styles.slider}
                  minimumValue={10}
                  maximumValue={70}
                  step={1}
                  value={threshold}
                  onValueChange={setThreshold}
                  minimumTrackTintColor="#7CCB8A"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#7CCB8A"
                />
                <View style={styles.valueDisplay}>
                  <Text style={styles.valueText}>{threshold}%</Text>
                </View>
              </View>

              <View style={styles.presetRow}>
                {[
                  { label: "표면 건조 시", value: 30, duration: 3000 },
                  { label: "대부분 건조 시", value: 15, duration: 5000 },
                  { label: "기본값", value: 50, duration: 1000 },
                ].map((preset) => (
                  <TouchableOpacity
                    key={preset.label}
                    onPress={() => { setThreshold(preset.value); setDuration(preset.duration); }}
                    style={[
                      styles.presetButton,
                      threshold === preset.value && styles.presetButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.presetText,
                      threshold === preset.value && styles.presetTextActive
                    ]}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.configCard}>
              <View style={styles.configHeader}>
                <View style={[styles.iconCircleSmall, { backgroundColor: '#FFF8E1' }]}>
                  <Ionicons name="timer-outline" size={20} color="#FFC107" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>펌프 가동 시간</Text>
                  <Text style={styles.cardSubtitle}>한 번에 물을 주는 시간입니다</Text>
                </View>
              </View>
              
              <View style={styles.sliderRow}>
                <Slider
                  style={styles.slider}
                  minimumValue={500}
                  maximumValue={10000}
                  step={500}
                  value={duration}
                  onValueChange={setDuration}
                  minimumTrackTintColor="#7CCB8A"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#7CCB8A"
                />
                <View style={styles.valueDisplay}>
                  <Text style={styles.valueText}>{(duration / 1000).toFixed(1)}초</Text>
                </View>
              </View>
            </View>

            <PrimaryButton fullWidth onClick={() => setStep('done')}>
              등록 완료
            </PrimaryButton>
          </View>
        )}

        {/* Step 5: Done */}
        {step === 'done' && (
          <View style={styles.doneContainer}>
            <View style={styles.doneIcon}>
              <Ionicons name="checkmark" size={48} color="#fff" />
            </View>
            <Text style={styles.doneTitle}>센서 등록 완료!</Text>
            <Text style={styles.doneSubtitle}>
              <Text style={styles.highlightText}>{deviceName}</Text>이(가){'\n'}
              <Text style={styles.highlightText}>{selectedPlant?.nickname}</Text>에 연결되었습니다
            </Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>기기 ID</Text>
                <Text style={styles.summaryValue}>{selectedDevice?.deviceId}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>기기 별명</Text>
                <Text style={styles.summaryValue}>{deviceName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>연결 식물</Text>
                <Text style={styles.summaryValue}>{selectedPlant?.nickname}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>수분 임계값</Text>
                <Text style={styles.summaryValue}>{threshold}%</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>펌프 가동</Text>
                <Text style={styles.summaryValue}>{(duration / 1000).toFixed(1)}초</Text>
              </View>
            </View>

            <PrimaryButton fullWidth onClick={handleComplete}>
              센서 대시보드로 이동
            </PrimaryButton>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  appBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: '#7CCB8A',
  },
  progressInactive: {
    backgroundColor: '#E0E0E0',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  stepContainer: {
    gap: 20,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(124, 203, 138, 0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#3a7d44',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  scanButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#3a7d44',
  },
  listContainer: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardActive: {
    borderColor: '#7CCB8A',
    backgroundColor: '#f9fdfa',
  },
  deviceIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  plantEmojiBox: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(124, 203, 138, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  checkCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#7CCB8A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedDeviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  configCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleSmall: {
    width: 36,
    height: 36,
    backgroundColor: '#E3F2FD',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  valueDisplay: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a7d44',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(124, 203, 138, 0.15)',
    borderWidth: 1,
    borderColor: '#7CCB8A',
  },
  presetText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#3a7d44',
  },
  doneContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  doneIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#7CCB8A',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  doneSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    gap: 12,
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  primaryBtn: {
    backgroundColor: '#7CCB8A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});