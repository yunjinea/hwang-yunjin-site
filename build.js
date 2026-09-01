#!/usr/bin/env node
/*
 * AFTER THE NUMBERS — static publishing pipeline
 * Markdown one-file publishing for Cloudflare Pages.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'content', 'posts');
const FIGURES = path.join(ROOT, 'figures');
const SITE_URL = (process.env.SITE_URL || 'https://hwang-yunjin-site.pages.dev').replace(/\/$/, '');
const SERIES = {
  read: { label: 'READ', name: '분석', description: '숫자가 만들어지고 달라지는 흐름을 읽습니다.' },
  decide: { label: 'DECIDE', name: '판단', description: '숫자를 선택과 의사결정으로 연결합니다.' },
  control: { label: 'CONTROL', name: '관리', description: '목표와 실적의 차이를 다음 행동으로 바꿉니다.' }
};

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function cleanText(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function safeUrl(value = '') {
  const raw = String(value).trim();
  if (/^(https?:\/\/|mailto:|\/)/i.test(raw)) return esc(raw);
  return '#';
}

function parseScalar(value) {
  const raw = value.trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).replace(/\\([\\"'])/g, '$1');
  }
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null') return null;
  return raw;
}

function parsePost(filePath) {
  const source = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${path.basename(filePath)}: YAML frontmatter가 필요합니다.`);
  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) throw new Error(`${path.basename(filePath)}: 지원하지 않는 frontmatter 형식 — ${line}`);
    data[field[1]] = parseScalar(field[2]);
  }

  const required = ['title', 'date'];
  for (const key of required) if (!data[key]) throw new Error(`${path.basename(filePath)}: ${key} 필드가 필요합니다.`);
  const legacy = { work: 'read', see: 'read', explain: 'read', investing: 'decide', life: 'control' };
  const series = String(data.series || data.category || 'read').toLowerCase();
  data.series = SERIES[series] ? series : (legacy[series] || 'read');
  data.slug = String(data.slug || path.basename(filePath, path.extname(filePath)).replace(/^\d{4}-\d{2}-\d{2}-/, ''))
    .toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!data.slug) throw new Error(`${path.basename(filePath)}: 올바른 slug가 필요합니다.`);
  data.date = String(data.date).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${path.basename(filePath)}: date는 YYYY-MM-DD 형식이어야 합니다.`);
  data.draft = data.draft === true;
  data.article_index = String(data.article_index || '01').padStart(2, '0');
  data.read_time = String(data.read_time || '5 MIN READ');
  data.summary = String(data.summary || data.excerpt || '숫자 뒤의 변화와 의사결정을 기록합니다.');
  data.excerpt = String(data.excerpt || data.summary);
  data.series_label = String(data.series_label || data.category_label || `${SERIES[data.series].label} / ${data.article_index}`);
  data.body = match[2].trim();
  data.sourceFile = path.basename(filePath);
  data.url = `/writing/${data.slug}/`;
  return data;
}

function renderInline(value) {
  const code = [];
  let html = esc(value).replace(/`([^`]+)`/g, (_, text) => {
    code.push(`<code>${text}</code>`);
    return `\u0000CODE${code.length - 1}\u0000`;
  });
  html = html
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => `<a href="${safeUrl(href)}">${text}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  return html.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => code[Number(index)]);
}

function renderFigure(token, number, sourceFile) {
  if (!/^[A-Z0-9_]+$/.test(token)) throw new Error(`${sourceFile}: 잘못된 FIGURE 토큰 ${token}`);
  const file = path.join(FIGURES, `${token}.html`);
  if (!fs.existsSync(file)) throw new Error(`${sourceFile}: FIGURE 템플릿을 찾을 수 없습니다 — ${token}`);
  return fs.readFileSync(file, 'utf8').trim().replace(
    /(<figcaption>\s*<span>)[^<]*(<\/span>)/,
    `$1FIGURE ${String(number).padStart(2, '0')}$2`
  );
}

function renderMarkdown(markdown, sourceFile) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let figureNumber = 0;
  const isBlock = line => /^(#{2,3})\s+|^>\s?|^[-*]\s+|^\d+\.\s+|^\[\[FIGURE:[A-Z0-9_]+\]\]$|^---$/.test(line.trim());

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) { i += 1; continue; }

    const token = line.match(/^\[\[FIGURE:([A-Z0-9_]+)\]\]$/);
    if (token) {
      out.push(renderFigure(token[1], ++figureNumber, sourceFile));
      i += 1;
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }
    if (line === '---') {
      out.push('<hr>');
      i += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quote.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      out.push(`<blockquote><p>${renderInline(quote.join(' '))}</p></blockquote>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(`<li>${renderInline(lines[i].trim().replace(/^[-*]\s+/, ''))}</li>`);
        i += 1;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${renderInline(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`);
        i += 1;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    const paragraph = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !isBlock(lines[i])) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    out.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
  }
  return { html: out.join('\n'), figureCount: figureNumber };
}

function jsonForHtml(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

function pageHead({ title, description, canonical, type = 'website' }) {
  return `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#071120">
  <link rel="canonical" href="${esc(canonical)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta property="og:site_name" content="AFTER THE NUMBERS">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600&family=Instrument+Sans:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet">`;
}

function articlePage(post) {
  const rendered = renderMarkdown(post.body, post.sourceFile);
  if (rendered.figureCount < 2) throw new Error(`${post.sourceFile}: 공개 글에는 FIGURE 도식이 최소 2개 필요합니다.`);
  const title = `${post.title} — AFTER THE NUMBERS`;
  const canonical = `${SITE_URL}${post.url}`;
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'ko-KR',
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'AFTER THE NUMBERS' },
    publisher: { '@type': 'Organization', name: 'AFTER THE NUMBERS' }
  };
  return `<!doctype html>
<html lang="ko" class="no-js">
<head>
${pageHead({ title, description: post.summary, canonical, type: 'article' })}
  <meta property="article:published_time" content="${post.date}">
  <meta property="article:section" content="${SERIES[post.series].label}">
  <link rel="stylesheet" href="/article.css">
  <script>document.documentElement.classList.replace('no-js','js')</script>
  <script type="application/ld+json">${jsonForHtml(structured)}</script>
  <script src="/article.js" defer></script>
</head>
<body>
<a class="skip-link" href="#article-content">본문으로 건너뛰기</a>
<div class="reading-progress" id="reading-progress" aria-hidden="true"></div>
<main class="article-shell" id="article-content">
  <nav class="post-nav" aria-label="글 탐색"><a href="/">AFTER THE NUMBERS</a><a href="/writing/?series=${post.series}">WRITING / ${SERIES[post.series].label}</a></nav>
  <header class="article-hero">
    <aside class="hero-index"><strong>${esc(post.article_index)}</strong><div>WRITING<br>${SERIES[post.series].label}</div></aside>
    <div class="hero-copy"><span class="kicker">${esc(post.series_label)}</span><h1>${esc(post.title)}</h1><p class="dek">${esc(post.summary)}</p><div class="meta"><time datetime="${post.date}">${post.date.replaceAll('-', '.')}</time><span>${esc(post.read_time)}</span><span>${SERIES[post.series].label}</span></div></div>
  </header>
  <section class="article-layout">
    <aside class="article-aside"><div class="article-aside-inner"><b>EDITORIAL NOTE</b><p>업무에서 경험하고 배운 내용을 공개 가능한 범위에서 정리합니다.</p><p>NO CONFIDENTIAL COMPANY DATA</p></div></aside>
    <article class="article-body">${rendered.html}</article>
  </section>
  <footer class="article-footer"><small>AFTER THE NUMBERS / WRITING</small><a class="back" href="/writing/">← BACK TO WRITING</a></footer>
</main>
</body>
</html>`;
}

function archiveCard(post, index) {
  return `<article class="archive-card" data-series="${post.series}" data-index="${index}">
    <a href="${post.url}">
      <div class="archive-card-index"><span>${String(index + 1).padStart(2, '0')}</span><small>${SERIES[post.series].label}</small></div>
      <div class="archive-card-copy"><p>${esc(post.series_label)}</p><h2>${esc(post.title)}</h2><span>${esc(post.excerpt)}</span></div>
      <div class="archive-card-meta"><time datetime="${post.date}">${post.date.replaceAll('-', '.')}</time><small>${esc(post.read_time)}</small><b aria-hidden="true">↗</b></div>
    </a>
  </article>`;
}

function archivePage(posts) {
  const filters = [['all', 'ALL'], ...Object.entries(SERIES).map(([key, value]) => [key, value.label])];
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AFTER THE NUMBERS — Writing',
    url: `${SITE_URL}/writing/`,
    inLanguage: 'ko-KR',
    hasPart: posts.map(post => ({ '@type': 'Article', headline: post.title, url: `${SITE_URL}${post.url}` }))
  };
  return `<!doctype html>
<html lang="ko" class="no-js">
<head>
${pageHead({ title: 'WRITING — AFTER THE NUMBERS', description: '제조업 경영분석과 FP&A를 READ, DECIDE, CONTROL의 세 가지 흐름으로 기록합니다.', canonical: `${SITE_URL}/writing/` })}
  <link rel="alternate" type="application/rss+xml" title="AFTER THE NUMBERS Writing" href="/writing/feed.xml">
  <link rel="stylesheet" href="/writing.css">
  <script>document.documentElement.classList.replace('no-js','js')</script>
  <script type="application/ld+json">${jsonForHtml(structured)}</script>
  <script src="/writing-archive.js" defer></script>
</head>
<body>
<a class="skip-link" href="#archive-list">글 목록으로 건너뛰기</a>
<header class="archive-topbar"><a href="/">AFTER THE NUMBERS</a><nav aria-label="페이지 탐색"><a href="/#case">CASES</a><a href="/#about">ABOUT</a></nav></header>
<main>
  <header class="archive-hero">
    <div><span>05 / WRITING</span><p>NUMBERS → CONTEXT → DECISION</p></div>
    <h1>READ THE<br><em>SIGNAL.</em></h1>
    <p>제조업 경영분석과 FP&amp;A를 네 가지 질문으로 기록합니다. 숫자를 전망하고, 차이를 설명하고, 선택과 관리로 연결합니다.</p>
  </header>
  <nav class="archive-filters" aria-label="시리즈 필터" role="tablist">
    ${filters.map(([key, label], index) => `<button type="button" role="tab" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-filter="${key}"><span>${String(index + 1).padStart(2, '0')}</span>${label}</button>`).join('')}
  </nav>
  <section class="archive-list" id="archive-list" aria-live="polite">
    ${posts.map(archiveCard).join('\n')}
  </section>
  <div class="archive-empty" id="archive-empty" hidden><strong>NO STORIES YET</strong><p>이 시리즈의 글을 준비하고 있습니다.</p></div>
  <button class="load-more" id="load-more" type="button" hidden>LOAD MORE <span>↓</span></button>
</main>
<footer class="archive-footer"><span>© 2026 AFTER THE NUMBERS</span><a href="mailto:yjiness@gmail.com">yjiness@gmail.com</a></footer>
</body>
</html>`;
}

function rss(posts) {
  const items = posts.map(post => `<item><title>${esc(post.title)}</title><link>${SITE_URL}${post.url}</link><guid>${SITE_URL}${post.url}</guid><pubDate>${new Date(`${post.date}T00:00:00+09:00`).toUTCString()}</pubDate><description>${esc(post.summary)}</description></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>AFTER THE NUMBERS</title><link>${SITE_URL}/writing/</link><description>제조업 경영분석과 FP&amp;A를 숫자 뒤의 변화와 의사결정으로 연결합니다.</description><language>ko</language>${items}</channel></rss>`;
}

function homePage(posts) {
  const source = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const latest = posts[0];
  if (!latest) return source.replace(/<a class="hero-writing-link"[\s\S]*?<\/a>/, '');
  const shortTitle = latest.short_title || latest.title;
  const label = latest.series_label.split('·')[0].trim();
  const link = `<a class="hero-writing-link" data-latest-writing href="${latest.url}"><small>LATEST WRITING · ${esc(label)}</small><span>${esc(shortTitle)}</span><b aria-hidden="true">↗</b></a>`;
  return source.replace(/<a class="hero-writing-link"[\s\S]*?<\/a>/, link);
}

function write(relative, content) {
  const target = path.join(OUT, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function copy(relative) {
  const source = path.join(ROOT, relative);
  if (!fs.existsSync(source)) return;
  const target = path.join(OUT, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const files = fs.existsSync(CONTENT) ? fs.readdirSync(CONTENT).filter(file => file.endsWith('.md')).sort() : [];
  const allPosts = files.map(file => parsePost(path.join(CONTENT, file)));
  const posts = allPosts.filter(post => !post.draft).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'ko'));
  const slugs = new Set();
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`중복 slug: ${post.slug}`);
    slugs.add(post.slug);
    write(`writing/${post.slug}/index.html`, articlePage(post));
  }

  const index = posts.map(post => ({
    title: post.title,
    date: post.date,
    series: post.series,
    category: post.series,
    series_label: post.series_label,
    category_label: post.series_label,
    label: post.series_label,
    article_index: post.article_index,
    read_time: post.read_time,
    summary: post.summary,
    excerpt: post.excerpt,
    draft: false,
    featured_image: post.featured_image || '',
    slug: post.slug,
    url: post.url
  }));

  ['styles.css', 'script.js', 'article.css', 'article.js', 'writing.css', 'writing-archive.js', 'favicon.svg', '404.html', '_headers', '_redirects', 'admin', 'uploads'].forEach(copy);
  write('index.html', homePage(posts));
  write('writing/index.html', archivePage(posts));
  write('writing/index.json', JSON.stringify(index, null, 2) + '\n');
  write('writing/feed.xml', rss(posts));
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  const urls = ['/', '/writing/', ...posts.map(post => post.url)];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${SITE_URL}${url}</loc></url>`).join('\n')}\n</urlset>\n`);

  console.log(`AFTER THE NUMBERS build complete: ${posts.length} published / ${allPosts.length - posts.length} draft`);
}

try {
  build();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}
