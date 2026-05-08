import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar
} from 'react-native';
import { ArrowLeft, Camera, Calendar, Clock, Leaf, Check } from 'lucide-react-native';

// --- Mock Data ---
const myPlants = [
  { id: "1", name: "몬스테라 델리시오사", emoji: "🌿" },
  { id: "2", name: "산세베리아", emoji: "🪴" },
  { id: "3", name: "보스턴 고사리", emoji: "🌱" },
  { id: "4", name: "다육이 삼총사", emoji: "🌵" },
];

const entryTypes = [
  { id: "growth", label: "성장 기록", color: "#3a7d44" },
  { id: "care", label: "일상 관리", color: "#0ea5e9" },
  { id: "watering", label: "물주기", color: "#0284c7" },
  { id: "repot", label: "분갈이", color: "#a16207" },
  { id: "bloom", label: "개화", color: "#db2777" },
  { id: "issue", label: "이상 증상", color: "#dc2626" },
];

const today = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const defaultDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
const defaultTime = `${pad(today.getHours())}:${pad(today.getMinutes())}`;

export function DiaryWrite({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [selectedPlant, setSelectedPlant] = useState(myPlants[0].id);
  const [selectedType, setSelectedType] = useState(entryTypes[0].id);
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [note, setNote] = useState("");

  const canSubmit = note.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    // TODO: 백엔드/Store 저장 로직 구현
    console.log("기록 저장:", { selectedPlant, selectedType, date, time, note });
    Alert.alert("성공", "기록이 성공적으로 저장되었습니다.", [
      { text: "확인", onPress: () => onNavigate("growth-diary") }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onNavigate("growth-diary")}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 기록 쓰기</Text>
        <View style={{ width: 40 }} /> {/* 타이틀 중앙 정렬용 빈 뷰 */}
      </View>

      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          
          {/* 1. Photo Upload */}
          <TouchableOpacity style={styles.photoUpload}>
            <View style={styles.photoUploadInner}>
              <Camera color="#9CA3AF" size={32} />
              <Text style={styles.photoUploadText}>사진 추가하기</Text>
            </View>
          </TouchableOpacity>

          {/* 2. Plant Selection (Horizontal Scroll) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>어떤 식물의 기록인가요?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {myPlants.map((plant) => {
                const isSelected = selectedPlant === plant.id;
                return (
                  <TouchableOpacity
                    key={plant.id}
                    onPress={() => setSelectedPlant(plant.id)}
                    style={[styles.plantChip, isSelected && styles.plantChipActive]}
                  >
                    <Text style={styles.plantChipEmoji}>{plant.emoji}</Text>
                    <Text style={[styles.plantChipText, isSelected && styles.plantChipTextActive]}>
                      {plant.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 3. Category Selection (Grid Wrap) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>기록 종류</Text>
            <View style={styles.typeGrid}>
              {entryTypes.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    style={[
                      styles.typeChip,
                      isSelected && { backgroundColor: type.color, borderColor: type.color }
                    ]}
                  >
                    {isSelected && <Check color="#ffffff" size={14} style={{ marginRight: 4 }} />}
                    <Text style={[styles.typeChipText, isSelected && { color: '#ffffff' }]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Date & Time (Mocked TextInputs for now) */}
          <View style={styles.rowSection}>
            <View style={styles.halfInput}>
              <Text style={styles.sectionTitle}>날짜</Text>
              <View style={styles.dateTimeWrapper}>
                <Calendar color="#9CA3AF" size={18} style={styles.inputIcon} />
                <TextInput
                  style={styles.dateTimeInput}
                  value={date}
                  onChangeText={setDate}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.sectionTitle}>시간</Text>
              <View style={styles.dateTimeWrapper}>
                <Clock color="#9CA3AF" size={18} style={styles.inputIcon} />
                <TextInput
                  style={styles.dateTimeInput}
                  value={time}
                  onChangeText={setTime}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* 5. Note Textarea */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내용</Text>
            <View style={[styles.textAreaWrapper, note.length > 0 && styles.textAreaActive]}>
              <TextInput
                style={styles.textArea}
                placeholder="식물의 상태나 해주고 싶은 말을 적어보세요..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={note}
                onChangeText={(text) => {
                  if (text.length <= 500) setNote(text);
                }}
              />
            </View>
            <View style={styles.textAreaFooter}>
              <View style={styles.textAreaHint}>
                <Leaf color="#7CCB8A" size={12} style={{ marginRight: 4 }} />
                <Text style={styles.hintText}>작은 변화도 소중한 기록이 돼요</Text>
              </View>
              <Text style={styles.charCount}>{note.length}/500</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Fixed Submit Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}>
              기록 저장하기
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  flex1: { flex: 1 },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  iconButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  photoUpload: { backgroundColor: '#F9FAFB', borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 24, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  photoUploadInner: { alignItems: 'center' },
  photoUploadText: { marginTop: 12, fontSize: 14, fontWeight: '500', color: '#6B7280' },
  
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12 },
  
  horizontalScroll: { gap: 12, paddingRight: 20 },
  plantChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F9FAFB', borderWidth: 2, borderColor: 'transparent', borderRadius: 20, marginRight: 10 },
  plantChipActive: { backgroundColor: '#F0FDF4', borderColor: '#7CCB8A' },
  plantChipEmoji: { fontSize: 16, marginRight: 8 },
  plantChipText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  plantChipTextActive: { color: '#2E7D32', fontWeight: '600' },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, marginRight: 8, marginBottom: 8 },
  typeChipText: { fontSize: 14, fontWeight: '500', color: '#4B5563' },

  rowSection: { flexDirection: 'row', gap: 16, marginBottom: 28 },
  halfInput: { flex: 1, marginRight: 8 },
  dateTimeWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 16, height: 48 },
  inputIcon: { marginRight: 8 },
  dateTimeInput: { flex: 1, fontSize: 15, color: '#111827' },

  textAreaWrapper: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, padding: 16 },
  textAreaActive: { backgroundColor: '#ffffff', borderColor: '#7CCB8A' },
  textArea: { fontSize: 15, color: '#111827', minHeight: 120 },
  textAreaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingHorizontal: 4 },
  textAreaHint: { flexDirection: 'row', alignItems: 'center' },
  hintText: { fontSize: 12, color: '#9CA3AF' },
  charCount: { fontSize: 12, color: '#9CA3AF' },

  bottomBar: { backgroundColor: 'rgba(245, 245, 240, 0.95)', borderTopWidth: 1, borderTopColor: 'rgba(229, 231, 235, 0.6)', paddingHorizontal: 20, paddingVertical: 16 },
  submitButton: { backgroundColor: '#2d5a27', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  submitButtonDisabled: { backgroundColor: '#E5E7EB' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  submitButtonTextDisabled: { color: '#9CA3AF' },
});