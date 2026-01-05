import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import asmaData from '../../Data/asma.json';
import sabahData from '../../Data/azkar_sabah.json';
import gratitudeData from '../../Data/gratitude.json';
import versesData from '../../Data/verses.json';

export default function App() {

  const [index, setIndex] = useState(0);
    const [verseIndex, setVerseIndex] = useState(0);
     const [gratitudeIndex, setGratitudeIndex] = useState(0);
       const [showMorningPage, setShowMorningPage] = useState(false);
  const [completed, setCompleted] = useState([]);
  const toggleComplete = (id) => {
    if (completed.includes(id)) {
      setCompleted(completed.filter((c) => c !== id));
    } else {
      setCompleted([...completed, id]);
    }
  };
  const handleNext = () => {
    setIndex((prev) => (prev + 1) % asmaData.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + asmaData.length) % asmaData.length);
  };

 

  const handleGratitudeNext = () => {
    setGratitudeIndex((prev) => (prev + 1) % gratitudeData.length);
  };

  const handleGratitudePrev = () => {
    setGratitudeIndex((prev) => (prev - 1 + gratitudeData.length) % gratitudeData.length);
  };



  const handleVerseNext = () => {
    setVerseIndex((prev) => (prev + 1) % versesData.length);
  };

  const handleVersePrev = () => {
    setVerseIndex((prev) => (prev - 1 + versesData.length) % versesData.length);
  };
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#016A70', '#A2C579']}

          start={{ x: 0, y: 0 }}
          end={{ x: 0.7, y: 0.5 }} style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity>
              <Feather name="settings" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>يومياً ١-٣</Text>
            </View>
          </View>

          <Text style={styles.rateLabel}>معدل ظهور الأذكار</Text>
          <Text style={styles.rateValue}>يومياً ١-٣</Text>

          <View style={styles.tabsRow}>
            <Tab label="نادر" active />
            <Tab label="متوسط" />
            <Tab label="شائع" />
            <Tab label="عالي" />
          </View>

          <View style={styles.cardLike}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={styles.helloIcon}>
                <Ionicons name="moon" size={18} color={COLORS.green} />
              </View>
              <View style={{ marginHorizontal: 12 }}>
                <Text style={styles.helloTitle}>مساء الخير</Text>
                <Text style={styles.helloSub}>اختم يومك بأذكار المساء</Text>
              </View>
            </View>

          </View>

          <View style={styles.noticeBox}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
              <View style={styles.alertIcon}><MaterialIcons name="error-outline" size={18} color="#fff" /></View>
              <Text style={styles.noticeText}>اضغط هنا لتفعيل ظهور الأذكار على الشاشة</Text>
            </View>
            <TouchableOpacity style={styles.noticeBtn}><Text style={styles.noticeBtnText}>تفعيل</Text></TouchableOpacity>
          </View>


          <View style={styles.quickRow}>
            <PillButton
              label="ورد الصباح"
              color={COLORS.orange}
              icon={<Ionicons name="sunny" size={16} color="#fff" />}
              onPress={() => setShowMorningPage(true)}
            />

            <Modal visible={showMorningPage} animationType="slide" transparent={true}>
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", }}>
                <View
                  style={{
                    height: "70%",
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    padding: 20,
                  }}>

                  <View style={{ flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: COLORS.orange }}>
                    <TouchableOpacity onPress={() => setShowMorningPage(false)}>
                      <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ color: "#fff", fontSize: 18, marginLeft: 10 }}>🌅 أذكار الصباح</Text>
                  </View>

                  <ScrollView style={{ padding: 20 }}>
                    {sabahData.map((item) => {
                      const isDone = completed.includes(item.id);
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => toggleComplete(item.id)}
                          activeOpacity={0.8}
                          style={{
                            marginBottom: 15,
                            padding: 15,
                            borderRadius: 12,
                            backgroundColor: isDone ? "#d4edda" : "#f5f5f5",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              textDecorationLine: isDone ? "line-through" : "none",
                              color: isDone ? "#155724" : "#000",
                              textAlign: 'right',
                              lineHeight: 26,
                            }}
                          >
                            {item.zekr}
                          </Text>
                          <Text
                            style={{
                              color: isDone ? "#155724" : "#888",
                              marginTop: 5,
                              textAlign: 'right',
                            }}
                          >
                            🔄 التكرار: {item.count} مرات
                          </Text>
                          {isDone && (
                            <Text style={{ marginTop: 5, color: "#155724", fontWeight: "bold" }}>
                              ✅ تم إنجازه
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </Modal>







            <PillButton label="ورد المساء" color={COLORS.purple} icon={<Ionicons name="moon" size={16} color="#fff" />} />

          </View>
        </LinearGradient>




        <Card style={{ padding: 18 }}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="menu" size={18} color="#9e9e9e" />
            <Text style={styles.cardHeaderText}>أسماء الله الحسنى</Text>
          </View>


          <Text style={styles.asmaWord}>{asmaData[index]?.name}</Text>
          <Text style={styles.asmaMeaning}>{asmaData[index]?.meaning}</Text>

          <View style={styles.cardFooterRow}>
            <CircleBtn onPress={handlePrev} left />
            <CircleBtn onPress={handleNext} />
          </View>
        </Card>


        <LinearGradient colors={["#3CB9FF", "#1FA2FF"]} style={[styles.fullCard, { height: 170 }]}>
          <Text style={styles.gratitudeTop}>أشكرُه يا ربي على نعمة</Text>
          <Text style={styles.gratitudeWord}>{gratitudeData[gratitudeIndex]}</Text>

          <View style={styles.cardFooterRow}>
            <CircleBtn onPress={handleGratitudePrev} left />
            <CircleBtn onPress={handleGratitudeNext} />
          </View>

        </LinearGradient>



        <LinearGradient colors={["#47E5BC", "#4AC1D0"]} style={[styles.fullCard, { height: 180 }]}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
              <Feather name="share-2" size={18} color="#fff" />
              <Text style={styles.verseShare}>بلغوا عني ولو آية</Text>
            </View>
            <View style={styles.quranIcon}>
              <Ionicons name="leaf" size={16} color={COLORS.green} />
            </View>
          </View>

          <Text style={styles.verseBody}>{versesData[verseIndex]}</Text>

          <View style={styles.cardFooterRow}>
            <CircleBtn onPress={handleVersePrev} left />
            <CircleBtn onPress={handleVerseNext} />
          </View>
        </LinearGradient>


        <View style={{ height: 90 }} />
      </ScrollView>


    </SafeAreaView>
  );
}


const Tab = ({ label, active }) => (
  <View style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </View>
);

const PillButton = ({ label, color, icon, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, { backgroundColor: color }]}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
      <Text style={styles.pillText}>{label}</Text>
      <View style={{ marginHorizontal: 6 }}>{icon}</View>
    </View>
  </TouchableOpacity>
);


const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const CircleBtn = ({ left, onPress }) => (
  <TouchableOpacity style={styles.circleBtn} onPress={onPress}>
    <AntDesign name={left ? 'left' : 'right'} size={16} color="#4f4f4f" />
  </TouchableOpacity>
);




const COLORS = {
  bg: '#f6f7fb',
  white: '#ffffff',
  text: '#222',
  sub: '#8e8e8e',
  greenLight: '#86E57F',
  green: '#46C266',
  orange: '#FFB74D',
  purple: '#7C6BF2',
  blue: '#4D8BFF',
  cyan: '#29C7D7',
  pink: '#FF7FB2',
  shadow: 'rgba(0,0,0,0.08)'
};


const styles = StyleSheet.create({
  safe: { 
    flex: 1,
    backgroundColor: COLORS.bg 
  },

  scroll: { 
    paddingBottom: 24 
  },

  headerCard: { 
    paddingTop: 8, 
    paddingBottom: 18, 
    paddingHorizontal: 16, 
    borderBottomLeftRadius: 22, 
    borderBottomRightRadius: 22 
  },

  headerTopRow: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },

  badge: { 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 999 
  },

  badgeText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '600' 
  },

  rateLabel: { 
    color: '#fff', 
    fontSize: 14, 
    opacity: 0.95, 
    marginTop: 8 
  },

  rateValue: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700', 
    marginTop: 2 
  },

  tabsRow: { 
    flexDirection: 'row-reverse', 
    marginTop: 10 
  },

  tab: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 16, 
    marginLeft: 8, 
    backgroundColor: 'rgba(255,255,255,0.3)' 
  },

  tabActive: { 
    backgroundColor: '#fff' 
  },

  tabText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '600' 
  },

  tabTextActive: { 
    color: COLORS.green 
  },

  cardLike: { 
    marginTop: 12, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    elevation: 3 
  },

  helloIcon: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  helloTitle: { 
    fontSize: 18, 
    color: COLORS.green, 
    fontWeight: '800' 
  },

  helloSub: { 
    fontSize: 12, 
    color: '#888' 
  },

  fabSm: { 
    position: 'absolute', 
    left: 8, 
    top: '50%', 
    marginTop: -16, 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    elevation: 2 
  },

  noticeBox: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    padding: 12, 
    marginTop: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    elevation: 2 
  },

  noticeText: { 
    color: '#666', 
    fontSize: 12 
  },

  noticeBtn: { 
    backgroundColor: COLORS.orange, 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 12 
  },

  noticeBtnText: { 
    color: '#fff', 
    fontWeight: '700' 
  },

  alertIcon: { 
    width: 24, 
    height: 24, 
    backgroundColor: '#F66', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 8 
  },

  quickRow: { 
    flexDirection: 'row-reverse', 
    flexWrap: 'wrap', 
    marginTop: 12 
  },

  pill: { 
    borderRadius: 16, 
    paddingVertical: 10, 
    paddingHorizontal: 14, 
    marginLeft: 8, 
    marginBottom: 8 
  },

  pillText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 12 
  },

  widget: { 
    marginTop: 12, 
    marginHorizontal: 16, 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    padding: 14, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 10, 
    elevation: 3 
  },

  widgetHeaderRow: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },

  widgetTitle: { 
    fontWeight: '800', 
    fontSize: 14, 
    color: '#5f5f5f' 
  },

  tasbeehRingWrap: { 
    marginTop: 8, 
    alignItems: 'center' 
  },

  tasbeehRingOuter: { 
    width: 160, 
    height: 160, 
    borderRadius: 80, 
    borderWidth: 10, 
    borderColor: '#eee', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  tasbeehRingInner: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#fafafa', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 6, 
    borderColor: '#f1f1f1' 
  },

  tasbeehMain: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#d06090' 
  },

  tasbeehButtons: { 
    flexDirection: 'row-reverse', 
    marginTop: 12 
  },

  smallChip: { 
    backgroundColor: '#f3f3f6', 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 12, 
    marginLeft: 8 
  },

  smallChipText: { 
    color: '#666', 
    fontWeight: '700', 
    fontSize: 12 
  },

  card: { 
    marginTop: 12, 
    marginHorizontal: 16, 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 10, 
    elevation: 3 
  },

  cardHeaderRow: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    paddingBottom: 6 
  },

  cardHeaderText: { 
    marginRight: 6, 
    color: '#8b8b8b', 
    fontWeight: '700', 
    fontSize: 14 
  },

  asmaWord: { 
    textAlign: 'center', 
    fontSize: 40, 
    color: '#5D84FF', 
    fontWeight: '900', 
    marginVertical: 5 
  },

  asmaMeaning: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },

  cardFooterRow: { 
    flexDirection: 'row-reverse', 
    justifyContent: 'center', 
    gap: 14, 
    marginTop: 6 
  },

  circleBtn: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#eee', 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    elevation: 2 
  },

  fullCard: { 
    marginTop: 12, 
    marginHorizontal: 16, 
    borderRadius: 20, 
    padding: 16, 
    position: 'relative', 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 10, 
    elevation: 3 
  },

  gratitudeTop: { 
    color: '#fff', 
    fontSize: 14, 
    opacity: 0.9 
  },

  gratitudeWord: { 
    color: '#FFEB3B', 
    fontWeight: '900', 
    fontSize: 44, 
    marginTop: 6 
  },

  fabLg: { 
    position: 'absolute', 
    left: 14, 
    bottom: 14, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  verseShare: { 
    color: '#fff', 
    marginRight: 8 
  },

  quranIcon: { 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  verseBody: { 
    color: '#fff', 
    fontSize: 16, 
    lineHeight: 28, 
    marginTop: 10 
  },

  bottomBar: { 
    position: 'absolute', 
    bottom: 8, 
    left: 12, 
    right: 12, 
    height: 60, 
    backgroundColor: '#fff', 
    borderRadius: 22, 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 8 
  },

  navItem: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  navText: { 
    fontSize: 10, 
    color: '#777', 
    marginTop: 2 
  },
});
