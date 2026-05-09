import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { ChevronLeft, Heart, Droplets, Sun, Thermometer, CloudRain, Plus, SquarePen } from 'lucide-react-native';
const { width } = Dimensions.get('window');
const data: Record<string,any> = {
  e1:{ name:'몬스테라 델리시오사', scientificName:'Monstera Deliciosa', image:'https://images.unsplash.com/photo-1608327624934-69f40c5a819b?w=800', difficulty:'보통', description:'매력적인 구멍이 뚫린 커다란 잎이 특징인 열대 관엽식물입니다. 실내 환경에 잘 적응하며 공기 정화 능력이 뛰어납니다.', care:{ water:'겉흙이 말랐을 때 듬뿍', light:'반그늘에서 잘 자라요', temperature:'18–25°C (최저 15°C)', humidity:'60% 이상 (다습)' } },
};
const CareCard = ({ icon, label, value }:any) => (
  <View style={s.careCard}><View style={s.careIcon}>{icon}</View><Text style={s.careLabel}>{label}</Text><Text style={s.careValue}>{value}</Text></View>
);
export function EncyclopediaDetail({ onNavigate, plantId }:{ onNavigate:(s:string,id?:string)=>void; plantId:string|null }) {
  const plant = (plantId && data[plantId]) || data.e1;
  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
      <View style={s.floatingHeader}>
        <TouchableOpacity style={s.headerBtn} onPress={()=>onNavigate('encyclopedia')}><ChevronLeft color="#111827" size={24}/></TouchableOpacity>
        <TouchableOpacity style={s.headerBtn}><Heart color="#EF4444" size={24}/></TouchableOpacity>
      </View>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <View style={s.imageContainer}><Image source={{ uri:plant.image }} style={s.heroImage}/></View>
        <View style={s.sheet}>
          <View style={s.titleRow}>
            <View style={{flex:1,paddingRight:16}}>
              <Text style={s.plantName}>{plant.name}</Text>
              <Text style={s.scientificName}>{plant.scientificName}</Text>
            </View>
            <View style={s.diffBadge}><Text style={s.diffText}>{plant.difficulty}</Text></View>
          </View>
          <Text style={s.desc}>{plant.description}</Text>
          <View style={s.section}>
            <Text style={s.sectionTitle}>관리 가이드</Text>
            <View style={s.careGrid}>
              <CareCard icon={<Droplets color="#3B82F6" size={20}/>} label="물주기" value={plant.care.water}/>
              <CareCard icon={<Sun color="#F59E0B" size={20}/>} label="일조량" value={plant.care.light}/>
              <CareCard icon={<Thermometer color="#EF4444" size={20}/>} label="적정 온도" value={plant.care.temperature}/>
              <CareCard icon={<CloudRain color="#0EA5E9" size={20}/>} label="적정 습도" value={plant.care.humidity}/>
            </View>
          </View>
          <View style={s.actionContainer}>
            <TouchableOpacity style={s.primaryBtn} onPress={()=>onNavigate('add-plant')}>
              <Plus color="#ffffff" size={20}/><Text style={s.primaryBtnText}>내 식물로 등록하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={()=>onNavigate('diary-write')}>
              <SquarePen color="#3a7d44" size={18}/><Text style={s.secondaryBtnText}>성장 기록 쓰기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#ffffff' },
  floatingHeader:{ position:'absolute', top:Platform.OS==='android'?StatusBar.currentHeight!+10:50, left:0, right:0, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:16, zIndex:10 },
  headerBtn:{ width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,255,255,0.9)', alignItems:'center', justifyContent:'center', elevation:3 },
  scrollContent:{ flexGrow:1, paddingBottom:40 },
  imageContainer:{ width, height:width*1.1 },
  heroImage:{ width:'100%', height:'100%', resizeMode:'cover' },
  sheet:{ marginTop:-40, backgroundColor:'#ffffff', borderTopLeftRadius:32, borderTopRightRadius:32, paddingHorizontal:24, paddingTop:32 },
  titleRow:{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 },
  plantName:{ fontSize:26, fontWeight:'800', color:'#111827', marginBottom:4 },
  scientificName:{ fontSize:14, color:'#6B7280', fontStyle:'italic' },
  diffBadge:{ backgroundColor:'#F0FDF4', paddingHorizontal:12, paddingVertical:6, borderRadius:12, borderWidth:1, borderColor:'#BBF7D0' },
  diffText:{ fontSize:13, fontWeight:'700', color:'#16A34A' },
  desc:{ fontSize:15, lineHeight:24, color:'#4B5563', marginBottom:32 },
  section:{ marginBottom:32 }, sectionTitle:{ fontSize:18, fontWeight:'700', color:'#111827', marginBottom:16 },
  careGrid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', gap:12 },
  careCard:{ width:(width-48-12)/2, backgroundColor:'#ffffff', borderRadius:20, padding:16, borderWidth:1, borderColor:'#F3F4F6', elevation:1, marginBottom:12 },
  careIcon:{ width:40, height:40, borderRadius:20, backgroundColor:'#F9FAFB', alignItems:'center', justifyContent:'center', marginBottom:12 },
  careLabel:{ fontSize:12, color:'#9CA3AF', marginBottom:4, fontWeight:'500' },
  careValue:{ fontSize:14, fontWeight:'600', color:'#374151', lineHeight:20 },
  actionContainer:{ gap:12, marginTop:8 },
  primaryBtn:{ flexDirection:'row', backgroundColor:'#3a7d44', height:56, borderRadius:16, alignItems:'center', justifyContent:'center', gap:8 },
  primaryBtnText:{ color:'#ffffff', fontSize:16, fontWeight:'700' },
  secondaryBtn:{ flexDirection:'row', backgroundColor:'#f5f5f0', borderWidth:1, borderColor:'rgba(58,125,68,0.3)', height:56, borderRadius:16, alignItems:'center', justifyContent:'center', gap:8 },
  secondaryBtnText:{ color:'#3a7d44', fontSize:16, fontWeight:'700' },
});
