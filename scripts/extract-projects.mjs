const h = await (await fetch("https://fliben.ru/projects", { headers: { "User-Agent": "Mozilla/5.0" } })).text();
const cards = [...h.matchAll(/href="(https:\/\/fliben\.ru\/[a-z0-9_]+)"[^>]*>[\s\S]{0,800}?t-name[^>]*>([^<]+)/gi)];
console.log("cards", cards.length);
for (const m of cards) console.log(m[2].trim(), "->", m[1]);

const all = [...h.matchAll(/href="https:\/\/fliben\.ru\/([a-z0-9_]+)"/gi)].map((m) => m[1]);
console.log("\nunique content urls:");
for (const u of [...new Set(all)].sort()) {
  if (!["catalog","partnership","about","docs","contacts","advantages","delivery","articles","projects","kompleksnaya_systema_ventilyacii"].includes(u))
    console.log(u);
}
