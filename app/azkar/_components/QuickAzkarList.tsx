import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QuickAzkarList({ categories, onPress, progress }: { categories: any[], onPress: (i: any) => void, progress: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>أذكارك اليومية</Text>
      <View style={styles.listContainer}>
        {categories.map((item) => {
          const itemProgress = progress[item.id] || { completed: 0, total: 1 };
          const isCompleted = itemProgress.completed === itemProgress.total && itemProgress.total > 0;
          
          return (
            <TouchableOpacity 
              key={item.id} 
              style={styles.itemWrapper}
              onPress={() => onPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, isCompleted && styles.completedContainer]}>
                <LinearGradient
                  colors={isCompleted ? ['#4CAF50', '#81C784'] : item.gradient}
                  style={styles.innerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'transparent']}
                    style={styles.glossOverlay}
                  />

                  {item.iconType === 'ionicon' ? (
                    <Ionicons name={item.icon} size={30} color="#fff" style={styles.icon3d} />
                  ) : (
                    <MaterialCommunityIcons name={item.icon} size={30} color="#fff" style={styles.icon3d} />
                  )}
                </LinearGradient>
                
                <View style={styles.highlightDot} />
                <View style={styles.softBorder} />

              </View>
              
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
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
  listContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 10px rgba(0, 0, 0, 0.4)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
    backgroundColor: '#000',
  },
  completedContainer: {
    ...Platform.select({
      web: {
        boxShadow: '0 10px 15px rgba(76, 175, 80, 0.6)',
      },
      ios: {
        shadowColor: '#4CAF50',
        shadowOpacity: 0.6,
        shadowRadius: 15,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  innerGradient: {
    flex: 1,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 0, 
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.8,
  },
  highlightDot: {
    position: 'absolute',
    top: 12,
    left: 18,
    width: 16,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ rotate: '-45deg' }],
  },
  softBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    pointerEvents: 'none',
  },
  icon3d: {
    ...Platform.select({
      web: {
        textShadow: '0 3px 4px rgba(0,0,0,0.3)',
      },
      ios: {
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 4,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 4,
      },
    }),
  },
  itemTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
    width: 80,
    ...Platform.select({
      web: {
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
      },
      ios: {
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
      },
    }),
  },
});
