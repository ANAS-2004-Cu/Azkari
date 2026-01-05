import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const renderIcon = (category: any, size = 32, color = '#fff') => {
  switch (category.iconType) {
    case 'ionicon':
      return <Ionicons name={category.icon} size={size} color={color} />;
    case 'material':
      return <MaterialCommunityIcons name={category.icon} size={size} color={color} />;
    case 'feather':
      return <Feather name={category.icon} size={size} color={color} />;
    default:
      return <Ionicons name="book" size={size} color={color} />;
  }
};

export default function CategoryCard({ category, onPress, progress }: { category: any, onPress: (c: any) => void, progress: any }) {
  const { total = 0, percentage = 0 } = progress || {};

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(category)}
      activeOpacity={0.9}
    >
      <View style={styles.glassBackground}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.gradientSurface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'transparent']}
            style={styles.glossOverlay}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          <View style={styles.cardContent}>
            <View style={styles.icon3DContainer}>
                <LinearGradient
                    colors={category.gradient}
                    style={styles.iconInnerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.4)', 'transparent']}
                        style={styles.glossOverlaySmall}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    />
                    {renderIcon(category, 30, '#fff')}
                </LinearGradient>
                <View style={styles.highlightDot} />
                <View style={[
                    styles.iconShadow, 
                    Platform.select({
                        web: { boxShadow: `0 4px 8px ${category.color}66` },
                        ios: { shadowColor: category.color },
                        android: { shadowColor: category.color }
                    })
                ]} />
            </View>
            
            <View style={styles.textContainer}>
                <Text style={styles.categoryTitle} numberOfLines={1}>{category.title}</Text>
                <Text style={styles.categoryCount}>{total} ذكر</Text>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={category.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.progressFill, 
                            { width: `${percentage}%` }
                        ]} 
                    />
                </View>
                <Text style={styles.progressText}>
                    {Math.round(percentage)}%
                </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: (width - 45) / 2, 
    marginBottom: 20,
    height: 180,
    borderRadius: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  glassBackground: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(23, 23, 23, 0.4)',
    position: 'relative',
  },
  gradientSurface: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.3,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  
  icon3DContainer: {
    width: 68,
    height: 68,
    marginBottom: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 8px rgba(0, 0, 0, 0.35)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    backgroundColor: '#000',
  },
  iconInnerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 0,
    overflow: 'hidden',
  },
  glossOverlaySmall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 34,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.8,
  },
  highlightDot: {
    position: 'absolute',
    top: 10,
    left: 14,
    width: 14,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ rotate: '-45deg' }],
    zIndex: 3,
  },
  iconShadow: {
    position: 'absolute',
    bottom: -6,
    width: 40,
    height: 20,
    opacity: 0.4,
    borderRadius: 20,
    transform: [{ scaleX: 1.5 }],
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      },
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
    zIndex: 1,
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    ...Platform.select({
      web: {
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
      },
      ios: {
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
    }),
  },
  categoryCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    width: 35,
    textAlign: 'right',
    ...Platform.select({
      web: {
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      },
      ios: {
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
    }),
  },
});
