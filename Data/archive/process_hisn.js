// const fs = require('fs');
// const path = require('path');

// const hisnData = require('./Data/hisn_almuslim.json');
// const outputDir = path.join(__dirname, 'Data', 'generated');

// if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
// }

// // Helper to extract count
// function getCount(text, footnote) {
//     const combined = (text + ' ' + (footnote || '')).toLowerCase();
    
//     if (combined.includes('مائة مرة') || combined.includes('100 مرة')) return 100;
//     if (combined.includes('ثلاثا وثلاثين') || combined.includes('33 مرة')) return 33;
//     if (combined.includes('أربعا وثلاثين') || combined.includes('34 مرة')) return 34;
    
//     if (combined.includes('عشر مرات') || combined.includes('10 مرات')) return 10;
//     if (combined.includes('سبع مرات') || combined.includes('7 مرات')) return 7;
//     if (combined.includes('أربع مرات') || combined.includes('4 مرات')) return 4;
//     if (combined.includes('ثلاث مرات') || combined.includes('3 مرات') || combined.includes('ثلاثاً')) return 3;
    
//     return 1;
// }

// // Helper to clean text
// function cleanText(text) {
//     return text.replace(/\s+/g, ' ').trim();
// }

// const categories = [];

// Object.entries(hisnData).forEach(([title, content], index) => {
//     // skip introduction and virtues sections if they are just text info
//     if (title === 'المقدمة' || title === 'فضل الذكر') return;

//     const zekrItems = content.text.map((zekrText, i) => {
//         const footnote = content.footnote && content.footnote[i] ? content.footnote[i] : '';
//         const count = getCount(zekrText, footnote);
        
//         // Simple heuristic: if footnote contains "رواه" or "أخرجه", it's likely a reference.
//         // If it starts with "من قال", it's likely a description/virtue.
//         // For simplicity, we'll put the whole footnote in 'reference' usually, unless it's clearly a virtue.
        
//         // Let's try to split.
//         let description = '';
//         let reference = footnote;

//         return {
//             id: i + 1,
//             zekr: cleanText(zekrText),
//             description: '', // Keeping description empty by default to avoid clutter, unless we parse virtue specifically
//             reference: cleanText(reference),
//             count: count
//         };
//     });

//     // Create filename
//     // Simple transliteration or ID based
//     const fileId = `hisn_${index}`;
//     const fileName = `${fileId}.json`;
    
//     fs.writeFileSync(path.join(outputDir, fileName), JSON.stringify(zekrItems, null, 2));

//     categories.push({
//         id: fileId,
//         title: title,
//         filename: fileName,
//         count: zekrItems.length
//     });
// });

// // Save the index of generated files
// fs.writeFileSync(path.join(outputDir, 'index_map.json'), JSON.stringify(categories, null, 2));

// console.log('Processed', categories.length, 'categories.');
// console.log('Map saved to index_map.json');
