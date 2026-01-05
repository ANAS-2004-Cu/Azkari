import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AzkarSearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onCancel: () => void;
    isActive: boolean;
}

export default function AzkarSearchBar({ 
    value, 
    onChangeText, 
    onClear, 
    onFocus, 
    onBlur, 
    onCancel, 
    isActive 
}: AzkarSearchBarProps) {
    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
                style={[styles.searchBar, isActive && styles.searchBarFocused]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Ionicons 
                    name="search" 
                    size={20} 
                    color={isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)"} 
                />
                <TextInput
                    style={styles.input}
                    placeholder="ابحث في جميع الأذكار..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    textAlign="right"
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {value && value.length > 0 && (
                    <TouchableOpacity 
                        onPress={onClear}
                        hitSlop={10}
                    >
                        <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                )}
            </LinearGradient>
            
            {isActive && (
                <TouchableOpacity 
                    onPress={() => {
                        Keyboard.dismiss();
                        onCancel();
                    }}
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.cancelText}>إلغاء البحث</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        marginTop: 100,
        gap: 10,
        zIndex: 90,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        ...Platform.select({
            web: {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    searchBarFocused: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...Platform.select({
            web: {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            ios: {
                shadowOpacity: 0.2,
            },
            android: {
                shadowOpacity: 0.2,
            },
        }),
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        marginHorizontal: 10,
        fontWeight: '500',
        textAlign: 'right',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 69, 58, 0.25)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 69, 58, 0.4)',
        marginLeft: 4,
        ...Platform.select({
            web: {
                boxShadow: '0 4px 12px rgba(255, 69, 58, 0.3)',
            },
            ios: {
                shadowColor: '#ff453a',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            }
        })
    },
    cancelText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    }
});
