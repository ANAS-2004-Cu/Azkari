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

    const tabBarAnimation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        animatedValues.forEach((anim, index) => {
            const routeIndex = state.routes.findIndex(r => r.name === filteredRoutes[index]?.name);
            Animated.spring(anim, {
                toValue: state.index === routeIndex ? 1 : 0,
                useNativeDriver: false,
                tension: 120,
                friction: 10,
            }).start();
        });

        Animated.spring(tabBarAnimation, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 8,
        }).start();
    }, [state.index]);

    const getIcon = (routeName, color, focused) => {
        const iconProps = { size: focused ? 28 : 24, color };

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
        <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
            <Animated.View 
                style={[
                    styles.tabBarContainer,
                    {
                        transform: [
                            {
                                translateY: tabBarAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [100, 0],
                                })
                            }
                        ],
                        opacity: tabBarAnimation
                    }
                ]}
            >
                <View style={styles.tabBar}>
                    {filteredRoutes.map((route, index) => {
                        const routeIndex = state.routes.findIndex(r => r.name === route.name);
                        const isFocused = state.index === routeIndex;

                        const translateY = animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -25],
                        });

                        const scale = animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.1],
                        });

                        const backgroundColor = animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: ['transparent', '#10B981'],
                        });

                        const borderWidth = animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 3],
                        });

                        const shadowOpacity = animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.3],
                        });

                        const textOpacity = animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
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
                                        styles.floatingTab,
                                        {
                                            transform: [
                                                { translateY },
                                                { scale }
                                            ],
                                            backgroundColor,
                                            borderWidth,
                                            shadowOpacity,
                                        },
                                    ]}
                                >
                                    <View style={styles.iconContainer}>
                                        {getIcon(
                                            route.name,
                                            isFocused ? '#FFFFFF' : '#6B7280',
                                            isFocused
                                        )}
                                    </View>
                                </Animated.View>
                                
                                {/* Tab title below floating icon */}
                                {isFocused && (
                                    <Animated.Text
                                        style={[
                                            styles.tabTitle,
                                            {
                                                opacity: textOpacity,
                                                transform: [{ translateY: translateY }],
                                            },
                                        ]}
                                    >
                                        {getTitle(route.name)}
                                    </Animated.Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Animated.View>
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
    tabBarContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 35,
        paddingVertical: 8,
        paddingHorizontal: 8,
        position: 'relative',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        width: width - 40,
        height: 60,
        overflow: 'visible',
        paddingBottom: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        overflow: 'visible',
        marginLeft:15,
        marginRight: 15,
    },
    floatingTab: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#FFFFFF',
        shadowColor: '#10B981',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 8,
        elevation: 15,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
    },
    tabTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#374151',
        textAlign: 'center',
        marginTop: 7,
        letterSpacing: 0.3,
    },
});

export default CustomTabBar;