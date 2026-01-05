import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = 'AZKARI_SEARCH_HISTORY_V2';
const MAX_HISTORY_ITEMS = 15;

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;

const LETTER_NORMALIZATION_MAP = {
    'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا',
    'ة': 'ه',
    'ى': 'ي',
    'ؤ': 'و',
    'ئ': 'ي',
};

export interface MatchDetails {
    item: any;
    index: number;
    matchedIn: string[];
    score: number;
    relevance: number;
}

export interface SearchResult {
    category: any;
    matchedItems: MatchDetails[];
    categoryTitleMatch: boolean;
    score: number;
    totalMatches: number;
}

export const normalizeArabicForSearch = (text: string): string => {
    if (!text) return '';
    
    let normalized = text
        .toLowerCase()
        .replace(ARABIC_DIACRITICS, '')
        .trim();
    
    for (const [original, replacement] of Object.entries(LETTER_NORMALIZATION_MAP)) {
        normalized = normalized.split(original as keyof typeof LETTER_NORMALIZATION_MAP).join(replacement);
    }
    
    return normalized;
};

export const saveSearchHistory = async (query: string): Promise<void> => {
    if (!query || query.trim().length < 2) return;
    
    try {
        const trimmedQuery = query.trim();
        const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        let history: string[] = stored ? JSON.parse(stored) : [];
        
        history = history.filter((item: string) => item.toLowerCase() !== trimmedQuery.toLowerCase());
        history.unshift(trimmedQuery);
        history = history.slice(0, MAX_HISTORY_ITEMS);
        
        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (_error) {
        console.error('Failed to save search history:', _error);
    }
};

export const getSearchHistory = async (): Promise<string[]> => {
    try {
        const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (_error) {
        console.error('Failed to load search history:', _error);
        return [];
    }
};

export const clearSearchHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (_error) {
        console.error('Failed to clear search history:', _error);
    }
};

export const removeSearchHistoryItem = async (query: string): Promise<void> => {
    try {
        const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        if (!stored) return;
        
        let history: string[] = JSON.parse(stored);
        history = history.filter((item: string) => item !== query);
        
        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (_error) {
        console.error('Failed to remove search history item:', _error);
    }
};

const calculateMatchScore = (text: string, query: string, fieldWeight: number): number => {
    const normalizedText = normalizeArabicForSearch(text);
    const normalizedQuery = normalizeArabicForSearch(query);
    
    if (!normalizedText || !normalizedQuery) return 0;
    
    if (normalizedText === normalizedQuery) return fieldWeight * 2;
    
    if (normalizedText.startsWith(normalizedQuery)) return fieldWeight * 1.5;
    
    if (normalizedText.includes(normalizedQuery)) return fieldWeight;
    
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 1);
    let partialScore = 0;
    for (const word of queryWords) {
        if (normalizedText.includes(word)) {
            partialScore += fieldWeight * 0.3;
        }
    }
    
    return partialScore;
};

export const deepSearchAzkar = (searchQuery: string, allCategories: any[]): SearchResult[] => {
    if (!searchQuery || searchQuery.trim().length < 2) {
        return [];
    }

    const results: SearchResult[] = [];

    for (const category of allCategories) {
        if (!category || !category.title) continue;

        const categoryMatches: SearchResult = {
            category: category,
            matchedItems: [],
            categoryTitleMatch: false,
            score: 0,
            totalMatches: 0
        };

        const titleScore = calculateMatchScore(category.title, searchQuery, 100);
        if (titleScore > 0) {
            categoryMatches.categoryTitleMatch = true;
            categoryMatches.score += titleScore;
        }

        if (category.data && Array.isArray(category.data)) {
            for (let index = 0; index < category.data.length; index++) {
                const item = category.data[index];
                if (!item || (!item.zekr && !item.title)) continue;

                let itemScore = 0;
                const matchDetails: MatchDetails = {
                    item: item,
                    index: index,
                    matchedIn: [],
                    score: 0,
                    relevance: 0
                };

                const zekrScore = calculateMatchScore(item.zekr || item.title || '', searchQuery, 50);
                if (zekrScore > 0) {
                    matchDetails.matchedIn.push('zekr');
                    itemScore += zekrScore;
                }

                const descScore = calculateMatchScore(item.description || '', searchQuery, 30);
                if (descScore > 0) {
                    matchDetails.matchedIn.push('description');
                    itemScore += descScore;
                }

                const refScore = calculateMatchScore(item.reference || '', searchQuery, 20);
                if (refScore > 0) {
                    matchDetails.matchedIn.push('reference');
                    itemScore += refScore;
                }

                if (itemScore > 0) {
                    matchDetails.score = itemScore;
                    matchDetails.relevance = Math.min(100, Math.round((itemScore / 100) * 100));
                    categoryMatches.matchedItems.push(matchDetails);
                    categoryMatches.score += itemScore;
                    categoryMatches.totalMatches++;
                }
            }
        }

        if (categoryMatches.categoryTitleMatch || categoryMatches.matchedItems.length > 0) {
            categoryMatches.matchedItems.sort((a, b) => b.score - a.score);
            results.push(categoryMatches);
        }
    }

    results.sort((a, b) => {
        if (a.categoryTitleMatch && !b.categoryTitleMatch) return -1;
        if (!a.categoryTitleMatch && b.categoryTitleMatch) return 1;
        return b.score - a.score;
    });

    return results;
};

export default () => null;
