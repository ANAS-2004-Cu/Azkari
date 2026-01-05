import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from "@expo/vector-icons/Octicons";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar, { TabConfigItem } from "../components/CustomTabBar";

SplashScreen.preventAutoHideAsync();

const tabConfig: TabConfigItem[] = [
  {
    name: "share",
    title: "المشاركة",
    icon: (color, focused) => (
      <AntDesign name="sharealt" size={focused ? 28 : 24} color={color} />
    ),
    visible: true,
  },
  {
    name: "trace",
    title: "التتبع",
    icon: (color, focused) => (
      <Entypo name="line-graph" size={focused ? 28 : 24} color={color} />
    ),
    visible: true,
  },
  {
    name: "(home)",
    title: "الرئيسية",
    icon: (color, focused) => (
      <AntDesign name="home" size={focused ? 28 : 24} color={color} />
    ),
    visible: true,
  },
  {
    name: "counter",
    title: "السبحة",
    icon: (color, focused) => (
      <MaterialCommunityIcons name="counter" size={focused ? 28 : 24} color={color} />
    ),
    visible: true,
  },
  {
    name: "azkar",
    title: "الأذكار",
    icon: (color, focused) => (
      <Octicons name="book" size={focused ? 28 : 24} color={color} />
    ),
    visible: true,
  }
  
];

const hideNavigationBar = async () => {
  if (Platform.OS === "android") {
    try {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setButtonStyleAsync("light");
    } catch (error) {
      console.error("Failed to hide navigation bar:", error);
    }
  }
};

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  
  const [loaded, error] = useFonts({
     ...AntDesign.font,
     ...Entypo.font,
     ...MaterialCommunityIcons.font,
     ...Octicons.font,
     ...Ionicons.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    hideNavigationBar();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        hideNavigationBar();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <View
        style={{
          height: insets.top,
          backgroundColor: "#000000",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      />
      <StatusBar style="light" />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} tabConfig={tabConfig} />}
        screenOptions={{
          headerShown: false,
          animation: "shift",
        }}
        initialRouteName="(home)"
      >
        {tabConfig.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color }) => tab.icon(color, false),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}