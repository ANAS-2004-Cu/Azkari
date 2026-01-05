import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Keyboard, ScrollView, StyleSheet, View } from 'react-native';

import afterSalahData from '../../Data/azkar_after_salah.json';
import masaaData from '../../Data/azkar_masaa.json';
import sabahData from '../../Data/azkar_sabah.json';
import sleepData from '../../Data/azkar_sleep.json';
import wakeData from '../../Data/azkar_wake.json';
import indexMap from '../../Data/hisn/index_map.json';

import { HISN_DATA_MAP } from '../../Data/hisn/hisnData';
import { HISN_CATEGORIES } from '../../Data/hisn_categories';

import AzkarHeader from './_components/AzkarHeader';
import AzkarSearchBar from './_components/AzkarSearchBar';
import FocusMode from './_components/FocusMode';
import HisnAzkarGrid from './_components/HisnAzkarGrid';
import HisnCategoryModal from './_components/HisnCategoryModal';
import QuickAzkarList from './_components/QuickAzkarList';
import SearchHistoryList from './_components/SearchHistoryList';
import SearchResultsList from './_components/SearchResultsList';
import { clearSearchHistory, deepSearchAzkar, getSearchHistory, removeSearchHistoryItem, saveSearchHistory } from './_utils/advancedSearch';

const PROGRESS_KEY = 'AZKARI_DAILY_PROGRESS_V2';

interface AzkarItem {
  id: string;
  zekr: string;
  description: string;
  count: number;
  reference: string;
  sectionTitle?: string;
  categoryId?: string;
}

interface HisnSection {
  id: string;
  title: string;
  data: AzkarItem[];
}

interface HisnState {
  sectionId: string;
  index: number;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  iconType: string;
  color: string;
  gradient: string[];
  data: AzkarItem[];
  isHisn?: boolean;
  sections?: HisnSection[];
  isAction?: boolean;
  isLink?: boolean;
  route?: string;
}

const DAILY_AZKAR_LIST: Category[] = [
  {
    id: 'sabah',
    title: 'أذكار الصباح',
    icon: 'sunny',
    iconType: 'ionicon',
    color: '#FF9800',
    gradient: ['#FFB74D', '#FF9800'],
    data: sabahData as any,
  },
  {
    id: 'masaa',
    title: 'أذكار المساء',
    icon: 'moon',
    iconType: 'ionicon',
    color: '#7C4DFF',
    gradient: ['#B388FF', '#7C4DFF'],
    data: masaaData as any,
  },
  {
    id: 'sleep',
    title: 'أذكار النوم',
    icon: 'bed',
    iconType: 'material',
    color: '#3F51B5',
    gradient: ['#7986CB', '#3F51B5'],
    data: sleepData as any,
  },
  {
    id: 'wake',
    title: 'أذكار الاستيقاظ',
    icon: 'weather-sunset-up',
    iconType: 'material',
    color: '#00BCD4',
    gradient: ['#4DD0E1', '#00BCD4'],
    data: wakeData as any,
  },
  {
    id: 'salah_basic',
    title: 'أذكار الصلاة',
    icon: 'hands-pray',
    iconType: 'material',
    color: '#4CAF50',
    gradient: ['#81C784', '#4CAF50'],
    data: afterSalahData as any,
  },
];

