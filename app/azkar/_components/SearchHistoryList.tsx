import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SearchHistoryList({ history, onSelect, onRemove, onClear }) {
    if (!history || history.length === 0) return null;

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.title}>عمليات البحث الأخيرة</Text>
                        </View>
                        <TouchableOpacity onPressIn={onClear} hitSlop={10}>
                            <Text style={styles.clearText}>مسح الكل</Text>
                        </TouchableOpacity>
                    </View>
                }
                keyExtractor={(item, index) => `history-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => onSelect(item)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="search" size={14} color="rgba(255,255,255,0.5)" />
                        <Text style={styles.text} numberOfLines={1}>{item}</Text>
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                onRemove(item);
                            }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={16} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 10,
    },
    headerLeft: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '600',
    },
    clearText: {
        color: '#ff6b6b',
        fontSize: 12,
        fontWeight: '600',
    },
    item: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 10,
        borderRadius: 8,
        marginBottom: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    text: {
        flex: 1,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textAlign: 'right',
    },
});
