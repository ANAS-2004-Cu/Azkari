import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FocusModeHeaderProps {
    onClose: () => void;
    currentIndex: number;
    totalCount: number;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    title: string;
    onShare: () => void;
    onCopy: () => void;
}

export default function FocusModeHeader({ 
    onClose, 
    currentIndex, 
    totalCount, 
    isFavorite, 
    onToggleFavorite, 
    title, 
    onShare, 
    onCopy 
}: FocusModeHeaderProps) {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.glassPill}>
                <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.centerInfo}>
                    <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
                    <Text style={styles.counterText}>
                        {currentIndex + 1} من {totalCount}
                    </Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        onPress={onCopy} 
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="copy-outline" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={onShare} 
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="share-social-outline" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={onToggleFavorite} 
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name={isFavorite ? "heart" : "heart-outline"} 
                            size={20} 
                            color={isFavorite ? "#ff4757" : "#fff"} 
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    glassPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    centerInfo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titleText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        ...Platform.select({
            web: {
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
            },
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
            },
            android: {
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
            },
        }),
    },
    counterText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    iconButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
