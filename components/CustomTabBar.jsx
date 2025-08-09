import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    const filteredRoutes = state.routes.filter(route =>
        ['(home)', 'azkar', 'trace', 'share'].includes(route.name)
    );

    const animatedValues = React.useRef(
        filteredRoutes.map(() => new Animated.Value(0))
    ).current;

    React.useEffect(() => {
        animatedValues.forEach((anim, index) => {
            const routeIndex = state.routes.findIndex(r => r.name === filteredRoutes[index]?.name);
            Animated.spring(anim, {
                toValue: state.index === routeIndex ? 1 : 0,
                useNativeDriver: false,
                tension: 100,
                friction: 3,
            }).start();
        });
    }, [state.index]);

    const getIcon = (routeName, color, focused) => {
        const iconProps = { size: focused ? 26 : 22, color };

        switch (routeName) {
            case '(home)':
                return <AntDesign name="home" {...iconProps} />;
            case 'azkar':
                return <Octicons name="book" {...iconProps} />;
            case 'trace':
                return <Entypo name="line-graph" {...iconProps} />;
            case 'share':
                return <AntDesign name="sharealt" {...iconProps} />;
            default:
                return null;
        }
    };

    const getTitle = (routeName) => {
        switch (routeName) {
            case '(home)': return 'الرئيسية';
            case 'azkar': return 'الأذكار';
            case 'trace': return 'التتبع';
            case 'share': return 'المشاركة';
            default: return '';
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.tabBar}>
                {filteredRoutes.map((route, index) => {
                    const routeIndex = state.routes.findIndex(r => r.name === route.name);
                    const isFocused = state.index === routeIndex;

                    const backgroundColor = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(1, 106, 112, 0.05)', 'rgba(1, 106, 112, 0.9)'],
                    });

                    const scale = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1.05],
                    });

                    const textOpacity = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    });

                    const iconScale = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15],
                    });

                    const shadowOpacity = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.3],
                    });

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Animated.View
                                style={[
                                    styles.tabButton,
                                    {
                                        backgroundColor,
                                        transform: [{ scale }],
                                        shadowOpacity,
                                        elevation: isFocused ? 8 : 0,
                                    },
                                ]}
                            >
                                <Animated.View
                                    style={[
                                        styles.iconContainer,
                                        { transform: [{ scale: iconScale }] }
                                    ]}
                                >
                                    {getIcon(
                                        route.name,
                                        isFocused ? '#FFFFFF' : '#016A70',
                                        isFocused
                                    )}
                                </Animated.View>
                                {isFocused && (
                                    <Animated.Text
                                        style={[
                                            styles.tabText,
                                            {
                                                color: '#FFFFFF',
                                                opacity: textOpacity,
                                                transform: [{ scale: textOpacity }],
                                            },
                                        ]}
                                    >
                                        {getTitle(route.name)}
                                    </Animated.Text>
                                )}
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(248, 250, 252, 0.95)',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 35,
        paddingVertical: 12,
        paddingHorizontal: 12,
        shadowColor: '#016A70',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 2,
        borderColor: 'rgba(1, 106, 112, 0.1)',
        backdropFilter: 'blur(20px)',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabButton: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 28,
        minHeight: 60,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 60,
        shadowColor: '#016A70',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 8,
        elevation: 0,
    },
    iconContainer: {
        marginBottom: 3,
        padding: 2,
    },
    tabText: {
        fontSize: 11,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 2,
        letterSpacing: 0.3,
    },
});

export default CustomTabBar;
