/**
 * Full scrape fliben.ru → data/*.json + public/images/fliben-scraped/*
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "data");
const PUBLIC = join(__dirname, "..", "public", "images", "fliben-scraped");
mkdirSync(DATA, { recursive: true });
mkdirSync(PUBLIC, { recursive: true });

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

function decodeHtml(s) {
  if (!s) return "";
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function slugify(path) {
  return path.replace(/^\//, "").replace(/\/$/, "") || "home";
}

function parseRub(text) {
  const m = text?.match(/([\d\s]+)\s*₽/);
  return m ? parseInt(m[1].replace(/\s/g, ""), 10) : null;
}

function fieldTexts(html) {
  return [...html.matchAll(/field='tn_text_[^']+'>([^<]+)/g)].map((m) =>
    decodeHtml(m[1]),
  );
}

async function fetchText(url) {
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function downloadImage(url, filename) {
  if (!url || url.includes("/lib/icons/")) return url;
  try {
    const res = await fetch(url, { headers: UA });
    if (!res.ok) return url;
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = url.match(/\.(webp|jpg|jpeg|png)/i)?.[1]?.toLowerCase() ?? "jpg";
    const local = `${filename}.${ext}`;
    writeFileSync(join(PUBLIC, local), buf);
    return `/images/fliben-scraped/${local}`;
  } catch {
    return url;
  }
}

async function scrapeArticles() {
  const feeduid = "834501595891";
  const recid = "2231302561";
  const data = await fetchJson(
    `https://feeds.tildacdn.com/api/getfeed/?feeduid=${feeduid}&recid=${recid}&size=100`,
  );
  const articles = [];
  for (const post of data.posts ?? []) {
    const slug = slugify(new URL(post.url).pathname);
    let body = "";
    try {
      const pd = await fetchJson(
        `https://feeds.tildacdn.com/api/getpost/?postuid=${post.uid}&feeduid=${feeduid}`,
      );
      body = decodeHtml(pd.text ?? pd.post?.text ?? "");
    } catch {
      /* fallback page */
    }
    if (!body || body.length < 100) {
      const pageHtml = await fetchText(post.url);
      body = fieldTexts(pageHtml).join("\n\n");
    }
    const imageLocal = post.image
      ? await downloadImage(post.image, `article-${slug}`)
      : null;
    articles.push({
      slug,
      title: decodeHtml(post.title),
      excerpt: decodeHtml(post.descr) || body.slice(0, 280),
      body,
      image: imageLocal ?? post.image ?? null,
      publishedAt: post.published ?? post.date ?? null,
    });
    await new Promise((r) => setTimeout(r, 150));
  }
  return articles;
}

function parseTariffsFromChunk(chunk) {
  const texts = fieldTexts(chunk);
  const names = ["Базовый комфорт", "Оптимальный баланс", "Дизайн-комфорт"];
  const ids = ["basic", "optimal", "premium"];
  const tariffs = [];
  let searchFrom = 0;
  for (let i = 0; i < names.length; i++) {
    const ni = texts.indexOf(names[i], searchFrom);
    if (ni < 0) continue;
    searchFrom = ni + 1;
    let priceRub = null;
    let description = "";
    let ctaLabel = "Получить расчёт";
    for (let j = ni + 1; j < ni + 8 && j < texts.length; j++) {
      const t = texts[j];
      if (!priceRub && parseRub(t)) priceRub = parseRub(t);
      else if (
        !description &&
        t.length > 25 &&
        !names.includes(t) &&
        t !== "Рекомендуем" &&
        !t.includes("Тарифы")
      ) {
        description = t;
      } else if (/тариф|расчёт|решение/i.test(t)) {
        ctaLabel = t;
      }
    }
    tariffs.push({
      id: ids[i],
      name: names[i],
      priceRub,
      description,
      ctaLabel,
      recommended: names[i] === "Оптимальный баланс",
    });
  }
  return tariffs;
}

