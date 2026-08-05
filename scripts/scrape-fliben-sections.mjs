/** Scrape fliben.ru articles, projects, homepage sections */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "fliben-scraped");

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

function decodeHtml(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImages(html) {
  const imgs = new Set();
  for (const m of html.matchAll(/(?:src|data-original)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi)) {
    imgs.add(m[1].replace(/^\/\//, "https://"));
  }
  for (const m of html.matchAll(/background-image:\s*url\(['"]?(https?:\/\/[^'")]+)['"]?\)/gi)) {
    imgs.add(m[1].replace(/^\/\//, "https://"));
  }
  return [...imgs];
}

function extractLinks(html, prefix) {
  const links = new Map();
  for (const m of html.matchAll(new RegExp(`href=["'](${prefix}[^"'#?]+)["']`, "gi"))) {
    const href = m[1];
    if (!links.has(href)) links.set(href, null);
  }
  return [...links.keys()];
}

async function fetchHtml(path) {
  const url = `https://fliben.ru${path}`;
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return { url: res.url, html: await res.text() };
}

function parseTildaRecords(html) {
  const records = [];
  const blocks = html.split('id="rec');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const id = block.match(/^(\d+)/)?.[1];
    const headings = [...block.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((m) => decodeHtml(m[1])).filter(Boolean);
    const texts = [...block.matchAll(/field=["']text["'][^>]*>([\s\S]*?)<\/div>/gi)].map((m) => decodeHtml(m[1])).filter((t) => t.length > 20);
    const imgs = extractImages(block);
    if (headings.length || texts.length || imgs.length) {
      records.push({ id, headings, texts: texts.slice(0, 8), images: imgs.slice(0, 6) });
    }
  }
  return records;
}

function parseArticleCards(html) {
  const cards = [];
  // Tilda feed / grid cards
  for (const m of html.matchAll(/href="(\/articles\/[^"]+)"[\s\S]{0,2000}?<[^>]+>([^<]{5,120})</gi)) {
    cards.push({ href: m[1], title: decodeHtml(m[2]) });
  }
  const uniq = new Map();
  for (const c of cards) if (!uniq.has(c.href)) uniq.set(c.href, c);
  return [...uniq.values()];
}

function parseProjectCards(html) {
  const cards = [];
  for (const m of html.matchAll(/href="(\/projects\/[^"]+)"[\s\S]{0,3000}?t-name[^>]*>([^<]+)</gi)) {
    cards.push({ href: m[1], title: decodeHtml(m[2]) });
  }
  if (cards.length === 0) {
    for (const m of html.matchAll(/href="(\/projects\/[^"]+)"/g)) {
      cards.push({ href: m[1], title: m[1].split("/").pop() });
    }
  }
  const uniq = new Map();
  for (const c of cards) if (!uniq.has(c.href)) uniq.set(c.href, c);
  return [...uniq.values()];
}

async function scrapeArticleDetail(path) {
  const { html } = await fetchHtml(path);
  const title = decodeHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const records = parseTildaRecords(html);
  const allText = records.flatMap((r) => [...r.headings, ...r.texts]).join("\n\n");
  const images = extractImages(html).filter((u) => u.includes("tildacdn"));
  return { slug: path.replace("/articles/", ""), path, title, body: allText, images: images.slice(0, 8), records };
}

async function scrapeProjectDetail(path) {
  const { html } = await fetchHtml(path);
  const title = decodeHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const priceMatch = html.match(/(\d[\d\s]{3,})\s*₽/);
  const priceRub = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, ""), 10) : null;
  const records = parseTildaRecords(html);
  const allText = records.flatMap((r) => [...r.headings, ...r.texts]).join("\n\n");
  const images = extractImages(html).filter((u) => u.includes("tildacdn"));
  return { slug: path.replace("/projects/", ""), path, title, priceRub, body: allText, images: images.slice(0, 12), records };
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  const home = await fetchHtml("/");
  writeFileSync(join(OUT, "home-links.json"), JSON.stringify(extractLinks(home.html, "/"), null, 2));

  const articlesIndex = await fetchHtml("/articles");
  const articleCards = parseArticleCards(articlesIndex.html);
  writeFileSync(join(OUT, "articles-index.json"), JSON.stringify(articleCards, null, 2));

  const articles = [];
  for (const card of articleCards.slice(0, 30)) {
    try {
      console.log("article", card.href);
      articles.push(await scrapeArticleDetail(card.href));
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error("skip", card.href, e.message);
    }
  }
  writeFileSync(join(OUT, "articles.json"), JSON.stringify(articles, null, 2));

  const projectsIndex = await fetchHtml("/projects");
  const projectCards = parseProjectCards(projectsIndex.html);
  writeFileSync(join(OUT, "projects-index.json"), JSON.stringify(projectCards, null, 2));

  const projects = [];
  for (const card of projectCards.slice(0, 20)) {
    try {
      console.log("project", card.href);
      projects.push(await scrapeProjectDetail(card.href));
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error("skip", card.href, e.message);
    }
  }
  writeFileSync(join(OUT, "projects.json"), JSON.stringify(projects, null, 2));

  // Homepage ready solutions / systems keywords
  const homeRecords = parseTildaRecords(home.html);
  const ready = homeRecords.filter((r) =>
    [...r.headings, ...r.texts].some((t) =>
      /готов|решени|thermo|slim|fiat|систем/i.test(t)
    )
  );
  writeFileSync(join(OUT, "home-sections.json"), JSON.stringify({ links: extractLinks(home.html, "/"), ready }, null, 2));

  console.log("done", { articles: articles.length, projects: projects.length, ready: ready.length });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
