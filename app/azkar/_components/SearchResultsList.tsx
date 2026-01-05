import { StyleSheet, Text, View } from 'react-native';
import SearchResultCard from './SearchResultCard';

import { SearchResult } from '../_utils/advancedSearch';

interface SearchResultsListProps {
    results: SearchResult[];
    onPress: (category: any, index: number) => void;
    searchQuery: string;
}

export default function SearchResultsList({ results, onPress, searchQuery }: SearchResultsListProps) {
  if (!results || results.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>لا توجد نتائج مطابقة</Text>
      </View>
    );
  }

  return (
    <View>
      {results.map((result: SearchResult, index: number) => (
        <SearchResultCard
          key={index}
          result={result}
          onPress={onPress}
          searchQuery={searchQuery}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },
});
