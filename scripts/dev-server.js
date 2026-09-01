const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const host = option('--host', '0.0.0.0');
const port = Number(option('--port', '4173'));
const root = path.resolve(__dirname, '..', 'dist');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'
};

function targetFor(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\//, '');
  const candidate = path.resolve(root, relative.endsWith('/') ? `${relative}index.html` : relative);
  if (!candidate.startsWith(`${root}${path.sep}`) && candidate !== path.join(root, 'index.html')) return null;
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  if (fs.existsSync(`${candidate}.html`)) return `${candidate}.html`;
  return null;
}

http.createServer((request, response) => {
  const target = targetFor(request.url || '/');
  const file = target || path.join(root, '404.html');
  response.statusCode = target ? 200 : 404;
  response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method === 'HEAD') return response.end();
  fs.createReadStream(file).pipe(response);
}).listen(port, host, () => {
  console.log(`Static preview ready on ${host}:${port}`);
});
