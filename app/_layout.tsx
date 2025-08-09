import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import * as NavigationBar from 'expo-navigation-bar';
import { Tabs } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

// For Android to hide navigation bar
const hideNavigationBar = async () => {
  if (Platform.OS === 'android') {
    try {
      // Hide navigation bar
      await NavigationBar.setVisibilityAsync('hidden');
      // Set button style for visibility
      await NavigationBar.setButtonStyleAsync('light');
    } catch (error) {
      console.error('Failed to hide navigation bar:', error);
    }
  }
};

export default function RootLayout() {
  useEffect(() => {
    // Hide on initial load
    hideNavigationBar();

    // Hide again every time app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        hideNavigationBar();
      }
    });

    // Set an interval to repeatedly hide the nav bar (some devices are persistent)
    const interval = setInterval(hideNavigationBar, 2000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
    <StatusBar style= "dark" backgroundColor = "#000000" />
      <Tabs
        tabBar={ (props) => <CustomTabBar { ...props } />}
        screenOptions = {{
          headerShown: false,
          animation: "shift"
        }}
      >
  <Tabs.Screen
          name="(home)"
          options = {{
            title: "الرئيسية",
            tabBarIcon: ({ color }) => <AntDesign name="home" size = { 24} color = { color } />,
          }}
        />
  < Tabs.Screen
        name = "azkar"
        options = {{
          title: "الأذكار",
          tabBarIcon: ({ color }) => <Octicons name="book" size = { 24} color = { color } />,
        }}
      />
  < Tabs.Screen
        name = "trace"
        options = {{
          title: "التتبع",
          tabBarIcon: ({ color }) => <Entypo name="line-graph" size = { 24} color = { color } />,
        }}
      />
  < Tabs.Screen
        name = "share"
        options = {{
          title: "المشاركة",
          tabBarIcon: ({ color }) => <AntDesign name="sharealt" size = { 24} color = { color } />,
        }}
      />
  </Tabs>
  </>
  );
}
