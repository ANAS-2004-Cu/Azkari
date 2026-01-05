import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SearchResultCardProps {
    result: any;
    onPress: (category: any, index: number) => void;
    searchQuery: string;
}

const SearchResultCard = memo(({ result, onPress, searchQuery }: SearchResultCardProps) => {
    const { category, matchedItems, categoryTitleMatch, totalMatches } = result;

    const getMatchBadgeColor = (field: string) => {
        switch (field) {
            case 'zekr':
                return { bg: 'rgba(76, 175, 80, 0.3)', text: '#81C784', label: 'النص' };
            case 'description':
                return { bg: 'rgba(255, 152, 0, 0.3)', text: '#FFB74D', label: 'الفضل' };
            case 'reference':
                return { bg: 'rgba(33, 150, 243, 0.3)', text: '#64B5F6', label: 'المرجع' };
            default:
                return { bg: 'rgba(158, 158, 158, 0.3)', text: '#BDBDBD', label: field };
        }
    };

    const topMatch = matchedItems.length > 0 ? matchedItems[0] : null;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(category, topMatch ? topMatch.index : 0)}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={category.gradient || ['#FFB74D', '#FF9800']}
                            style={styles.iconGradient}
                        >
                            <Ionicons 
                                name={category.icon || 'book'} 
                                size={24} 
                                color="#fff" 
                            />
                        </LinearGradient>
                    </View>
                    
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {category.title}
                        </Text>
                        {categoryTitleMatch && (
                            <View style={styles.titleMatchBadge}>
                                <Ionicons name="checkmark-circle" size={12} color="#FFD700" />
                            </View>
                        )}
                    </View>

                    <View style={styles.arrow}>
                        <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.5)" />
                    </View>
                </View>


                <View style={styles.matchesContainer}>
                    <Ionicons name="search" size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.matchesText}>
                        {totalMatches || matchedItems.length} {(totalMatches || matchedItems.length) === 1 ? 'نتيجة' : 'نتائج'}
                    </Text>
                    {topMatch && topMatch.relevance && (
                        <View style={styles.relevanceBadge}>
                            <Text style={styles.relevanceText}>{topMatch.relevance}%</Text>
                        </View>
                    )}
                </View>

                {topMatch && (
                    <View style={styles.previewContainer}>
                        <View style={styles.previewHeader}>
                            <View style={styles.locationBadge}>
                                <Ionicons name="bookmark-outline" size={12} color="#64B5F6" />
                                <Text style={styles.locationText}>
                                    {category.title}
                                </Text>
                            </View>
                        </View>
                        
                        <View style={styles.zekrTitleContainer}>
                            <Text style={styles.zekrTitle} numberOfLines={1}>
                                {topMatch.item.sectionTitle || 
                                 (topMatch.item.zekr.split('\n')[0].substring(0, 50) + (topMatch.item.zekr.split('\n')[0].length > 50 ? '...' : ''))}
                            </Text>
                        </View>

                        <Text style={styles.previewText} numberOfLines={2}>
                            {topMatch.item.zekr}
                        </Text>
                        {topMatch.matchedIn && topMatch.matchedIn.length > 0 && (
                            <View style={styles.matchedInContainer}>
                                {topMatch.matchedIn.slice(0, 3).map((field: string, index: number) => {
                                    const badge = getMatchBadgeColor(field);
                                    return (
                                        <View 
                                            key={index} 
                                            style={[styles.matchedInBadge, { backgroundColor: badge.bg }]}
                                        >
                                            <Text style={[styles.matchedInText, { color: badge.text }]}>
                                                {badge.label}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
});

SearchResultCard.displayName = 'SearchResultCard';

export default SearchResultCard;

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        marginLeft: 12,
    },
    iconGradient: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    titleMatchBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
    },
    arrow: {
        marginRight: 8,
    },
    matchesContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    matchesText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    relevanceBadge: {
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginRight: 4,
    },
    relevanceText: {
        fontSize: 11,
        color: '#81C784',
        fontWeight: 'bold',
    },
    previewContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 12,
        borderRadius: 12,
    },
    previewHeader: {
        marginBottom: 8,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-end',
    },
    locationText: {
        fontSize: 11,
        color: '#64B5F6',
        fontWeight: '600',
    },
    zekrTitleContainer: {
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    zekrTitle: {
        fontSize: 13,
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    previewText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 22,
        marginBottom: 8,
        textAlign: 'right',
    },
    matchedInContainer: {
        flexDirection: 'row-reverse',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    matchedInBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    matchedInText: {
        fontSize: 11,
        fontWeight: '600',
    },
});
