import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const issues = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(fullPath));
    else result.push(fullPath);
  }
  return result;
}

function existsRoute(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || clean === "/") return fs.existsSync(path.join(out, "index.html"));
  const rel = decodeURI(clean.replace(/^\//, ""));
  return (
    fs.existsSync(path.join(out, rel, "index.html")) ||
    fs.existsSync(path.join(out, `${rel}.html`)) ||
    fs.existsSync(path.join(out, rel))
  );
}

function existsAsset(src) {
  const clean = src.split("?")[0];
  if (!clean.startsWith("/")) return true;
  const rel = decodeURI(clean.replace(/^\//, ""));
  return fs.existsSync(path.join(out, rel)) || fs.existsSync(path.join(root, "public", rel));
}

const htmlFiles = walk(out).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (
      url.startsWith("http") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      url.startsWith("data:") ||
      url.startsWith("#") ||
      url.startsWith("/_next/")
    ) {
      continue;
    }

    if (!url.startsWith("/")) continue;

    const isAsset = /\.[a-z0-9]{2,5}(?:$|[?#])/i.test(url);
    if (isAsset) {
      if (!existsAsset(url)) issues.push(["missing-asset", path.relative(out, file), url]);
    } else if (!existsRoute(url)) {
      issues.push(["missing-route", path.relative(out, file), url]);
    }
  }
}

console.log(JSON.stringify({ htmlFiles: htmlFiles.length, totalIssues: issues.length, issues }, null, 2));
if (issues.length) process.exitCode = 2;
