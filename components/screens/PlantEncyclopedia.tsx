import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;
const CATEGORIES = ['전체','초보자용','다육식물','관엽식물','꽃/열매','공기정화'];
const DATA = [
  { id:'e1', name:'몬스테라',   species:'Monstera Deliciosa', difficulty:'쉬움', image:'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400' },
  { id:'e2', name:'산세베리아', species:'Sansevieria',        difficulty:'매우 쉬움', image:'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400' },
  { id:'e3', name:'알로카시아', species:'Alocasia',           difficulty:'보통', image:'https://images.unsplash.com/photo-1620127027376-7bcbc170d10d?w=400' },
  { id:'e4', name:'필로덴드론', species:'Philodendron',       difficulty:'쉬움', image:'https://images.unsplash.com/photo-1604762512526-b7ce049b576e?w=400' },
];
export function PlantEncyclopedia({ navigation }: { navigation: any }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('전체');
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
      <View style={s.appBar}><Text style={s.title}>식물도감</Text></View>
      <View style={s.searchSection}>
        <View style={s.searchBar}>
          <Search color="#9CA3AF" size={20}/>
          <TextInput style={s.searchInput} placeholder="식물 이름이나 학명 검색" placeholderTextColor="#9CA3AF" value={q} onChangeText={setQ}/>
        </View>
        <TouchableOpacity style={s.filterBtn}><SlidersHorizontal color="#374151" size={20}/></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catsScroll} style={{ maxHeight: 60 }}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[s.catBadge, cat===c && s.catActive]} onPress={() => setCat(c)}>
            <Text style={[s.catText, cat===c && s.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={s.gridContent}>
        <View style={s.grid}>
          {DATA.filter(p => !q || p.name.includes(q)).map(plant => (
            <TouchableOpacity key={plant.id} style={s.card} onPress={() => navigation.navigate('encyclopedia-detail', { plantId: plant.id })}>
              <Image source={{ uri: plant.image }} style={s.cardImage}/>
              <View style={s.cardInfo}>
                <Text style={s.plantName}>{plant.name}</Text>
                <Text style={s.plantSpecies}>{plant.species}</Text>
                <View style={s.tag}><Text style={s.tagText}>{plant.difficulty}</Text></View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe:{ flex:1, backgroundColor:'#ffffff', paddingTop: Platform.OS==='android'?StatusBar.currentHeight:0 },
  appBar:{ paddingHorizontal:16, paddingVertical:16, backgroundColor:'#ffffff', borderBottomWidth:1, borderBottomColor:'#E5E7EB' },
  title:{ fontSize:20, fontWeight:'700', color:'#3a7d44' },
  searchSection:{ flexDirection:'row', paddingHorizontal:16, paddingVertical:12, gap:12, backgroundColor:'#ffffff' },
  searchBar:{ flex:1, flexDirection:'row', alignItems:'center', backgroundColor:'#F3F4F6', borderRadius:12, paddingHorizontal:12, height:44 },
  searchInput:{ flex:1, marginLeft:8, fontSize:15, color:'#111827' },
  filterBtn:{ width:44, height:44, backgroundColor:'#F3F4F6', borderRadius:12, alignItems:'center', justifyContent:'center' },
  catsScroll:{ paddingHorizontal:16, gap:8, paddingVertical:8 },
  catBadge:{ paddingHorizontal:16, paddingVertical:8, borderRadius:20, backgroundColor:'#F3F4F6', borderWidth:1, borderColor:'transparent', marginRight:8 },
  catActive:{ backgroundColor:'#E8F5E9', borderColor:'#7CCB8A' },
  catText:{ fontSize:14, fontWeight:'500', color:'#6B7280' },
  catTextActive:{ color:'#2E7D32', fontWeight:'600' },
  gridContent:{ padding:16, paddingBottom:100 },
  grid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between' },
  card:{ width:cardWidth, backgroundColor:'#ffffff', borderRadius:16, marginBottom:16, overflow:'hidden', borderWidth:1, borderColor:'#E5E7EB', elevation:2 },
  cardImage:{ width:'100%', height:cardWidth, backgroundColor:'#F3F4F6' },
  cardInfo:{ padding:12 },
  plantName:{ fontSize:16, fontWeight:'700', color:'#111827' },
  plantSpecies:{ fontSize:12, color:'#6B7280', marginTop:2, fontStyle:'italic' },
  tag:{ alignSelf:'flex-start', backgroundColor:'#F3F4F6', paddingHorizontal:8, paddingVertical:4, borderRadius:6, marginTop:8 },
  tagText:{ fontSize:11, fontWeight:'600', color:'#4B5563' },
});
