import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "fliben-scraped");
mkdirSync(OUT, { recursive: true });

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

function decodeHtml(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPage(path) {
  const res = await fetch(`https://fliben.ru${path}`, { headers: UA });
  const html = await res.text();
  writeFileSync(join(OUT, path.replace(/\//g, "_") + ".html"), html);
  return html;
}

function findAll(regex, html) {
  return [...html.matchAll(regex)].map((m) => m[1] ?? m[0]);
}

const articlesHtml = await fetchPage("/articles");
const projectsHtml = await fetchPage("/projects");
const homeHtml = await fetchPage("/");
const systemsHtml = await fetchPage("/kompleksnaya_systema_ventilyacii");

// Article links — many Tilda patterns
const articlePaths = new Set();
for (const m of articlesHtml.matchAll(/href=["'](\/articles\/[^"'#?]+)["']/gi)) {
  articlePaths.add(m[1]);
}
for (const m of articlesHtml.matchAll(/href=["'](https:\/\/fliben\.ru\/articles\/[^"'#?]+)["']/gi)) {
  articlePaths.add(m[1].replace("https://fliben.ru", ""));
}
console.log("article paths", [...articlePaths]);

const projectPaths = new Set();
for (const m of projectsHtml.matchAll(/href=["'](\/projects\/[^"'#?]+)["']/gi)) {
  projectPaths.add(m[1]);
}
for (const m of projectsHtml.matchAll(/href=["'](https:\/\/fliben\.ru\/projects\/[^"'#?]+)["']/gi)) {
  projectPaths.add(m[1].replace("https://fliben.ru", ""));
}
console.log("project paths", [...projectPaths]);

// Tilda feed JSON
for (const label of ["articles", "projects"]) {
  const html = label === "articles" ? articlesHtml : projectsHtml;
  const feed = html.match(/t_feed_init\('(\d+)'/);
  console.log(label, "feed id", feed?.[1]);
  const posts = html.match(/"post":\s*\{[\s\S]*?"title":\s*"([^"]+)"/g);
  console.log(label, "post snippets", posts?.length ?? 0);
}

// Search for JSON arrays in page
const jsonCandidates = projectsHtml.match(/window\.__[\w$]+\s*=\s*(\[[\s\S]{100,5000}?\]);/g);
console.log("json candidates", jsonCandidates?.length);

// Headings on projects
const projHeadings = findAll(/<h[1-3][^>]*>([^<]{3,120})</gi, projectsHtml).map(decodeHtml);
console.log("project headings sample", projHeadings.slice(0, 25));

// Home systems blocks
const homeHeadings = findAll(/<h[1-3][^>]*>([^<]{3,120})</gi, homeHtml).map(decodeHtml);
console.log("home headings", homeHeadings.filter((h) => /готов|систем|thermo|slim|fiat|проект/i.test(h)));

const sysHeadings = findAll(/<h[1-3][^>]*>([^<]{3,120})</gi, systemsHtml).map(decodeHtml);
console.log("systems page headings", sysHeadings.slice(0, 40));
