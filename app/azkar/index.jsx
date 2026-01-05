import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Import data
import afterSalahData from '../../Data/azkar_after_salah.json';
import masaaData from '../../Data/azkar_masaa.json';
import sabahData from '../../Data/azkar_sabah.json';
import sleepData from '../../Data/azkar_sleep.json';
import wakeData from '../../Data/azkar_wake.json';
import prayersData from '../../Data/prayers.json';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  {
    id: 'sabah',
    title: 'أذكار الصباح',
    icon: 'sunny',
    iconType: 'ionicon',
    color: '#FF9800',
    gradient: ['#FFB74D', '#FF9800'],
    data: sabahData,
  },
  {
    id: 'masaa',
    title: 'أذكار المساء',
    icon: 'moon',
    iconType: 'ionicon',
    color: '#7C4DFF',
    gradient: ['#B388FF', '#7C4DFF'],
    data: masaaData,
  },
  {
    id: 'sleep',
    title: 'أذكار النوم',
    icon: 'bed',
    iconType: 'material',
    color: '#3F51B5',
    gradient: ['#7986CB', '#3F51B5'],
    data: sleepData,
  },
  {
    id: 'wake',
    title: 'أذكار الاستيقاظ',
    icon: 'weather-sunset-up',
    iconType: 'material',
    color: '#00BCD4',
    gradient: ['#4DD0E1', '#00BCD4'],
    data: wakeData,
  },
  {
    id: 'salah',
    title: 'أذكار الصلاة',
    icon: 'hands-pray',
    iconType: 'material',
    color: '#4CAF50',
    gradient: ['#81C784', '#4CAF50'],
    data: afterSalahData,
  },
  {
    id: 'prayers',
    title: 'أدعية متنوعة',
    icon: 'book-open',
    iconType: 'feather',
    color: '#E91E63',
    gradient: ['#F48FB1', '#E91E63'],
    data: prayersData,
  },
];

export default function AzkarScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [completedItems, setCompletedItems] = useState({});
  const [showModal, setShowModal] = useState(false);

  const toggleComplete = (categoryId, itemId) => {
    setCompletedItems(prev => {
      const categoryCompleted = prev[categoryId] || [];
      if (categoryCompleted.includes(itemId)) {
        return {
          ...prev,
          [categoryId]: categoryCompleted.filter(id => id !== itemId),
        };
      } else {
        return {
          ...prev,
          [categoryId]: [...categoryCompleted, itemId],
        };
      }
    });
  };

  const isCompleted = (categoryId, itemId) => {
    return (completedItems[categoryId] || []).includes(itemId);
  };

  const getProgress = (category) => {
    const completed = (completedItems[category.id] || []).length;
    const total = category.data.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const openCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const renderIcon = (category, size = 32, color = '#fff') => {
    switch (category.iconType) {
      case 'ionicon':
        return <Ionicons name={category.icon} size={size} color={color} />;
      case 'material':
        return <MaterialCommunityIcons name={category.icon} size={size} color={color} />;
      case 'feather':
        return <Feather name={category.icon} size={size} color={color} />;
      default:
        return <Ionicons name="book" size={size} color={color} />;
    }
  };

  const CategoryCard = ({ category }) => {
    const progress = getProgress(category);
    
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => openCategory(category)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={category.gradient}
          style={styles.categoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.categoryIconContainer}>
            {renderIcon(category, 32, '#fff')}
          </View>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryCount}>{category.data.length} ذكر</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress.percentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progress.completed}/{progress.total}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#016A70', '#A2C579']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الأذكار والأدعية</Text>
        <Text style={styles.headerSubtitle}>اختر من الأذكار أدناه</Text>
      </View>

      {/* Categories Grid */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Azkar Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCategory && (
              <>
                {/* Modal Header */}
                <LinearGradient
                  colors={selectedCategory.gradient}
                  style={styles.modalHeader}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.modalHeaderContent}>
                    {renderIcon(selectedCategory, 28, '#fff')}
                    <Text style={styles.modalTitle}>{selectedCategory.title}</Text>
                  </View>
                  <View style={styles.modalProgress}>
                    <Text style={styles.modalProgressText}>
                      {getProgress(selectedCategory).completed}/{getProgress(selectedCategory).total}
                    </Text>
                  </View>
                </LinearGradient>

                {/* Azkar List */}
                <ScrollView 
                  style={styles.azkarList}
                  showsVerticalScrollIndicator={false}
                >
                  {selectedCategory.data.map((item, index) => {
                    const completed = isCompleted(selectedCategory.id, item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.zekrCard,
                          completed && styles.zekrCardCompleted,
                        ]}
                        onPress={() => toggleComplete(selectedCategory.id, item.id)}
                        activeOpacity={0.8}
                      >
                        {/* Number Badge */}
                        <View style={[
                          styles.numberBadge,
                          { backgroundColor: selectedCategory.color }
                        ]}>
                          <Text style={styles.numberText}>{index + 1}</Text>
                        </View>

                        {/* Zekr Content */}
                        <Text style={[
                          styles.zekrText,
                          completed && styles.zekrTextCompleted,
                        ]}>
                          {item.zekr}
                        </Text>

                        {/* Description if exists */}
                        {item.description && item.description.length > 0 && (
                          <Text style={styles.zekrDescription}>
                            📖 {item.description}
                          </Text>
                        )}

                        {/* Footer */}
                        <View style={styles.zekrFooter}>
                          <View style={styles.countBadge}>
                            <Text style={styles.countText}>
                              🔄 {item.count || 1} {item.count > 1 ? 'مرات' : 'مرة'}
                            </Text>
                          </View>
                          {item.reference && (
                            <Text style={styles.referenceText}>
                              📚 {item.reference}
                            </Text>
                          )}
                          {completed && (
                            <View style={styles.completedBadge}>
                              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                              <Text style={styles.completedText}>تم</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  <View style={{ height: 30 }} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 45) / 2,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryGradient: {
    padding: 20,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    marginTop: 12,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#fff',
    marginTop: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 20,
  },
  closeButton: {
    padding: 5,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalProgress: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  modalProgressText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  azkarList: {
    flex: 1,
    padding: 15,
  },
  zekrCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  zekrCardCompleted: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  numberBadge: {
    position: 'absolute',
    top: -8,
    right: 15,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  zekrText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#333',
    textAlign: 'right',
    marginTop: 10,
  },
  zekrTextCompleted: {
    color: '#2E7D32',
  },
  zekrDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'right',
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    lineHeight: 22,
  },
  zekrFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexWrap: 'wrap',
    gap: 8,
  },
  countBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    color: '#1976D2',
  },
  referenceText: {
    fontSize: 11,
    color: '#888',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
  },
});