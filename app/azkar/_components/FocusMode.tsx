import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef } from 'react';
import { Animated, Dimensions, Modal, PanResponder, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useFocusMode } from '../_hooks/useFocusMode';
import FocusModeCard from './FocusModeCard';
import FocusModeControls from './FocusModeControls';
import FocusModeHeader from './FocusModeHeader';

const { width } = Dimensions.get('window');

interface FocusModeProps {
    visible: boolean;
    onClose: () => void;
    category: any;
    categoryProgress?: any;
    onUpdateProgress: (id: string, count: number) => void;
    onResetCategory: () => void;
    startIndex?: number;
}

export default function FocusMode({ 
    visible, 
    onClose, 
    category, 
    categoryProgress = {}, 
    onUpdateProgress,
    onResetCategory,
    startIndex = 0
}: FocusModeProps) {
    const {
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
    } = useFocusMode({
        visible,
        category,
        categoryProgress,
        onUpdateProgress,
        onResetCategory,
        startIndex
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > 50) {
                    prevZekr();
                } else if (gestureState.dx < -50) {
                    nextZekr();
                }
            }
        })
    ).current;

    const contentOpacity = useMemo(() => contentAnim.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [0.5, 1, 0.5]
    }), [contentAnim]);

    if (!category || !currentZekr) return null;

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
                    style={styles.modalBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.7, y: 0.5 }} 
                />
                
                <View style={styles.focusContainer}>
                    <FocusModeHeader 
                        onClose={onClose} 
                        currentIndex={currentIndex} 
                        totalCount={category.data.length} 
                        isFavorite={isFavorite}
                        onToggleFavorite={toggleFavorite}
                        title={category?.title}
                        onShare={handleShare}
                        onCopy={handleCopy}
                    />

                    <View 
                        style={styles.contentArea} 
                        {...panResponder.panHandlers}
                    >
                        <TouchableOpacity 
                            activeOpacity={1}
                            style={styles.tapArea}
                            onPress={handleTap}
                        >
                            <Animated.View style={[
                                styles.cardContainer,
                                { 
                                    transform: [
                                        { translateX: contentAnim }
                                    ],
                                    opacity: contentOpacity
                                }
                            ]}>
                                <FocusModeCard 
                                    zekr={currentZekr.zekr}
                                    description={currentZekr.description}
                                    reference={currentZekr.reference}
                                    isCompleted={isCompleted}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                    <FocusModeControls 
                        currentCount={optimisticCount}
                        targetCount={targetCount}
                        onNext={nextZekr}
                        onPrev={prevZekr}
                        onTap={handleTap}
                        onReset={handleReset}
                        isFirst={isFirst}
                        isLast={isLast}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#016A70',
    },
    modalBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    focusContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 45 : 60,
        paddingBottom: 30,
        justifyContent: 'space-between',
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    tapArea: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    cardContainer: {
        width: '100%',
        maxHeight: '100%',
    },
});
