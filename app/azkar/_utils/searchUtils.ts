export const normalizeArabicText = (text) => {
    if (!text) return '';
    return text
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ىي]/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/[ًٌٍَُِّْ]/g, '')
        .toLowerCase()
        .trim();
};

export const searchInText = (searchTerm, targetText) => {
    const normalizedSearch = normalizeArabicText(searchTerm);
    const normalizedTarget = normalizeArabicText(targetText);
    return normalizedTarget.includes(normalizedSearch);
};

export default () => null;
