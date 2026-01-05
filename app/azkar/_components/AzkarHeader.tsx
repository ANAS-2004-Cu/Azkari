import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface AzkarHeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
}

export default function AzkarHeader({ 
  title = "الأذكار والأدعية", 
  subtitle = "اختر من الأذكار أدناه",
  leftAction = null
}: AzkarHeaderProps) {
  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
      style={styles.headerGlass}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {leftAction && (
          <View style={styles.leftAction}>
              {leftAction}
          </View>
      )}
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGlass: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 100,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(1, 106, 112, 0.9)',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)',
      },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 12,
            },
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftAction: {
      marginRight: 10,
  },
  headerContent: {
      flex: 1,
      alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'right',
    ...Platform.select({
      web: {
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      },
            ios: {
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
            },
            android: {
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
            },
    }),
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'right',
    marginTop: 2,
    fontWeight: '500',
  }
});
