import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sprout, Sparkles, Plus } from 'lucide-react-native';

// --- Mock Data (lib/diaryStore.ts 대체용) ---
const mockDiaryEntries = [
  {
    id: "1",
    plant: "몬스테라",
    date: "2024.05.20",
    time: "14:30",
    type: "물주기",
    note: "새 잎이 돋아나기 시작했어요! 잎사귀가 점점 커지는 게 보이네요.",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
    source: "user"
  },
  {
    id: "2",
    plant: "몬스테라",
    date: "2024.05.15",
    time: "10:15",
    type: "상태 점검",
    note: "잎 끝이 약간 마르는 것 같아 AI 진단을 받아보았습니다. 습도 조절이 필요하대요.",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400",
    source: "ai",
    confidence: 95
  }
];

export function GrowthDiary({ onNavigate }: { onNavigate: (screen: string) => void }) {
  // 실제 API 연동 시에는 아래 데이터를 사용할 수 있습니다.
  const diaryEntries = mockDiaryEntries;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.headerTitle}>성장 일지</Text>
        <Text style={styles.headerSubtitle}>{diaryEntries.length}개의 기록</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Timeline Container */}
        <View style={styles.timelineContainer}>
          
          {/* Timeline Vertical Line */}
          <View style={styles.timelineLine} />

          {/* Entries */}
          <View style={styles.entriesList}>
            {diaryEntries.map((entry) => (
              <View key={entry.id} style={styles.entryRow}>
                
                {/* Timeline Dot */}
                <View style={styles.timelineDotContainer}>
                  <LinearGradient
                    colors={['#7CCB8A', '#3a7d44']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.timelineDotGradient}
                  >
                    <View style={styles.timelineDotInner} />
                  </LinearGradient>
                </View>

                {/* Entry Card */}
                <View style={styles.entryCard}>
                  <Image source={{ uri: entry.image }} style={styles.entryImage} />
                  <View style={styles.entryContent}>
                    
                    <View style={styles.entryHeader}>
                      <View>
                        <Text style={styles.plantName}>{entry.plant}</Text>
                        <Text style={styles.dateTime}>
                          {entry.date} • {entry.time}
                        </Text>
                      </View>
                      
                      <View style={styles.tagColumn}>
                        <View style={styles.typeTag}>
                          <Text style={styles.typeTagText}>{entry.type}</Text>
                        </View>
                        
                        {entry.source === "ai" && (
                          <View style={styles.aiTag}>
                            <Sparkles color="#7C3AED" size={12} />
                            <Text style={styles.aiTagText}>
                              AI 진단 {entry.confidence != null && <Text style={styles.aiConfidence}>· {entry.confidence}%</Text>}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={styles.entryNote}>{entry.note}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Inline "새 성장 기록 쓰기" Button */}
            <View style={styles.entryRow}>
              <View style={styles.addDotContainer}>
                <Plus color="#3a7d44" size={16} />
              </View>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => onNavigate("diary-write")}
              >
                <View style={styles.addIconCircle}>
                  <Sprout color="#3a7d44" size={16} />
                </View>
                <Text style={styles.addButtonText}>새 성장 기록 쓰기</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3a7d44',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  timelineContainer: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 19, // 40px 동그라미의 중앙 (20px)에서 선 두께(2px)의 절반을 뺀 값
    top: 32,
    bottom: 40,
    width: 2,
    backgroundColor: 'rgba(124, 203, 138, 0.3)',
  },
  entriesList: {
    gap: 24, // React Native >= 0.71
  },
  entryRow: {
    position: 'relative',
    paddingLeft: 48, // 타임라인 점과 선을 위한 왼쪽 여백 확보
    marginBottom: 24, // gap을 미지원하는 경우를 위한 하단 여백
  },
  timelineDotContainer: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(124, 203, 138, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineDotGradient: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  entryContent: {
    padding: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  dateTime: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  tagColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  typeTag: {
    backgroundColor: 'rgba(124, 203, 138, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTagText: {
    color: '#3a7d44',
    fontSize: 12,
    fontWeight: '600',
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF', // violet-50
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiTagText: {
    color: '#7C3AED', // violet-600
    fontSize: 10,
    fontWeight: '600',
  },
  aiConfidence: {
    opacity: 0.7,
  },
  entryNote: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  addDotContainer: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(124, 203, 138, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 203, 138, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});