export default function AzkarScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [showHisnModal, setShowHisnModal] = useState(false);
  const [progress, setProgress] = useState<Record<string, Record<string, number>>>({});
  const [startIndex, setStartIndex] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [initialHisnState, setInitialHisnState] = useState<HisnState | null>(null);

  const loadHistory = useCallback(async () => {
    const h = await getSearchHistory();
    setSearchHistory(h);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const processedDailyAzkar = useMemo(() => {
    return DAILY_AZKAR_LIST.map(cat => ({
      ...cat,
      data: cat.data.map((item, idx) => ({
        ...item,
        id: `${cat.id}_${item.id || idx}`
      }))
    }));
  }, []);

  const processedHisnCategories = useMemo(() => {
    return HISN_CATEGORIES.map(cat => {
        const sections = cat.hisnIds.map(id => {
            const info = indexMap.find(m => m.id === id);
            const data = (HISN_DATA_MAP as Record<string, any[]>)[id] || [];
            const dataWithUniqueIds = data.map((item: any, idx: number) => ({ 
                ...item, 
                id: `${id}_${item.id || idx}`,
                sectionTitle: info ? info.title : undefined,
                categoryId: id
            }));
            
            return {
                id: id,
                title: info ? info.title : "ذكر",
                data: dataWithUniqueIds
            };
        });

        const allData = sections.flatMap(s => s.data);

        return {
            ...cat,
            data: allData,
            sections: sections,
            isHisn: true
        };
    });
  }, []);

  const allCategories = useMemo(() => {
    return [...processedDailyAzkar, ...processedHisnCategories];
  }, [processedDailyAzkar, processedHisnCategories]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    return deepSearchAzkar(searchQuery, allCategories);
  }, [searchQuery, allCategories]);

  const quickAccessList = useMemo(() => {
    const orderedIds = ['wake', 'sabah', 'salah_basic', 'masaa', 'sleep'];
    const list = orderedIds.map(id => processedDailyAzkar.find(c => c.id === id)).filter(Boolean);
    
    list.push({
      id: 'favorites',
      title: 'المفضلة',
      icon: 'heart',
      iconType: 'ionicon',
      color: '#E91E63',
      gradient: ['#F48FB1', '#E91E63'],
      data: [],
      isAction: true
    });
    
    return list;
  }, [processedDailyAzkar]);

  const getTodayDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const saveToStorage = useCallback(async (dataToSave: Record<string, Record<string, number>>) => {
    try {
      const payload = {
        date: getTodayDate(),
        data: dataToSave
      };
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
      } catch (_error) {
        console.error('Error saving progress:', _error);
      }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(PROGRESS_KEY);
        if (stored) {
          const { date, data } = JSON.parse(stored);
          if (date === getTodayDate()) {
            setProgress(data);
          } else {
            setProgress({});
          }
        }
      } catch (_error) {
        console.error('Error loading progress:', _error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      saveToStorage(progress);
    }
  }, [progress, saveToStorage]);

  const handleUpdateProgress = useCallback((itemId: string, newCount: number) => {
    if (!selectedCategory) return;
    
    const catId = selectedCategory.id;
    
    setProgress(prev => ({
        ...prev,
        [catId]: {
            ...(prev[catId] || {}),
            [itemId]: newCount
        }
    }));
  }, [selectedCategory]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return;
    
    const timer = setTimeout(() => {
      saveSearchHistory(searchQuery);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResetCategory = useCallback(() => {
    if (!selectedCategory) return;
    const catId = selectedCategory.id;
    setProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[catId];
        return newProgress;
    });
  }, [selectedCategory]);

  const openFavorites = useCallback(async (categoryBase: Category) => {
     try {
         const storedFavs = await AsyncStorage.getItem('AZKARI_FAVORITES_V1');
         if (!storedFavs) {
            setSelectedCategory({ ...categoryBase, data: [] });
            setShowFocusModal(true);
            return;
         }
         
         const favIds = JSON.parse(storedFavs);
         const foundAzkar: AzkarItem[] = [];

         const searchData = (dataset: AzkarItem[]) => {
             dataset.forEach(d => {
                 if (favIds.includes(d.id)) foundAzkar.push(d);
             });
         };

         processedDailyAzkar.forEach(cat => searchData(cat.data));
         
         processedHisnCategories.forEach(cat => searchData(cat.data));

         setSelectedCategory({ 
             ...categoryBase, 
             title: 'المفضلة',
             data: foundAzkar 
         });
         setShowFocusModal(true);

     } catch (e) {
         console.error("Error loading favorites", e);
     }
  }, [processedDailyAzkar, processedHisnCategories]);

  const openCategory = useCallback((category: Category, initialIndex = -1) => {
    if (category.isLink && category.route) {
        router.push(category.route as any);
        return;
    }

    if (category.id === 'favorites') {
        openFavorites(category);
        return;
    }
    
    if (isSearchActive && searchQuery) {
        saveSearchHistory(searchQuery);
        loadHistory();
    }

    setSelectedCategory(category);
    
    if (category.isHisn) {
        if (initialIndex >= 0 && category.data && category.data[initialIndex]) {
             const targetItem = category.data[initialIndex];
             const section = category.sections?.find(s => s.id === targetItem.categoryId);
             if (section) {
                 const indexInSection = section.data.findIndex(i => i.id === targetItem.id);
              setInitialHisnState({
                  sectionId: section.id,
                  index: indexInSection >= 0 ? indexInSection : 0
              });
             } else {
                 setInitialHisnState(null);
             }
        } else {
            setInitialHisnState(null);
        }
        setShowHisnModal(true);
    } else {
        setStartIndex(initialIndex >= 0 ? initialIndex : 0);
        setShowFocusModal(true);
    }
  }, [router, openFavorites, isSearchActive, searchQuery, loadHistory]);

  const closeCategory = useCallback(() => {
    setShowFocusModal(false);
    setShowHisnModal(false);
    setSelectedCategory(null);
    setStartIndex(0);
    setInitialHisnState(null);
  }, []);

  const handleConsumeInitialState = useCallback(() => {
      setInitialHisnState(null);
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (showFocusModal || showHisnModal) {
          return false;
      }

      if (isSearchActive) {
        setIsSearchActive(false);
        setSearchQuery('');
        Keyboard.dismiss();
        return true; 
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isSearchActive, showFocusModal, showHisnModal]);

  const handleCancelSearch = useCallback(() => {
      setIsSearchActive(false);
      setSearchQuery('');
      Keyboard.dismiss();
  }, []);

  const handleHistorySelect = useCallback((query: string) => {
      setSearchQuery(query);
  }, []);

  const handleRemoveHistory = useCallback(async (query: string) => {
      await removeSearchHistoryItem(query);
      await loadHistory();
  }, [loadHistory]);

  const handleClearHistory = useCallback(async () => {
      setSearchHistory([]);
      await clearSearchHistory();
      await loadHistory();
  }, [loadHistory]);

  return (
    <LinearGradient
      colors={['#016A70', '#A2C579']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.5 }}
    >
      <AzkarHeader />

      <View style={styles.contentContainer}>
          <AzkarSearchBar 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
            onClear={() => setSearchQuery('')}
            onFocus={() => {
                setIsSearchActive(true);
                loadHistory();
            }}
            onBlur={() => {}}
            onCancel={handleCancelSearch}
            isActive={isSearchActive}
          />

          {isSearchActive ? (
                <View style={styles.searchContainer}>
                     {searchQuery && searchQuery.length >= 2 ? (
                        <ScrollView 
                            contentContainerStyle={styles.scrollContentSearch}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <SearchResultsList 
                                results={searchResults}
                                onPress={openCategory}
                                searchQuery={searchQuery}
                            />
                            <View style={{ height: 100 }} />
                        </ScrollView>
                     ) : (
                        <SearchHistoryList 
                            history={searchHistory}
                            onSelect={handleHistorySelect}
                            onRemove={handleRemoveHistory}
                            onClear={handleClearHistory}
                        />
                     )}
                </View>
          ) : (
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <QuickAzkarList 
                    categories={quickAccessList}
                    onPress={openCategory}
                    progress={progress}
                />
                
                <HisnAzkarGrid 
                    categories={processedHisnCategories}
                    onPress={openCategory}
                    progress={progress}
                />
               <View style={{ height: 100 }} />
            </ScrollView>
          )}
      </View>

      <FocusMode
        visible={showFocusModal}
        category={selectedCategory}
        onClose={closeCategory}
        categoryProgress={selectedCategory ? (progress[selectedCategory.id] || {}) : {}}
        onUpdateProgress={handleUpdateProgress}
        onResetCategory={handleResetCategory}
        startIndex={startIndex}
      />

      {selectedCategory && selectedCategory.isHisn && (
          <HisnCategoryModal 
            visible={showHisnModal}
            onClose={closeCategory}
            category={selectedCategory}
            hisnSections={selectedCategory.sections || []}
            categoryProgress={progress[selectedCategory.id] || {}}
            onUpdateProgress={handleUpdateProgress}
            onResetSection={handleResetCategory} 
            initialState={initialHisnState}
            onConsumeInitialState={handleConsumeInitialState}
          />
      )}
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 15,
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
  scrollContentSearch: {
    paddingTop: 10,
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
  contentContainer: {
    flex: 1,
  },
  searchContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      marginTop: 10,
  }
});
