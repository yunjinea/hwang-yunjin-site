const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const required = [
  'index.html', 'styles.css', 'script.js', 'article.css', 'article.js',
  'writing/index.html', 'writing/index.json', 'writing/feed.xml',
  'writing/see01-rolling-forecast/index.html', 'admin/index.html',
  '404.html', 'robots.txt', 'sitemap.xml'
];

const errors = [];
for (const relative of required) {
  if (!fs.existsSync(path.join(dist, relative))) errors.push(`missing: ${relative}`);
}

function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(full) : [full];
  });
}

if (fs.existsSync(dist)) {
  for (const file of filesIn(dist).filter(file => /\.(html|json|xml|js|css)$/.test(file))) {
    const value = fs.readFileSync(file, 'utf8');
    if (/\[\[FIGURE:[A-Z0-9_]+\]\]/.test(value)) errors.push(`unresolved figure token: ${path.relative(dist, file)}`);
    if (file.endsWith('.html')) {
      const ids = [...value.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length) errors.push(`duplicate id in ${path.relative(dist, file)}: ${[...new Set(duplicates)].join(', ')}`);
      const base = path.dirname(path.relative(dist, file));
      const references = [...value.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
      for (const reference of references) {
        if (/^(https?:|mailto:|data:|#)/.test(reference)) continue;
        const clean = reference.split(/[?#]/)[0];
        if (!clean) continue;
        let relative = clean.startsWith('/') ? clean.slice(1) : path.normalize(path.join(base, clean));
        if (!relative || relative.endsWith('/')) relative = `${relative}index.html`;
        const target = path.join(dist, relative);
        if (!fs.existsSync(target)) errors.push(`broken local reference in ${path.relative(dist, file)}: ${reference}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Build validation passed.');
