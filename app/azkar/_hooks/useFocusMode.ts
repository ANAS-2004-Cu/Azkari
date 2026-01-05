import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Share } from 'react-native';
import { VolumeManager } from 'react-native-volume-manager';

const { width } = Dimensions.get('window');
const FAVORITES_KEY = 'AZKARI_FAVORITES_V1';

interface UseFocusModeProps {
    visible: boolean;
    category: any;
    categoryProgress: any;
    onUpdateProgress: (id: string, count: number) => void;
    onResetCategory: () => void;
    startIndex?: number;
}


export function useFocusMode({ 
    visible, 
    category, 
    categoryProgress, 
    onUpdateProgress, 
    onResetCategory,
    startIndex = 0
}: UseFocusModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [optimisticCount, setOptimisticCount] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    const contentAnim = useRef(new Animated.Value(0)).current; 
    const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleTapRef = useRef<(() => void) | null>(null);

    const currentZekr = useMemo(() => {
        const data = category?.data || [];
        return data[currentIndex];
    }, [category, currentIndex]);
    const targetCount = currentZekr?.count ? parseInt(currentZekr.count, 10) : 1;
    
    const isCompleted = optimisticCount >= targetCount;
    const isLast = currentIndex === (category?.data?.length || 0) - 1;
    const isFirst = currentIndex === 0;
    const isFavorite = currentZekr && favorites.includes(currentZekr.id);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const stored = await AsyncStorage.getItem(FAVORITES_KEY);
                if (stored) setFavorites(JSON.parse(stored));
            } catch (_error) {
                console.error('Failed to load favorites:', _error);
            }
        };
        loadFavorites();
    }, []);

    useEffect(() => {
        if (visible) {
            const dataLength = category?.data?.length || 0;
            const validStartIndex = (startIndex >= 0 && startIndex < dataLength) ? startIndex : 0;
            setCurrentIndex(validStartIndex);
            contentAnim.setValue(0);
        }
    }, [visible, startIndex, contentAnim, category]);

    useEffect(() => {
        if (currentZekr) {
            const savedCount = categoryProgress?.[currentZekr.id] || 0;
            setOptimisticCount(savedCount);
        }
    }, [currentZekr, categoryProgress]);

    useEffect(() => {
        return () => {
            if (autoAdvanceTimer.current) {
                clearTimeout(autoAdvanceTimer.current);
            }
        };
    }, []);

    const toggleFavorite = useCallback(async () => {
        if (!currentZekr) return;
        
        const newFavorites = favorites.includes(currentZekr.id)
            ? favorites.filter(id => id !== currentZekr.id)
            : [...favorites, currentZekr.id];
        
        setFavorites(newFavorites);
        
        try {
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            Haptics.selectionAsync();
        } catch (_error) {
            console.error('Failed to save favorites:', _error);
        }
    }, [currentZekr, favorites]);

    const triggerPageAnimation = useCallback((direction: 'next' | 'prev', callback?: () => void) => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        const slideOutTo = direction === 'next' ? -width : width;
        
        Animated.timing(contentAnim, {
            toValue: slideOutTo,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (callback) callback();
            contentAnim.setValue(direction === 'next' ? width : -width); 
            
            Animated.timing(contentAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsTransitioning(false));
        });
    }, [isTransitioning, contentAnim]);

    const nextZekr = useCallback(() => {
        if (!isLast && !isTransitioning) {
            triggerPageAnimation('next', () => setCurrentIndex(prev => prev + 1));
        }
    }, [isLast, isTransitioning, triggerPageAnimation]);

    const prevZekr = useCallback(() => {
        if (!isFirst && !isTransitioning) {
            triggerPageAnimation('prev', () => setCurrentIndex(prev => prev - 1));
        }
    }, [isFirst, isTransitioning, triggerPageAnimation]);

    const handleTap = useCallback(() => {
        if (isTransitioning || !currentZekr) return;

        if (optimisticCount < targetCount) {
            const newCount = optimisticCount + 1;
            setOptimisticCount(newCount);
            onUpdateProgress(currentZekr.id, newCount);

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            if (newCount === targetCount) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                
                if (!isLast) {
                    if (autoAdvanceTimer.current) {
                        clearTimeout(autoAdvanceTimer.current);
                    }
                    autoAdvanceTimer.current = setTimeout(() => nextZekr(), 500);
                }
            }
        } else {
            if (!isLast) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                nextZekr();
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
        }
    }, [isTransitioning, optimisticCount, targetCount, currentZekr, onUpdateProgress, isLast, nextZekr]);

    useEffect(() => {
        handleTapRef.current = handleTap;
    }, [handleTap]);

    const getFormattedZekrText = useCallback(() => {
        if (!currentZekr) return '';
        
        const categoryTitle = category?.title || 'ذكر';
        const zekrText = currentZekr.zekr;
        const description = currentZekr.description 
            ? `\n\n✨──────────────\n${currentZekr.description}` 
            : '';
        const reference = currentZekr.reference 
            ? `\n\n📚 ──────────────\n${currentZekr.reference}` 
            : '';
        const separator = '\n\n───────────────';
        const appSignature = '\n✨ تطبيق أذكاري';
        
        return `🌟 ${categoryTitle}\n\n${zekrText}${description}${reference}${separator}${appSignature}`;
    }, [currentZekr, category]);

    const handleShare = useCallback(async () => {
        if (!currentZekr) return;
        
        try {
            await Share.share({
                message: getFormattedZekrText(),
                title: category?.title || 'مشاركة ذكر',
            });
        } catch (_error) {
            console.error('Share failed:', _error);
        }
    }, [currentZekr, getFormattedZekrText, category]);

    const handleCopy = useCallback(async () => {
        if (!currentZekr) return;
        
        try {
            const text = getFormattedZekrText();
            await Clipboard.setStringAsync(text);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (_error) {
            console.error('Copy failed:', _error);
        }
    }, [currentZekr, getFormattedZekrText]);

    const handleReset = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        
        if (onResetCategory) {
            onResetCategory();
        }
        
        setOptimisticCount(0);
        setCurrentIndex(0);
        contentAnim.setValue(0);
    }, [onResetCategory, contentAnim]);

    useEffect(() => {
        if (!visible) return;
        
        VolumeManager.showNativeVolumeUI({ enabled: false });
        
        const volumeListener = VolumeManager.addVolumeListener(() => {
            if (handleTapRef.current) {
                handleTapRef.current();
            }
        });
        
        return () => {
            if (volumeListener) {
                volumeListener.remove();
            }
            VolumeManager.showNativeVolumeUI({ enabled: true });
        };
    }, [visible]);

    return {
        currentIndex,
        optimisticCount,
        isFavorite,
        currentZekr,
        targetCount,
        isCompleted,
        isFirst,
        isLast,
        contentAnim,
        handleTap,
        nextZekr,
        prevZekr,
        toggleFavorite,
        handleShare,
        handleCopy,
        handleReset
    };
}

export default () => null;
