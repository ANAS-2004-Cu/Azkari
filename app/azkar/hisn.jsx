import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { HISN_CATEGORIES } from '../../Data/hisn';
import FocusMode from './_components/FocusMode';

import CategoryCard from './_components/CategoryCard';

const PROGRESS_KEY = 'HISN_PROGRESS';

export default function HisnScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [progress, setProgress] = useState({});

    const filteredCategories = HISN_CATEGORIES.filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const decoratedCategories = filteredCategories.map((cat, index) => ({
        ...cat,
        icon: 'book',
        iconType: 'ionicon',
        color: ['#FF9800', '#7C4DFF', '#00BCD4', '#E91E63', '#4CAF50'][index % 5],
        gradient: [
            ['#FFB74D', '#FF9800'],
            ['#B388FF', '#7C4DFF'],
            ['#4DD0E1', '#00BCD4'],
            ['#F48FB1', '#E91E63'],
            ['#81C784', '#4CAF50']
        ][index % 5]
    }));

    useEffect(() => {
        AsyncStorage.getItem(PROGRESS_KEY).then(data => {
            if (data) setProgress(JSON.parse(data));
        });
    }, []);

    const saveProgress = useCallback((newProgress) => {
        setProgress(newProgress);
        AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    }, []);

    const handleUpdateProgress = useCallback((itemId, newCount) => {
        if (!selectedCategory) return;
        const catId = selectedCategory.id;
        
        const newProg = {
            ...progress,
            [catId]: {
                ...(progress[catId] || {}),
                [itemId]: newCount
            }
        };
        saveProgress(newProg);
    }, [selectedCategory, progress, saveProgress]);

    const handleResetCategory = useCallback(() => {
        if (!selectedCategory) return;
        const catId = selectedCategory.id;
        const newProg = { ...progress };
        delete newProg[catId];
        saveProgress(newProg);
    }, [selectedCategory, progress, saveProgress]);

    const getProgressStats = (category) => {
        const catProg = progress[category.id] || {};
        const total = category.count;
        let completed = 0;
        category.data.forEach((item, idx) => {
             const itemId = item.id || (idx + 1);
             const target = item.count || 1;
             if ((catProg[itemId] || 0) >= target) completed++;
        });
        
        return {
            completed,
            total,
            percentage: total > 0 ? (completed / total) * 100 : 0
        };
    };

    return (
        <LinearGradient
            colors={['#1A237E', '#3949AB']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>حصن المسلم</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
                <TextInput 
                    style={styles.searchInput}
                    placeholder="ابحث في الأذكار..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    textAlign="right"
                />
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {decoratedCategories.map(cat => (
                    <CategoryCard 
                        key={cat.id}
                        category={cat}
                        progress={getProgressStats(cat)}
                        onPress={() => {
                            setSelectedCategory(cat);
                            setShowModal(true);
                        }}
                    />
                ))}
                <View style={{ height: 40 }} />
            </ScrollView>

            <FocusMode 
                visible={showModal}
                category={selectedCategory}
                onClose={() => setShowModal(false)}
                categoryProgress={selectedCategory ? (progress[selectedCategory.id] || {}) : {}}
                onUpdateProgress={handleUpdateProgress}
                onResetCategory={handleResetCategory}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        marginLeft: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 15,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: {
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        height: '100%',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 40,
    },
});
