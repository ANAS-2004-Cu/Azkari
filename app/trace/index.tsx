import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const STORAGE_KEY = 'tracking_data';

const DAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const TRACKING_ITEMS = [
  { id: 'fajr', name: 'صلاة الفجر', icon: 'time-outline', color: '#00BCD4' },
  { id: 'sabah', name: 'أذكار الصباح', icon: 'sunny', color: '#FF9800' },
  { id: 'dhuhr', name: 'صلاة الظهر', icon: 'sunny-outline', color: '#FFC107' },
  { id: 'asr', name: 'صلاة العصر', icon: 'partly-sunny', color: '#FF5722' },
  { id: 'masaa', name: 'أذكار المساء', icon: 'moon', color: '#7C4DFF' },
  { id: 'maghrib', name: 'صلاة المغرب', icon: 'cloudy-night', color: '#9C27B0' },
  { id: 'isha', name: 'صلاة العشاء', icon: 'moon-outline', color: '#3F51B5' },
  { id: 'quran', name: 'قراءة القرآن', icon: 'book', color: '#4CAF50' },
  { id: 'azkar', name: ' اذكار النوم', icon: 'book', color: '#4CAF50' },
];

export default function TraceScreen() {
  const [trackingData, setTrackingData] = useState({});
  const [currentWeek, setCurrentWeek] = useState([]);

  useEffect(() => {
    loadData();
    generateWeek();
  }, []);

  useEffect(() => {
    saveData();
  }, [trackingData]);

  const generateWeek = () => {
    const today = new Date();
    const week = [];
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push({
        date: date.toISOString().split('T')[0],
        dayName: DAYS_AR[date.getDay()],
        dayNumber: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    setCurrentWeek(week);
  };

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTrackingData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
    } catch (error) {
      console.error('Error saving tracking data:', error);
    }
  };

  const toggleItem = (date, itemId) => {
    setTrackingData(prev => {
      const dateData = prev[date] || [];
      if (dateData.includes(itemId)) {
        return { ...prev, [date]: dateData.filter(id => id !== itemId) };
      } else {
        return { ...prev, [date]: [...dateData, itemId] };
      }
    });
  };

  const isChecked = (date, itemId) => {
    return (trackingData[date] || []).includes(itemId);
  };

  const getTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const completed = (trackingData[today] || []).length;
    return {
      completed,
      total: TRACKING_ITEMS.length,
      percentage: Math.round((completed / TRACKING_ITEMS.length) * 100),
    };
  };

  const getWeekProgress = () => {
    let totalChecked = 0;
    currentWeek.forEach(day => {
      totalChecked += (trackingData[day.date] || []).length;
    });
    const totalPossible = TRACKING_ITEMS.length * 7;
    return {
      completed: totalChecked,
      total: totalPossible,
      percentage: Math.round((totalChecked / totalPossible) * 100),
    };
  };

  const getStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayCompleted = (trackingData[dateStr] || []).length;
      if (dayCompleted > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const progress = getTodayProgress();
  const weekProgress = getWeekProgress();
  const streak = getStreak();

  const CircularProgress = ({ percentage, size, strokeWidth, color }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
    );
  };

  return (
    <LinearGradient
      colors={['#016A70', '#A2C579']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>التتبع اليومي</Text>
          <Text style={styles.headerSubtitle}>تتبع عباداتك وأذكارك</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Today's Progress */}
          <View style={styles.statCard}>
            <View style={styles.circularContainer}>
              <CircularProgress
                percentage={progress.percentage}
                size={80}
                strokeWidth={8}
                color="#fff"
              />
              <Text style={styles.circularText}>{progress.percentage}%</Text>
            </View>
            <Text style={styles.statLabel}>اليوم</Text>
            <Text style={styles.statValue}>{progress.completed}/{progress.total}</Text>
          </View>

          {/* Streak */}
          <View style={[styles.statCard, { backgroundColor: '#FFB74D' }]}>
            <Ionicons name="flame" size={40} color="#fff" />
            <Text style={styles.statLabel}>سلسلة</Text>
            <Text style={styles.statValue}>{streak} يوم</Text>
          </View>

          {/* Week Progress */}
          <View style={[styles.statCard, { backgroundColor: '#81C784' }]}>
            <Ionicons name="calendar" size={40} color="#fff" />
            <Text style={styles.statLabel}>الأسبوع</Text>
            <Text style={styles.statValue}>{weekProgress.percentage}%</Text>
          </View>
        </View>

        {/* Week View */}
        <View style={styles.weekContainer}>
          <Text style={styles.sectionTitle}>هذا الأسبوع</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekDays}
          >
            {currentWeek.map((day) => {
              const dayCompleted = (trackingData[day.date] || []).length;
              const dayPercentage = Math.round((dayCompleted / TRACKING_ITEMS.length) * 100);
              
              return (
                <View 
                  key={day.date}
                  style={[
                    styles.dayCard,
                    day.isToday && styles.todayCard,
                  ]}
                >
                  <Text style={[
                    styles.dayName,
                    day.isToday && styles.todayText,
                  ]}>
                    {day.dayName}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    day.isToday && styles.todayText,
                  ]}>
                    {day.dayNumber}
                  </Text>
                  <View style={styles.miniProgress}>
                    <View 
                      style={[
                        styles.miniProgressFill,
                        { height: `${dayPercentage}%` },
                      ]} 
                    />
                  </View>
                  <Text style={styles.dayPercent}>{dayPercentage}%</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Today's Tasks */}
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>مهام اليوم</Text>
          {TRACKING_ITEMS.map((item) => {
            const today = new Date().toISOString().split('T')[0];
            const checked = isChecked(today, item.id);
            
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.taskCard,
                  checked && styles.taskCardChecked,
                ]}
                onPress={() => toggleItem(today, item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.taskIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={20} color="#fff" />
                </View>
                <Text style={[
                  styles.taskName,
                  checked && styles.taskNameChecked,
                ]}>
                  {item.name}
                </Text>
                <View style={[
                  styles.checkbox,
                  checked && { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
                ]}>
                  {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 50) / 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    marginBottom: 15,
  },
  weekDays: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  dayCard: {
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  todayCard: {
    backgroundColor: '#fff',
  },
  dayName: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  todayText: {
    color: '#016A70',
  },
  miniProgress: {
    width: 8,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  miniProgressFill: {
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  dayPercent: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  tasksContainer: {
    paddingHorizontal: 15,
  },
  taskCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  taskCardChecked: {
    backgroundColor: '#E8F5E9',
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    marginRight: 12,
  },
  taskNameChecked: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
});