import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

interface FocusModeCardProps {
    zekr: string;
    description: string;
    reference: string;
    isCompleted: boolean;
}

export default function FocusModeCard({ zekr, description, reference, isCompleted }: FocusModeCardProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isCompleted 
                    ? ['rgba(162, 197, 121, 0.25)', 'rgba(162, 197, 121, 0.05)'] 
                    : ['rgba(40, 40, 40, 0.35)', 'rgba(20, 20, 20, 0.2)']}
                style={[styles.card, isCompleted && styles.cardCompletedBorder]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.12)', 'transparent']}
                    style={styles.glossOverlay}
                    pointerEvents="none"
                />

                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.zekrText}>{zekr}</Text>
                    
                    {description && (
                         <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
                            <View style={styles.dividerLine} />
                        </View>
                    )}
                    
                    {description ? (
                        <View style={styles.virtueBox}>
                             <Text style={styles.virtueText}>{description}</Text>
                        </View>
                    ) : (
                        <View style={styles.spacer} />
                    )}

                    {reference && (
                        <View style={styles.referenceBadge}>
                            <Text style={styles.referenceText}>{reference}</Text>
                            <Ionicons name="book-outline" size={12} color="rgba(255,255,255,0.6)" style={styles.referenceIcon} />
                        </View>
                    )}
                </ScrollView>

                <View style={[
                    styles.borderOverlay, 
                    isCompleted && styles.borderOverlayCompleted
                ]} />
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        maxHeight: 600,
        borderRadius: 36,
        ...Platform.select({
            web: {
                boxShadow: '0 15px 20px rgba(0, 0, 0, 0.4)',
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 15 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
            },
            android: {
                elevation: 12,
            },
        }),
        marginVertical: 10,
    },
    card: {
        flex: 1,
        borderRadius: 36,
        overflow: 'hidden',
        position: 'relative',
    },
    cardCompletedBorder: {
        borderWidth: 2,
        borderColor: 'rgba(162, 197, 121, 0.5)',
    },
    glossOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
    },
    scrollContent: {
        padding: 32,
        paddingTop: 40,
        paddingBottom: 40,
    },
    zekrText: {
        fontSize: 32,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 56,
        fontWeight: '600',
        ...Platform.select({
            web: {
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
            },
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.4)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
            },
            android: {
                textShadowColor: 'rgba(0, 0, 0, 0.4)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
            },
        }),
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    virtueBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    virtueText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        lineHeight: 26,
    },
    spacer: {
        height: 10,
    },
    referenceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    referenceText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    referenceIcon: {
        marginLeft: 6,
    },
    borderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        pointerEvents: 'none',
    },
    borderOverlayCompleted: {
        borderColor: 'rgba(162, 197, 121, 0.4)',
    },
});
