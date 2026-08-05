const UA = { "User-Agent": "Mozilla/5.0" };
const pages = [
  "https://fliben.ru/",
  "https://fliben.ru/kompleksnaya_systema_ventilyacii",
  "https://fliben.ru/projects",
];

for (const url of pages) {
  const h = await (await fetch(url, { headers: UA })).text();
  const links = [...h.matchAll(/href=["'](\/[a-z0-9_\-]+)["']/gi)].map((m) => m[1]);
  const uniq = [...new Set(links)].sort();
  console.log("\n===", url, "links:", uniq.length);
  for (const u of uniq) console.log(u);
  for (const kw of ["100", "150", "200", "Подробнее", "Готовые", "типов", "м²", "м2", "руб", "₽"]) {
    const re = new RegExp(kw, "gi");
    let m;
    let n = 0;
    while ((m = re.exec(h)) && n < 3) {
      console.log(" KW", kw, ":", h.slice(Math.max(0, m.index - 60), m.index + 100).replace(/\s+/g, " "));
      n++;
    }
  }
}
