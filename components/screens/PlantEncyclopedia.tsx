import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';

const { width } = Dimensions.get('window');
// 좌우 여백(16*2)과 카드 사이의 간격(16)을 제외한 너비의 절반
const cardWidth = (width - 48) / 2; 

// --- Mock Data ---
const CATEGORIES = ["전체", "초보자용", "다육식물", "관엽식물", "꽃/열매", "공기정화"];

const ENCYCLOPEDIA_DATA = [
  {
    id: "e1",
    name: "몬스테라",
    species: "Monstera Deliciosa",
    difficulty: "쉬움",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400",
  },
  {
    id: "e2",
    name: "산세베리아",
    species: "Sansevieria",
    difficulty: "매우 쉬움",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400",
  },
  {
    id: "e3",
    name: "알로카시아",
    species: "Alocasia",
    difficulty: "보통",
    image: "https://images.unsplash.com/photo-1620127027376-7bcbc170d10d?w=400",
  },
  {
    id: "e4",
    name: "필로덴드론",
    species: "Philodendron",
    difficulty: "쉬움",
    image: "https://images.unsplash.com/photo-1604762512526-b7ce049b576e?w=400",
  },
];

export function PlantEncyclopedia({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("전체");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.headerTitle}>식물도감</Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search color="#9CA3AF" size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder="식물 이름이나 학명 검색"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal color="#374151" size={20} />
        </TouchableOpacity>
      </View>

      {/* Category Horizontal Scroll */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category} 
              style={[
                styles.categoryBadge, 
                selectedCategory === category && styles.categoryBadgeActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText, 
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Plant Grid */}
      <ScrollView style={styles.container} contentContainerStyle={styles.gridContent}>
        <View style={styles.grid}>
          {ENCYCLOPEDIA_DATA.map(plant => (
            <TouchableOpacity 
              key={plant.id} 
              style={styles.card}
              onPress={() => navigation.navigate('EncyclopediaDetail', { plantId: plant.id })}
            >
              <Image source={{ uri: plant.image }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                <Text style={styles.plantSpecies} numberOfLines={1}>{plant.species}</Text>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{plant.difficulty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3a7d44',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#111827',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryBadgeActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#7CCB8A',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  gridContent: {
    padding: 16,
    paddingBottom: 100, // 하단 탭바 영역 확보
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: cardWidth, // 정사각형 비율 유지
    backgroundColor: '#F3F4F6',
  },
  cardInfo: {
    padding: 12,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  plantSpecies: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontStyle: 'italic',
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
});