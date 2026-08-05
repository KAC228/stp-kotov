const h = await (await fetch("https://fliben.ru/", { headers: { "User-Agent": "Mozilla/5.0" } })).text();

function texts(pattern) {
  return [...h.matchAll(pattern)].map((m) => m[1].replace(/&nbsp;/g, " ").trim());
}

console.log("areas", texts(/field='tn_text_17815482344870000\d+'>([^<]+)/g));
console.log("prices", texts(/field='tn_text_178154847717\d+'>([^<]+)/g));

// find all <a with href near Подробнее field ids
for (const fid of ["1782214257705000002", "1782214302686000004", "1782214313621000006"]) {
  const re = new RegExp(`href=["']([^"']+)["'][\\s\\S]{0,4000}?${fid}`, "i");
  const m = h.match(re);
  console.log("link for", fid, m?.[1]);
}

const popups = texts(/href=["']#popup:([^"']+)["']/gi);
console.log("popups", popups);

// images in ready block
const imgs = texts(/data-original=["'](https:\/\/static\.tildacdn\.com\/[^"']+)["']/g).slice(0, 20);
console.log("imgs count", imgs.length);

// descr texts for each house
console.log("descrs", texts(/field='tn_text_17815482344870000[789]\d+'>([^<]+)/g));

// broader: all tn_text in section after Готовые
const idx = h.indexOf("Готовые решения");
if (idx > 0) {
  const chunk = h.slice(idx, idx + 100000);
  console.log("\nall short texts in chunk:");
  const all = [...chunk.matchAll(/field='tn_text_[^']+'>([^<]{2,120})/g)].map((m) => m[1].replace(/&nbsp;/g, " "));
  all.forEach((t) => console.log(" -", t));
}
