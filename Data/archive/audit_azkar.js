const fs = require('fs');
const path = require('path');

const sabahPath = path.join(__dirname, 'Data', 'azkar_sabah.json');
const masaaPath = path.join(__dirname, 'Data', 'azkar_masaa.json');
const hisn28Path = path.join(__dirname, 'Data', 'generated', 'hisn_28.json');

const sabah = require(sabahPath);
const masaa = require(masaaPath);
const hisn = require(hisn28Path);

// Helper to normalize text for comparison
function normalize(text) {
    if (!text) return '';
    return text
        .replace(/[^\u0621-\u064A\s]/g, '') // Remove diacritics and punctuation
        .replace(/\s+/g, ' ')
        .trim();
}

// Helper to separate virtue and source from footnote
function parseFootnote(footnote) {
    // This is heuristic.
    // Common patterns for sources: "رواه ...", "أخرجه ...", "مسلم", "البخاري", "الترمذي", "أبو داود", "ابن ماجة", "أحمد", "النسائي"
    // Common patterns for virtues: "من قال", "من قرأ", "من فعل", "لم يضره", "كفاه", "وجبت له", "دخل الجنة"
    
    if (!footnote) return { description: '', reference: '' };

    let description = '';
    let reference = '';

    // Split by common delimiters if present, or analyze content
    // Many footnotes in Hisn file are like: "من قالها... أخرجه مسلم..."
    
    // Try to find the start of the citation
    const citationKeywords = ['أخرجه', 'رواه', 'مسلم', 'البخاري', 'الترمذي', 'أبو داود', 'النسائي', 'ابن ماجة', 'صحيح', 'حسن'];
    let splitIndex = -1;

    // improved split logic: find the *last* major block of source info, or the first occurrence if mixed?
    // Usually virtue comes first. "Whoever says this... (Al-Bukhari)"
    
    // Let's try to detect the First citation keyword.
    for (const kw of citationKeywords) {
        const idx = footnote.indexOf(kw);
        if (idx !== -1) {
            if (splitIndex === -1 || idx < splitIndex) {
                splitIndex = idx;
            }
        }
    }

    if (splitIndex > 5) { // If signature found and not at very start
        description = footnote.substring(0, splitIndex).trim();
        reference = footnote.substring(splitIndex).trim();
        
        // Clean up description trailing chars
        description = description.replace(/[-.،]+$/, '').trim();
    } else {
        // If no clear split, assume it's mostly reference if short, or mostly virtue if starts with "من"
        if (footnote.startsWith('من ') || footnote.startsWith('لم ')) {
            description = footnote;
            reference = 'حديث'; // Fallback
        } else {
            reference = footnote;
        }
    }
    
    return { description, reference };
}

function updateFile(targetItems, hisnItems, filename) {
    let updatedCount = 0;
    
    const updatedItems = targetItems.map(item => {
        const itemNorm = normalize(item.zekr).substring(0, 50); // First 50 chars sufficient
        
        // Find match in Hisn
        const match = hisnItems.find(h => {
             const hNorm = normalize(h.zekr);
             return hNorm.includes(itemNorm) || itemNorm.includes(hNorm.substring(0, 50));
        });

        if (match) {
            // Found a match. Let's see if we can improve Description and Reference.
            // In process_hisn.js, we put the whole footnote into 'reference' (mostly).
            // Let's re-parse that 'reference' from the MATCH (which holds the raw footnotes essentially)
            
            // Wait, in `hisn_28.json` (generated), `reference` field actually holds the raw footnote data from `hisn_almuslim.json`
            // because `process_hisn.js` did: `reference: cleanText(footnote)`.
            
            const rawFootnote = match.reference;
            const parsed = parseFootnote(rawFootnote);
            
            // Only update if the new description is 'substantial' and the old one is empty or weak
            if (parsed.description && parsed.description.length > 5) {
                item.description = parsed.description;
            }
            
            if (parsed.reference && parsed.reference.length > 2) {
                item.reference = parsed.reference;
            }
            
            // Allow manual overrides? 
            // For now, let's trust the parsing.
            updatedCount++;
        }
        return item;
    });
    
    fs.writeFileSync(filename, JSON.stringify(updatedItems, null, 2));
    console.log(`Updated ${updatedCount} items in ${path.basename(filename)}`);
}

console.log('Auditing Sabah...');
updateFile(sabah, hisn, sabahPath);

console.log('Auditing Masaa...');
updateFile(masaa, hisn, masaaPath);
