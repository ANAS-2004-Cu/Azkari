import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import * as NavigationBar from 'expo-navigation-bar';
import { Tabs } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTabBar from '../components/CustomTabBar';

const hideNavigationBar = async () => {
  if (Platform.OS === 'android') {
    try {
      await NavigationBar.setVisibilityAsync('hidden');
      await NavigationBar.setButtonStyleAsync('light');
    } catch (error) {
      console.error('Failed to hide navigation bar:', error);
    }
  }
};

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    hideNavigationBar();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        hideNavigationBar();
      }
    });

    const interval = setInterval(hideNavigationBar, 2000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
    {/* Status bar background */ }
    < View 
        style = {{
    height: insets.top,
      backgroundColor: '#000000',
        position: 'absolute',
          top: 0,
            left: 0,
              right: 0,
                zIndex: 1
  }
} 
      />
  < StatusBar style = "dark" />
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
