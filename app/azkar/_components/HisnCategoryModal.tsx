import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import AzkarHeader from './AzkarHeader';
import FocusMode from './FocusMode';

interface AzkarItem {
    id: string;
    zekr: string;
    description: string;
    count: number | string;
    reference: string;
}

interface HisnSection {
    id: string;
    title: string;
    data: AzkarItem[];
}

interface HisnCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  category: any;
  hisnSections: HisnSection[];
  categoryProgress: Record<string, number>;
  onUpdateProgress: (id: string, count: number) => void;
  onResetSection: () => void;
  initialState?: any;
  onConsumeInitialState?: () => void;
}

export default function HisnCategoryModal({
  visible,
  onClose,
  category,
  hisnSections,
  categoryProgress,
  onUpdateProgress,
  onResetSection,
  initialState,
  onConsumeInitialState
}: HisnCategoryModalProps) {
  const [selectedSection, setSelectedSection] = useState<HisnSection | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [initialStartIndex, setInitialStartIndex] = useState(0);

  useEffect(() => {
    if (initialState && visible && !showFocusMode) {
        const section = hisnSections.find((s: HisnSection) => s.id === initialState.sectionId);
        if (section) {
            setSelectedSection(section);
            setInitialStartIndex(initialState.index);
            setShowFocusMode(true);
            if (onConsumeInitialState) onConsumeInitialState();
        }
    }
  }, [initialState, visible, hisnSections, showFocusMode, onConsumeInitialState]);

  const openSection = useCallback((section: HisnSection) => {
    setSelectedSection(section);
    setInitialStartIndex(0);
    setShowFocusMode(true);
  }, []);

  const closeSection = useCallback(() => {
    setShowFocusMode(false);
    setSelectedSection(null);
  }, []);

  const getSectionProgress = (section: HisnSection) => {
    const sectionProgress = categoryProgress || {};
    let completedCount = 0;
    
    section.data.forEach((item: AzkarItem) => {
      const target = item.count ? (typeof item.count === 'string' ? parseInt(item.count) : item.count) : 1;
      const current = sectionProgress[item.id] || 0;
      if (current >= target) completedCount++;
    });

    return {
      completed: completedCount,
      total: section.data.length,
      percentage: section.data.length > 0 ? (completedCount / section.data.length) * 100 : 0
    };
  };

  const renderSectionItem = ({ item }: { item: HisnSection }) => {
    const progress = getSectionProgress(item);
    const isCompleted = progress.completed === progress.total && progress.total > 0;

    return (
      <TouchableOpacity
        style={styles.sectionItemContainer}
        onPress={() => openSection(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
            colors={isCompleted ? ['rgba(76, 175, 80, 0.3)', 'rgba(76, 175, 80, 0.1)'] : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.sectionItemGlass}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'transparent']}
                style={styles.glossOverlay}
            />

            <View style={styles.rightContent}>
                <View style={styles.sectionIcon}>
                    <LinearGradient
                        colors={category.gradient}
                        style={styles.iconGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialCommunityIcons 
                        name={isCompleted ? "check" : "book-open-page-variant"} 
                        size={20} 
                        color="#fff" 
                        />
                    </LinearGradient>
                </View>
                <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionTitle}>{item.title}</Text>
                    {item.data.length > 0 && (
                        <Text style={styles.sectionSubtitle}>
                        {item.data.length} أذكار
                        </Text>
                    )}
                </View>
            </View>
            
            <View style={styles.leftContent}>
            {progress.total > 0 && (
                <View style={[styles.badge, isCompleted && styles.badgeCompleted]}>
                    <Text style={[styles.badgeText, isCompleted && styles.badgeTextCompleted]}>
                        {progress.completed}/{progress.total}
                    </Text>
                </View>
            )}
            <Ionicons 
                name="chevron-back" 
                size={20} 
                color="rgba(255,255,255,0.6)" 
                style={{ marginRight: 5 }}
            />
            </View>

            <View style={[styles.borderOverlay, isCompleted && { borderColor: 'rgba(76, 175, 80, 0.3)' }]} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (!category) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
            colors={['#016A70', '#A2C579']}
            style={styles.bgGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.7, y: 0.5 }}
        />

        <AzkarHeader 
            title={category.title}
            subtitle={`${hisnSections?.length || 0} أقسام`}
            leftAction={
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            }
        />

        <FlatList
          data={hisnSections}
          keyExtractor={(item) => item.id}
          renderItem={renderSectionItem}
          contentContainerStyle={[styles.listContent, { paddingTop: 100 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <FocusMode
        visible={showFocusMode}
        category={selectedSection}
        onClose={closeSection}
        categoryProgress={categoryProgress}
        onUpdateProgress={onUpdateProgress}
        onResetCategory={onResetSection}
        startIndex={initialStartIndex}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#016A70',
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionItemContainer: {
    borderRadius: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionItemGlass: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 80,
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    opacity: 0.5,
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  rightContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    marginLeft: 10,
    borderRadius: 22,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconGradient: {
    flex: 1,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sectionTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'right',
    marginBottom: 4,
    ...Platform.select({
      web: {
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      },
      ios: {
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
    }),
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  badgeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  badgeTextCompleted: {
    color: '#fff',
  },
  separator: {
    height: 12,
  },
});
