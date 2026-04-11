import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../../types/navigation';
import { Colors, BorderRadius, FontSize, Spacing } from '../../theme';

const categories = ['전체', '다육식물', '허브', '관엽식물', '꽃식물', '열대식물'];

const encyclopediaPlants = [
  { id: 'e1', name: '몬스테라 델리시오사', scientificName: 'Monstera deliciosa', category: '열대식물', image: 'https://images.unsplash.com/photo-1608327624934-69f40c5a819b?w=400', difficulty: '쉬움' },
  { id: 'e2', name: '산세베리아', scientificName: 'Sansevieria Trifasciata', category: '관엽식물', image: 'https://images.unsplash.com/photo-1613498717076-c0d2d82ecf2d?w=400', difficulty: '쉬움' },
  { id: 'e3', name: '에케베리아 엘레강스', scientificName: 'Echeveria elegans', category: '다육식물', image: 'https://images.unsplash.com/photo-1761708247596-fb8d82f69a4c?w=400', difficulty: '쉬움' },
  { id: 'e4', name: '떡갈고무나무', scientificName: 'Ficus Lyrata', category: '관엽식물', image: 'https://images.unsplash.com/photo-1643819131782-474a409da244?w=400', difficulty: '어려움' },
  { id: 'e5', name: '라벤더', scientificName: 'Lavandula angustifolia', category: '허브', image: 'https://images.unsplash.com/photo-1764346850561-fd19972c734a?w=400', difficulty: '보통' },
  { id: 'e6', name: '골든 포토스', scientificName: 'Epipremnum aureum', category: '관엽식물', image: 'https://images.unsplash.com/photo-1607686678361-492bf032ea7d?w=400', difficulty: '쉬움' },
  { id: 'e7', name: '고무나무', scientificName: 'Ficus elastica', category: '관엽식물', image: 'https://images.unsplash.com/photo-1762008085289-d5c66f90cfca?w=400', difficulty: '쉬움' },
  { id: 'e8', name: '알로에 베라', scientificName: 'Aloe barbadensis', category: '다육식물', image: 'https://images.unsplash.com/photo-1570295835271-04c05b4ed943?w=400', difficulty: '쉬움' },
];

const difficultyColors: Record<string, string> = {
  '쉬움': Colors.primaryLight,
  '보통': '#f59e0b',
  '어려움': Colors.error,
};

export function PlantEncyclopediaScreen({ onNavigate }: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [likedPlants, setLikedPlants] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPlants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = encyclopediaPlants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === '전체' || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appTitle}>SPPKL</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="5,000개 이상의 식물 종을 검색하세요"
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryBtn,
              selectedCategory === cat && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Plant Grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          </View>
        ) : (
          <View style={styles.plantGrid}>
            {filtered.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={styles.plantCard}
                activeOpacity={0.85}
              >
                <View style={styles.imageWrap}>
                  <Image source={{ uri: plant.image }} style={styles.plantImage} />
                  {/* Heart */}
                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => toggleLike(plant.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={likedPlants.has(plant.id) ? 'heart' : 'heart-outline'}
                      size={18}
                      color={likedPlants.has(plant.id) ? Colors.error : Colors.textTertiary}
                    />
                  </TouchableOpacity>
                  {/* Difficulty Badge */}
                  <View
                    style={[
                      styles.diffBadge,
                      { backgroundColor: difficultyColors[plant.difficulty] },
                    ]}
                  >
                    <Text style={styles.diffBadgeText}>{plant.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName} numberOfLines={1}>
                    {plant.name}
                  </Text>
                  <Text style={styles.plantSci} numberOfLines={1}>
                    {plant.scientificName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  appBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  appTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.primary },
  searchWrap: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    shadowColor: Colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },
  categoryScroll: { flexGrow: 0 },
  categoryList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  categoryBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '500' },
  categoryTextActive: { color: Colors.white },
  grid: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: 100 },
  emptyState: { alignItems: 'center', paddingTop: 64, gap: Spacing.md },
  emptyText: { fontSize: FontSize.base, color: Colors.textTertiary },
  plantGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.lg },
  plantCard: {
    width: '47%',
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
  imageWrap: { position: 'relative' },
  plantImage: { width: '100%', aspectRatio: 1 },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  diffBadgeText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '600' },
  plantInfo: { padding: Spacing.md, gap: 2 },
  plantName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
  plantSci: { fontSize: 11, color: Colors.textTertiary },
});
