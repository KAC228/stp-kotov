const pagesBase = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Проектный GitHub Pages живёт в /имя-репозитория и отдаёт папки, не .html.
  ...(pagesBase
    ? {
        basePath: pagesBase,
        trailingSlash: true,
      }
    : {}),
};

module.exports = nextConfig;
