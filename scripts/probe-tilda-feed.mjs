import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "fliben-scraped");
const html = readFileSync(join(dir, "_articles.html"), "utf8");

const idx = html.indexOf("t_feed_init");
console.log("t_feed_init context:", html.slice(idx, idx + 500));

const feedMatch = html.match(/data-feed-uid="([^"]+)"/);
console.log("feed uid attr", feedMatch);

const allAttrs = [...html.matchAll(/data-feed-[a-z-]+="([^"]*)"/gi)];
console.log("feed attrs", allAttrs.slice(0, 20));

// try API
const recid = "2231302561";
const urls = [
  `https://feeds.tildacdn.com/api/getfeed/?feeduid=${recid}&recid=${recid}&size=100`,
  `https://feeds.tildacdn.com/api/getfeed/?feeduid=${recid}&size=100`,
  `https://ws.tildacdn.com/api/getfeed/?feeduid=${recid}&recid=${recid}&size=100`,
];
for (const u of urls) {
  try {
    const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0" } });
    const t = await r.text();
    console.log("\nURL", u, "status", r.status, "len", t.length);
    if (t.length < 500) console.log(t);
    else console.log(t.slice(0, 300));
  } catch (e) {
    console.log("fail", u, e.message);
  }
}
