const url = process.argv[2] || "https://fliben.ru/kompleksnaya_systema_ventilyacii";
const h = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();

function decode(s) {
  return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
}

console.log("URL", url, "len", h.length);

for (const popup of ["zeropopup100", "zeropopup150", "zeropopup200"]) {
  const idx = h.indexOf(popup);
  console.log("\n===", popup, "found at", idx);
  if (idx < 0) continue;
  const chunk = h.slice(Math.max(0, idx - 500), idx + 25000);
  const texts = [...chunk.matchAll(/field='tn_text_[^']+'>([^<]{2,500})/g)].map((m) => decode(m[1]));
  const prices = texts.filter((t) => /₽|руб/.test(t));
  console.log("prices:", prices);
  console.log("texts:", texts.slice(0, 25));
  const imgs = [...chunk.matchAll(/data-original=["'](https:\/\/static\.tildacdn\.com\/[^"']+)["']/g)].map((m) => m[1]);
  console.log("imgs:", imgs.slice(0, 5));
}

// homepage prices on kompleksnaya
const prices = [...h.matchAll(/field='tn_text_178154847717\d+'>([^<]+)/g)].map((m) => decode(m[1]));
console.log("\nAll prices on page:", prices);

// systems section on homepage
const sysIdx = h.indexOf("Системные решения");
if (sysIdx > 0) {
  const chunk = h.slice(sysIdx, sysIdx + 80000);
  const links = [...chunk.matchAll(/href=["'](\/[^"'#]+)["'][^>]*>[\s\S]{0,500}?field='tn_text_[^']+'>([^<]{5,80})/g)];
  console.log("\nSystems links:");
  for (const m of links) console.log(m[2], "->", m[1]);
}
