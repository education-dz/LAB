const fs = require('fs');
const path = require('path');

function replaceRecursively(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceRecursively(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/bg-white/g, 'bg-surface');
      content = content.replace(/text-black/g, 'text-on-surface');
      content = content.replace(/text-\[\#1c1c18\]/g, 'text-on-surface');
      content = content.replace(/bg-\[\#fcf9f3\]/g, 'bg-surface');
      content = content.replace(/bg-\[\#1c1c18\]/g, 'bg-on-surface');
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceRecursively('./src');
console.log('Replaced all hardcoded colors with tokens');
