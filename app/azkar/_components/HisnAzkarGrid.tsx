import { Platform, StyleSheet, Text, View } from 'react-native';
import CategoryCard from './CategoryCard';

export default function HisnAzkarGrid({ categories, onPress, progress }: { categories: any[], onPress: (c: any) => void, progress: any }) {

  const getCategoryProgress = (category: any) => {
    const catProgress = progress[category.id] || {};
    let completedCount = 0;
    
    category.data.forEach((item: any) => {
        const target = item.count ? parseInt(item.count) : 1;
        const current = catProgress[item.id] || 0;
        if (current >= target) completedCount++;
    });

    const total = category.data.length;
    return {
        completed: completedCount,
        total,
        percentage: total > 0 ? (completedCount / total) * 100 : 0
    };
  };

  return (
    <>
      <Text style={styles.sectionTitle}>تصنيفات حصن المسلم</Text>
      <View style={styles.grid}>
        {categories.map((category) => (
          <CategoryCard 
              key={category.id} 
              category={category} 
              onPress={onPress}
              progress={getCategoryProgress(category)}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'right',
    ...Platform.select({
      web: {
        textShadow: '0 2px 3px rgba(0,0,0,0.2)',
      },
      ios: {
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3,
      },
    }),
  },
});
