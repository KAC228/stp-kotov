/**
 * Префикс только для сборки GitHub Pages (проектный сайт /stp-kotov).
 * Локально и на reg.ru переменная пустая, пути не меняются.
 */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** Корневой путь сайта: страницы со слэшем, файлы как есть. Внешние ссылки не трогает. */
export function sitePath(path: string): string {
  if (!BASE_PATH || !path.startsWith("/") || path.startsWith("//")) return path;
  const cut = path.search(/[?#]/);
  const pathname = cut === -1 ? path : path.slice(0, cut);
  const suffix = cut === -1 ? "" : path.slice(cut);
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  let prefixed = `${BASE_PATH}${pathname}`;
  if (!isFile && !prefixed.endsWith("/")) prefixed += "/";
  return `${prefixed}${suffix}`;
}
