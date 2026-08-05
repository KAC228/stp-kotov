const h = await (await fetch("https://fliben.ru/projects", { headers: { "User-Agent": "Mozilla/5.0" } })).text();
for (const slug of ["montaz_vozduhovodov_v_polu", "razmeshenie_kollektorov"]) {
  const re = new RegExp(`href="https://fliben\\.ru/${slug}"[\\s\\S]{0,1200}`, "i");
  const m = h.match(re);
  if (m) {
    const title = m[0].match(/t-name[^>]*>([^<]+)/)?.[1];
    const img = m[0].match(/data-original=["']([^"']+)["']/)?.[1];
    console.log(slug, "title:", title, "img:", img?.slice(-40));
  }
}
