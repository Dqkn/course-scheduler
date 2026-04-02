const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(f => {
    f = path.join(dir, f);
    if (fs.statSync(f).isDirectory()) {
      results = results.concat(walk(f));
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      results.push(f);
    }
  });
  return results;
}

const allFiles = walk('src');
const uiDir = 'src/app/components/ui';
const uiFiles = fs.existsSync(uiDir) 
  ? fs.readdirSync(uiDir).filter(f => fs.statSync(path.join(uiDir, f)).isFile()) 
  : [];

const results = {};

uiFiles.forEach(uiFile => {
  const base = path.basename(uiFile, path.extname(uiFile));
  let externalRefs = [];
  let internalRefs = [];
  
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const isUiFile = file.includes(`components${path.sep}ui`) || file.includes('components/ui');
    
    // Check various common import patterns
    const patterns = [
      `components/ui/${base}`,
      `/ui/${base}`,
      `@/components/ui/${base}`,
      `"./${base}"`,
      `'./${base}'`,
      `\`./${base}\``
    ];
    
    const isRef = patterns.some(p => content.includes(p));
    
    if (isRef) {
      if (isUiFile && file !== path.join(uiDir, uiFile)) {
        internalRefs.push(path.basename(file));
      } else if (!isUiFile) {
        externalRefs.push(path.basename(file));
      }
    }
  });
  
  results[uiFile] = { externalRefs, internalRefs };
});

fs.writeFileSync('ui_analysis.json', JSON.stringify(results, null, 2));
console.log('Analysis complete. Results written to ui_analysis.json');
