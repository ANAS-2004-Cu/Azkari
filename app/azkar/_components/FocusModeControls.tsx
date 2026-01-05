import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CIRCLE_SIZE = 140;
const STROKE_WIDTH = 10;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FocusModeControlsProps {
    currentCount: number;
    targetCount: number;
    onNext: () => void;
    onPrev: () => void;
    onTap: () => void;
    onReset: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export default function FocusModeControls({ 
    currentCount, 
    targetCount, 
    onNext, 
    onPrev, 
    onTap, 
    onReset, 
    isFirst, 
    isLast 
}: FocusModeControlsProps) {
    const progressAnim = useRef(new Animated.Value(0)).current;

    const isCompleted = currentCount >= targetCount;

    useEffect(() => {
        const progress = targetCount > 0 ? Math.min(currentCount / targetCount, 1) : 0;
        
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 300,
            useNativeDriver: false 
        }).start();
    }, [currentCount, targetCount, progressAnim]);

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0] 
    });

    return (
        <View style={styles.footer}>
            <TouchableOpacity 
                onPress={onNext} 
                disabled={isLast}
                style={[styles.navBtn, isLast && styles.disabledNavBtn]}
            >
                <Ionicons name="chevron-back" size={32} color="#fff" /> 
            </TouchableOpacity>

            <View style={styles.counterWrapper}>
                <TouchableOpacity onPress={onTap} activeOpacity={0.7}>
                    <View style={styles.svgContainer}>
                        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                            <Circle
                                cx={CIRCLE_SIZE / 2}
                                cy={CIRCLE_SIZE / 2}
                                r={RADIUS}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={STROKE_WIDTH}
                                fill="rgba(0,0,0,0.2)"
                            />
                            <AnimatedCircle
                                cx={CIRCLE_SIZE / 2}
                                cy={CIRCLE_SIZE / 2}
                                r={RADIUS}
                                stroke="#FFD700"
                                strokeWidth={STROKE_WIDTH}
                                fill="none"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                            />
                        </Svg>
                        <View style={styles.counterTextContainer}>
                            <Text style={[
                                styles.counterNumber, 
                                isCompleted && styles.completedText
                            ]}>
                                {currentCount}
                            </Text>
                            <Text style={styles.counterTarget}>
                                /{targetCount}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
                    <Ionicons name="refresh" size={16} color="#FFD700" />
                    <Text style={styles.resetText}>إعادة</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                onPress={onPrev} 
                disabled={isFirst}
                style={[styles.navBtn, isFirst && styles.disabledNavBtn]}
            >
                <Ionicons name="chevron-forward" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    navBtn: {
        padding: 15,
        backgroundColor: 'rgba(255,255,255,0.1)', // Glass effect
        borderRadius: 30,
    },
    disabledNavBtn: {
        opacity: 0.3,
        ...Platform.select({
            ios: {
                elevation: 0,
            },
            android: {
                elevation: 0,
            },
        }),
        backgroundColor: 'transparent',
    },
    counterWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    svgContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderRadius: CIRCLE_SIZE / 2,
    },
    counterTextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    completedText: {
        color: '#FFD700', 
        ...Platform.select({
            web: {
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            },
            ios: {
                textShadowColor: 'rgba(255, 215, 0, 0.5)', 
                textShadowRadius: 10,
                textShadowOffset: { width: 0, height: 0 },
            },
            android: {
                textShadowColor: 'rgba(255, 215, 0, 0.5)', 
                textShadowRadius: 10,
                textShadowOffset: { width: 0, height: 0 },
            },
        }),
    },
    counterTarget: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginTop: -2,
    },
    resetBtn: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 215, 0, 0.15)', // Light transparent yellow bg
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    resetText: {
        fontSize: 14,
        color: '#FFD700', // Yellow text
        fontWeight: 'bold',
    },
});
