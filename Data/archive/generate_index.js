// const fs = require('fs');
// const path = require('path');

// const generatedDir = path.join(__dirname, 'Data', 'generated');
// const indexMapPath = path.join(generatedDir, 'index_map.json');
// const indexFile = path.join(generatedDir, 'index.js');

// const categories = require(indexMapPath);

// // Generate imports
// const imports = categories.map(cat => {
//     return `import ${cat.id} from './${cat.filename}';`;
// }).join('\n');

// // Generate export map
// const exportMap = categories.map(cat => {
//     return `{
//         id: '${cat.id}',
//         title: '${cat.title.replace(/'/g, "\\'")}',
//         count: ${cat.count},
//         data: ${cat.id}
//     }`;
// }).join(',\n    ');

// const fileContent = `
// ${imports}

// export const HISN_CATEGORIES = [
//     ${exportMap}
// ];
// `;

// fs.writeFileSync(indexFile, fileContent);
// console.log('Generated index.js with', categories.length, 'entries');
