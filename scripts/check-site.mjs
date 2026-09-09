import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { origin } from '../templates/insights.mjs';

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
    linkCount++;
    let file = path.join(root,decodeURIComponent(target.pathname));
    if (target.pathname.endsWith('/')) file = path.join(file,'index.html');
    if (!fs.existsSync(file)) { errors.push(`${page}: missing destination ${target.pathname}`); continue; }
    if (target.hash && file.endsWith('.html') && !idsOf(cleanHtml(file)).includes(decodeURIComponent(target.hash.slice(1)))) errors.push(`${page}: broken anchor ${target.pathname}${target.hash}`);
  }
  for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of match[1].split(/\s+/)) if (!ids.includes(id)) errors.push(`${page}: missing aria-labelledby target ${id}`);
  if (page.startsWith('insights/') && page!=='insights/index.html' && !redirect) {
    if (!html.includes('"@type":"BlogPosting"') || !html.includes('"@type":"BreadcrumbList"')) errors.push(`${page}: missing article or breadcrumb schema`);
    const slug = page.split('/')[1];
    if (!fs.existsSync(path.join(root,'content','insights',`${slug}.md`))) errors.push(`${page}: generated article has no Markdown source`);
    if (!html.includes('class="short-answer"') || !html.includes('class="prose"')) errors.push(`${page}: missing article content`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`Checked ${pages.length} pages and ${linkCount} internal links/assets: metadata, schemas, anchors, analytics and sitemap are valid.`);
