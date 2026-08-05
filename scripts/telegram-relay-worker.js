/**
 * Cloudflare Worker — прокси к api.telegram.org, если хостинг (reg.ru) блокирует Telegram.
 *
 * 1. workers.cloudflare.com → Create Worker → вставить этот код → Deploy
 * 2. Settings → Variables → добавить секрет RELAY_SECRET (длинная случайная строка)
 * 3. В send.config.php на сервере:
 *    'telegram_api_base' => 'https://ВАШ-ВОРКЕР.workers.dev',
 *    'telegram_relay_secret' => 'тот же RELAY_SECRET',
 *
 * Worker принимает только POST и только пути /bot…/sendMessage|sendDocument.
 * Заголовок X-Relay-Secret должен совпадать с RELAY_SECRET.
 */
const ALLOWED_METHODS = new Set(["POST", "OPTIONS"]);
const ALLOWED_PATH = /^\/bot[^/]+\/(sendMessage|sendDocument)$/;

const telegramRelayWorker = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (!ALLOWED_METHODS.has(request.method)) {
      return new Response("Method not allowed", { status: 405 });
    }

    const secret = env?.RELAY_SECRET;
    if (!secret || typeof secret !== "string" || secret.length < 16) {
      return new Response("Relay misconfigured", { status: 500 });
    }

    const provided = request.headers.get("X-Relay-Secret") || "";
    if (provided.length !== secret.length) {
      return new Response("Unauthorized", { status: 401 });
    }
    let match = true;
    for (let i = 0; i < secret.length; i++) {
      match = match && provided.charCodeAt(i) === secret.charCodeAt(i);
    }
    if (!match) {
      return new Response("Unauthorized", { status: 401 });
    }

    const incoming = new URL(request.url);
    if (!ALLOWED_PATH.test(incoming.pathname)) {
      return new Response("Path not allowed", { status: 403 });
    }

    const target = new URL(
      "https://api.telegram.org" + incoming.pathname + incoming.search
    );

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("X-Relay-Secret");

    return fetch(
      new Request(target.toString(), {
        method: "POST",
        headers,
        body: request.body,
      })
    );
  },
};

export default telegramRelayWorker;
