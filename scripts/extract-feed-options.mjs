import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "fliben-scraped");
const html = readFileSync(join(dir, "_articles.html"), "utf8");

const optIdx = html.lastIndexOf("var options=", html.indexOf("t_feed_init"));
console.log("optIdx", optIdx);
if (optIdx > 0) {
  console.log(html.slice(optIdx, optIdx + 2000));
}

// search feeduid in whole file
for (const m of html.matchAll(/feeduid['":\s]+([a-zA-Z0-9]+)/gi)) {
  console.log("feeduid match", m[0]);
}

// t_feed options pattern
const m2 = html.match(/var options\s*=\s*(\{[\s\S]*?\});\s*t_onFuncLoad\('t_feed_init'/);
if (m2) console.log("options json", m2[1].slice(0, 1500));