function parseTypicalProjects(html) {
  const introIdx = html.indexOf("Готовые решения");
  const texts = introIdx > 0 ? fieldTexts(html.slice(introIdx, introIdx + 120000)) : fieldTexts(html);
  const descriptionFallbacks = {
    100: "Готовое решение для одноэтажного частного дома: расчёт воздухообмена, приток свежего воздуха, вытяжка из технических зон и рекуперация тепла.",
    200: "Инженерное решение для двухэтажного дома: расчёт воздухообмена, приток в жилые зоны, вытяжка из технических помещений и рекуперация тепла.",
  };
  const imageFallbacks = {
    200: "https://static.tildacdn.com/tild6237-3165-4431-b130-653936396164/Frame_1321317900.png",
  };

  const intro =
    texts.find((t) => t.includes("комплексные системы вентиляции")) ??
    "Fliben разрабатывает комплексные системы вентиляции для частных домов.";

  const cards = [];
  for (const area of [100, 150, 200]) {
    const tariffHeader = `Тарифы · Дом ${area} м²`;
    const headerIdx = html.indexOf(tariffHeader);
    if (headerIdx < 0) continue;
    const nextHeader = html.indexOf("Тарифы · Дом", headerIdx + tariffHeader.length);
    const chunk = html.slice(headerIdx, nextHeader > 0 ? nextHeader : headerIdx + 80000);
    const chunkTexts = fieldTexts(chunk);
    const description =
      chunkTexts.find((t) => t.length > 80 && t.includes("вентиляц")) ??
      descriptionFallbacks[area] ??
      "";
    const tariffs = parseTariffsFromChunk(chunk);

    const homeIdx = html.indexOf(`Дом ${area} м²`);
    const homeChunk = homeIdx > 0 ? html.slice(homeIdx, homeIdx + 2000) : "";
    const subtitle = fieldTexts(homeChunk).find((t) => t.includes("потолки")) ?? "";

    const imgMatch = html.match(
      new RegExp(
        `Дом ${area} м²[\\s\\S]{0,6000}?data-original=["'](https://static\\.tildacdn\\.com/tild[^"']+)["']`,
      ),
    );

    cards.push({
      areaSqm: area,
      slug: `dom-${area}`,
      title: `Дом ${area} м²`,
      subtitle,
      description,
      image: imgMatch?.[1] ?? imageFallbacks[area] ?? null,
      tariffs,
    });
  }

  return { intro, projects: cards };
}

const INSTALLATION_SLUGS = [
  "montaz_vozduhovodov_v_polu",
  "montaz_vozduhovodov_v_fundamente",
  "montaz_vozduhovodov_v_interiere",
  "montaz_v_uteplitele_krovli",
  "montag_vozduhovodov_na_potolke",
  "magistralnye_vozduhovody",
  "razmeshenie_kollektorov",
  "razmeshenie_shelevyh_diffuzorov",
];

function guideTitleFromHtml(html, slug) {
  return (
    decodeHtml(html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "")
      .replace(/\s*[-|].*$/u, "")
      .trim() ||
    decodeHtml(html.match(/og:title" content="([^"]+)"/i)?.[1] ?? "") ||
    slug.replace(/_/g, " ")
  );
}

function guideImageFromHtml(html) {
  const imgs = [
    ...html.matchAll(/data-original=["'](https:\/\/static\.tildacdn\.com\/tild[^"']+)["']/gi),
  ].map((m) => m[1]);
  return imgs.find((u) => !u.includes("noroot.png")) ?? imgs[0] ?? null;
}

async function scrapeInstallationGuides() {
  const projectsHtml = await fetchText("https://fliben.ru/projects");
  const guides = [];
  for (const slug of INSTALLATION_SLUGS) {
    const url = `https://fliben.ru/${slug}`;
    if (!projectsHtml.includes(slug)) continue;
    try {
      const html = await fetchText(url);
      const title = guideTitleFromHtml(html, slug);
      const body = fieldTexts(html).filter((t) => t.length > 40).join("\n\n");
      const img = guideImageFromHtml(html);
      const imageLocal = img ? await downloadImage(img, `guide-${slug}`) : null;
      guides.push({
        slug,
        title,
        excerpt: body.slice(0, 280),
        body,
        image: imageLocal ?? img ?? null,
      });
      console.log("  guide:", title.slice(0, 50));
      await new Promise((r) => setTimeout(r, 150));
    } catch (e) {
      console.error("  skip guide", slug, e.message);
    }
  }
  return guides;
}

async function main() {
  console.log("Articles...");
  const articles = await scrapeArticles();
  for (const a of articles) console.log(" ", a.title.slice(0, 50));

  console.log("\nTypical projects...");
  const kompHtml = await fetchText("https://fliben.ru/kompleksnaya_systema_ventilyacii");
  const typical = parseTypicalProjects(kompHtml);
  for (const p of typical.projects) {
    const local = p.image ? await downloadImage(p.image, `project-${p.areaSqm}`) : null;
    p.image = local ?? p.image;
    console.log(`  ${p.areaSqm} m² — ${p.tariffs.length} tariffs`);
  }

  console.log("\nInstallation guides...");
  const guides = await scrapeInstallationGuides();

  writeFileSync(join(DATA, "fliben-articles.json"), JSON.stringify(articles, null, 2));
  writeFileSync(join(DATA, "fliben-typical-projects.json"), JSON.stringify(typical, null, 2));
  writeFileSync(join(DATA, "fliben-installation-guides.json"), JSON.stringify(guides, null, 2));

  console.log("\nDone:", {
    articles: articles.length,
    typicalProjects: typical.projects.length,
    guides: guides.length,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
