import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { origin, escape } from '../templates/insights.mjs';
import { contactTopics } from '../templates/contact-topics.mjs';
import { updateChineseFonts } from './font-subsets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const pages = ['index.html','rednote-marketing/index.html','wechat-marketing/index.html','insights/index.html'];
for (const entry of fs.readdirSync(path.join(root,'insights'),{withFileTypes:true})) {
  if (entry.isDirectory() && fs.existsSync(path.join(root,'insights',entry.name,'index.html'))) pages.push(`insights/${entry.name}/index.html`);
}
const cache = new Map();
const cleanHtml = file => {
  if (!cache.has(file)) cache.set(file,fs.readFileSync(file,'utf8').replace(/<!--[\s\S]*?-->/g,''));
  return cache.get(file);
};
const idsOf = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
const pageUrls = new Set(pages.map(page=>origin+'/'+page.replace(/index\.html$/,'')));
if (sitemapUrls.length!==new Set(sitemapUrls).size) errors.push('Duplicate sitemap URLs');
for (const url of sitemapUrls) if (!pageUrls.has(url)) errors.push(`Sitemap points to an unknown page: ${url}`);

let linkCount = 0;
for (const page of pages) {
  const absolute = path.join(root,page);
  const html = cleanHtml(absolute);
  const expected = origin+'/'+page.replace(/index\.html$/,'');
  const redirect = html.match(/<meta http-equiv="refresh" content="0; url=([^"]+)"/)?.[1];
  const ids = idsOf(html);
  if (ids.length!==new Set(ids).size) errors.push(`${page}: duplicate IDs`);
  if ((html.match(/<h1\b/g)||[]).length!==1) errors.push(`${page}: expected exactly one H1`);
  if (!/<html\s+lang="en"/.test(html)) errors.push(`${page}: missing English language`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${page}: missing description`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (redirect) {
    const target = new URL(redirect,expected).href;
    if (canonical!==target || target===expected || !sitemapUrls.includes(target)) errors.push(`${page}: invalid redirect target or canonical`);
    if (!/<meta name="robots" content="noindex, follow"/.test(html)) errors.push(`${page}: redirect must be noindex`);
    if (sitemapUrls.includes(expected)) errors.push(`${page}: redirect should not appear in sitemap`);
  } else {
    if (canonical!==expected) errors.push(`${page}: incorrect canonical ${canonical}`);
    if (!sitemapUrls.includes(expected)) errors.push(`${page}: missing from sitemap (possibly stale generated article)`);
    if ((html.match(/cloud\.umami\.is\/script\.js/g)||[]).length!==1) errors.push(`${page}: expected one analytics script`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${page}: invalid JSON-LD`); }
  }
  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
    const target = new URL(match[1].replace(/&amp;/g,'&'),expected);
    if (target.origin!==origin) continue;
    if (target.searchParams.has('topic')) {
      const topic = target.searchParams.get('topic');
      if (!Object.hasOwn(contactTopics, topic) || target.pathname !== '/' || target.hash !== '#contact') errors.push(`${page}: invalid contact topic link`);
    }
    linkCount++;
    let file = path.join(root,decodeURIComponent(target.pathname));
    if (target.pathname.endsWith('/')) file = path.join(file,'index.html');
    if (!fs.existsSync(file)) { errors.push(`${page}: missing destination ${target.pathname}`); continue; }
    if (target.hash && file.endsWith('.html') && !idsOf(cleanHtml(file)).includes(decodeURIComponent(target.hash.slice(1)))) errors.push(`${page}: broken anchor ${target.pathname}${target.hash}`);
  }
  for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of match[1].split(/\s+/)) if (!ids.includes(id)) errors.push(`${page}: missing aria-labelledby target ${id}`);
  if (['index.html', 'rednote-marketing/index.html', 'wechat-marketing/index.html'].includes(page)) {
    const source = fs.readFileSync(absolute, 'utf8');
    if (updateChineseFonts(source) !== source) errors.push(`${page}: stale Chinese font subset; run npm run build`);
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)) {
      const [, href] = match;
      const event = href.endsWith('#contact') ? 'contact-click' : href.startsWith('mailto:') ? 'email-click' : href.startsWith('https://wa.me/') ? 'whatsapp-click' : null;
      if (event && (!match[0].includes(`data-umami-event="${event}"`) || !match[0].includes('data-umami-event-page=') || !match[0].includes('data-umami-event-placement='))) {
        errors.push(`${page}: missing click attribution for ${href}`);
      }
    }
  }
  if (page === 'index.html') {
    for (const topic of Object.keys(contactTopics)) if (!html.includes(`<option value="${topic}"`)) errors.push(`${page}: missing contact topic ${topic}`);
    const normalize = text => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    const visibleFaq = [...html.matchAll(/<details class="faq-item">\s*<summary>(.*?)<\/summary>\s*<div class="answer">(.*?)<\/div>/gs)];
    const faqSchema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => {
      try { return JSON.parse(match[1]); } catch { return null; }
    }).find(schema => schema?.['@type'] === 'FAQPage');
    if (faqSchema?.mainEntity?.length !== visibleFaq.length || visibleFaq.some(([, question, answer], index) => {
      const entity = faqSchema?.mainEntity?.[index];
      return !entity || normalize(question) !== normalize(entity.name) || normalize(answer) !== normalize(entity.acceptedAnswer?.text || '');
    })) errors.push(`${page}: FAQ structured data differs from visible answers`);
  }
  if (page.startsWith('insights/') && page!=='insights/index.html' && !redirect) {
    if (!html.includes('"@type":"BlogPosting"') || !html.includes('"@type":"BreadcrumbList"')) errors.push(`${page}: missing article or breadcrumb schema`);
    const slug = page.split('/')[1];
    const sourcePath = path.join(root, 'content', 'insights', `${slug}.md`);
    if (!fs.existsSync(sourcePath)) {
      errors.push(`${page}: generated article has no Markdown source`);
      continue;
    }
    if (!html.includes('class="short-answer"') || !html.includes('class="prose"')) errors.push(`${page}: missing article content`);
    if (Object.hasOwn(contactTopics, slug) && !html.includes(`href="/?topic=${slug}#contact"`)) errors.push(`${page}: missing contextual contact link`);
    const source = fs.readFileSync(sourcePath, 'utf8');
    const metadata = JSON.parse(source.match(/^---\n([\s\S]*?)\n---/)[1]);
    const relatedSection = html.match(/<section class="shell related-section"[\s\S]*?<\/section>/)?.[0] || '';
    for (const guide of metadata.relatedGuides || []) {
      if (!relatedSection.includes(`href="/insights/${guide.slug}/"`) || !relatedSection.includes(escape(guide.reason))) {
        errors.push(`${page}: stale reading path; run npm run build`);
      }
    }
    if (metadata.worksheet) {
      const { file } = metadata.worksheet;
      const expectedText = fs.readFileSync(path.join(root, 'content', 'worksheets', file), 'utf8').trim() + `\n\nGuide: ${origin}/insights/${slug}/\n`;
      const download = path.join(root, 'insights', 'assets', 'downloads', file);
      const visibleText = html.match(/<textarea id="worksheet-text"[^>]*>([\s\S]*?)<\/textarea>/)?.[1]
        ?.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      if (!fs.existsSync(download) || fs.readFileSync(download, 'utf8') !== expectedText || visibleText !== expectedText) errors.push(`${page}: worksheet source, preview and download differ`);
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`Checked ${pages.length} pages and ${linkCount} internal links/assets: metadata, schemas, anchors, analytics and sitemap are valid.`);
