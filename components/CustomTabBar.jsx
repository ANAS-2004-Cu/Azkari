import React from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const CustomTabBar = ({ state, descriptors, navigation, tabConfig }) => {
  const insets = useSafeAreaInsets();

  const filteredRoutes = state.routes.filter((route) => {
    const tab = tabConfig.find((t) => t.name === route.name);
    return tab && tab.visible;
  });

  const animatedValues = React.useRef(
    filteredRoutes.map(() => new Animated.Value(0))
  ).current;

  const tabBarAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    animatedValues.forEach((anim, index) => {
      const routeIndex = state.routes.findIndex(
        (r) => r.name === filteredRoutes[index]?.name
      );
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
                }),
              },
            ],
            opacity: tabBarAnimation,
          },
        ]}
      >
        <View style={styles.tabBar}>
          {filteredRoutes.map((route, index) => {
            const routeIndex = state.routes.findIndex(
              (r) => r.name === route.name
            );
            const isFocused = state.index === routeIndex;
            const tab = tabConfig.find((t) => t.name === route.name);

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
              outputRange: ["transparent", "#10B981"],
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
                type: "tabPress",
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
                      transform: [{ translateY }, { scale }],
                      backgroundColor,
                      borderWidth,
                      shadowOpacity,
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    {tab &&
                      tab.icon(isFocused ? "#FFFFFF" : "#6B7280", isFocused)}
                  </View>
                </Animated.View>

                {isFocused && tab && (
                  <Animated.Text
                    style={[
                      styles.tabTitle,
                      {
                        opacity: textOpacity,
                        transform: [{ translateY: translateY }],
                      },
                    ]}
                  >
                    {tab.title}
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
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 35,
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: "relative",
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    width: width - 40,
    height: 60,
    overflow: "visible",
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    overflow: "visible",
    marginLeft: "2%",
    marginRight: "2%",
  },
  floatingTab: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#FFFFFF",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  tabTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginTop: 7,
    letterSpacing: 0.3,
  },
});

export default CustomTabBar;
