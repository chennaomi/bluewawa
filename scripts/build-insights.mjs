import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked, Renderer } from 'marked';
import { articlePage, indexPage, relatedLinks, redirectPage, origin } from '../templates/insights.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'content', 'insights');
const required = ['slug','title','description','category','categoryId','datePublished','dateModified','summary','takeaway','cover','coverAlt','ctaTitle','ctaText','service','serviceLabel'];
const categories = new Set(['china-market-planning','rednote','wechat']);
const articles = fs.readdirSync(sourceDir).filter(file=>file.endsWith('.md')).map(file=>{
  const source = fs.readFileSync(path.join(sourceDir,file),'utf8').replace(/\r\n/g,'\n');
  const match = source.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: expected JSON metadata between --- delimiters.`);
  const article = JSON.parse(match[1]);
  for (const field of required) if (typeof article[field] !== 'string' || !article[field].trim()) throw new Error(`${file}: missing ${field}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) throw new Error(`${file}: unsafe slug`);
  if (article.aliases !== undefined && (!Array.isArray(article.aliases) || article.aliases.some(alias => typeof alias !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias)))) throw new Error(`${file}: invalid aliases`);
  if (!categories.has(article.categoryId)) throw new Error(`${file}: unknown categoryId`);
  for (const key of ['datePublished','dateModified']) {
    const value = article[key];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value).toISOString().slice(0,10) !== value) throw new Error(`${file}: invalid ${key}`);
  }
  if (article.dateModified < article.datePublished) throw new Error(`${file}: modified date precedes publication`);
  if (!/^[a-z0-9-]+$/.test(article.cover) || !fs.existsSync(path.join(root,'insights','assets',`${article.cover}.svg`))) throw new Error(`${file}: missing cover`);
  const headings = [];
  const usedIds = new Set();
  const renderer = new Renderer();
  renderer.heading = function({tokens,depth}) {
    if (depth === 1) throw new Error(`${file}: use H2/H3 in the article; the template provides H1.`);
    const label = this.parser.parseInline(tokens);
    const text = label.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&');
    const base = text.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-') || 'section';
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    headings.push({id,text,depth});
    return `<h${depth} id="${id}">${label}</h${depth}>\n`;
  };
  renderer.table = function(token) {
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable comparison table">${Renderer.prototype.table.call(this,token)}</div>`;
  };
  const markdown = new Marked({renderer,gfm:true,async:false});
  const html = markdown.parse(match[2]);
  const wordCount = html.replace(/<[^>]*>/g,' ').trim().split(/\s+/).length;
  return {...article,html,headings,readingTime:Math.max(1,Math.ceil(wordCount/220))};
}).sort((a,b)=>{
  if (a.slug==='rednote-vs-wechat') return -1;
  if (b.slug==='rednote-vs-wechat') return 1;
  return b.datePublished.localeCompare(a.datePublished) || a.slug.localeCompare(b.slug);
});

if (new Set(articles.map(article=>article.slug)).size !== articles.length) throw new Error('Duplicate article slugs');
if (articles.length < 1) throw new Error('At least one article is required');
const routes = new Set(['assets', ...articles.map(article => article.slug)]);
for (const article of articles) for (const alias of article.aliases || []) {
  if (routes.has(alias)) throw new Error(`Duplicate or reserved article alias: ${alias}`);
  routes.add(alias);
}
// Source Markdown is trusted repository content, never visitor-supplied input.
for (const article of articles) {
  const directory = path.join(root,'insights',article.slug);
  fs.mkdirSync(directory,{recursive:true});
  fs.writeFileSync(path.join(directory,'index.html'),articlePage(article,articles));
  for (const alias of article.aliases || []) {
    const aliasDirectory = path.join(root,'insights',alias);
    fs.mkdirSync(aliasDirectory,{recursive:true});
    fs.writeFileSync(path.join(aliasDirectory,'index.html'),redirectPage(article));
  }
}
fs.writeFileSync(path.join(root,'insights','index.html'),indexPage(articles));

const pages = [{file:'index.html',category:null},{file:'rednote-marketing/index.html',category:'rednote'},{file:'wechat-marketing/index.html',category:'wechat'}];
for (const page of pages) {
  const file = path.join(root,page.file);
  const source = fs.readFileSync(file,'utf8');
  const marker = /<!-- INSIGHTS:START -->[\s\S]*?<!-- INSIGHTS:END -->/;
  if (!marker.test(source)) throw new Error(`${page.file}: missing insights insertion markers`);
  fs.writeFileSync(file,source.replace(marker,`<!-- INSIGHTS:START -->\n${relatedLinks(articles,page.category)}\n<!-- INSIGHTS:END -->`));
}

const latestDate = articles.reduce((latest,article)=>article.dateModified > latest ? article.dateModified : latest,'2026-09-09');
const sitemapEntries = [
  {url:'/',date:'2026-09-09'},
  {url:'/rednote-marketing/',date:'2026-09-09'},
  {url:'/wechat-marketing/',date:'2026-09-09'},
  {url:'/insights/',date:latestDate},
  ...articles.map(article=>({url:`/insights/${article.slug}/`,date:article.dateModified}))
];
fs.writeFileSync(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map(entry=>`  <url><loc>${origin}${entry.url}</loc><lastmod>${entry.date}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Built Insights index, ${articles.length} articles, service links and sitemap.`);
