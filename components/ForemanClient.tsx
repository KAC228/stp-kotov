"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mic, Send, Square, Trash2 } from "lucide-react";
import { CONTACTS } from "@/constants/brand";
import { answerForeman, QUICK_QUESTIONS, type ForemanReply } from "@/lib/foreman";

type ThreadMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "foreman"; reply: ForemanReply };

const STORAGE_KEY = "stp-foreman-thread";

type SpeechResult = ArrayLike<{ transcript: string }> & { isFinal: boolean };

type SpeechEvent = { results: ArrayLike<SpeechResult> };

type BrowserSpeech = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function speechCtor(): (new () => BrowserSpeech) | null {
  if (typeof window === "undefined") return null;
  const host = window as Window & {
    SpeechRecognition?: new () => BrowserSpeech;
    webkitSpeechRecognition?: new () => BrowserSpeech;
  };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

function isReply(value: unknown): value is ForemanReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as ForemanReply;
  return typeof reply.title === "string"
    && typeof reply.action === "string"
    && typeof reply.detail === "string"
    && Boolean(reply.source)
    && typeof reply.source.label === "string";
}

function readThread(): ThreadMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ThreadMessage => {
      if (!item || typeof item !== "object") return false;
      const row = item as ThreadMessage;
      if (row.role === "user") return typeof row.text === "string";
      return row.role === "foreman" && isReply(row.reply);
    }).slice(-40);
  } catch {
    return [];
  }
}

function nextId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ForemanClient() {
  const [headerH, setHeaderH] = useState(120);
  const [keyboard, setKeyboard] = useState(0);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const [canSpeak, setCanSpeak] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const speechRef = useRef<BrowserSpeech | null>(null);
  const voiceAsked = useRef(false);
  const hydrated = useRef(false);

  useEffect(() => {
    setMessages(readThread());
    hydrated.current = true;
    setCanSpeak(Boolean(speechCtor()));
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* private mode */
    }
  }, [messages]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const apply = () => setHeaderH(Math.ceil(header.getBoundingClientRect().height));
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const sync = () => {
      const covered = window.innerHeight - viewport.height - viewport.offsetTop;
      setKeyboard(covered > 80 ? Math.round(covered) : 0);
    };
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, keyboard]);

  const ask = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const reply = answerForeman(clean);
    setMessages((prev) => {
      const next: ThreadMessage[] = [
        ...prev,
        { id: nextId(), role: "user", text: clean },
        { id: nextId(), role: "foreman", reply },
      ];
      return next.slice(-40);
    });
    setDraft("");
    setVoiceNote("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(draft);
  };

  const toggleVoice = () => {
    if (listening) {
      speechRef.current?.stop();
      setListening(false);
      return;
    }
    const Ctor = speechCtor();
    if (!Ctor) {
      setVoiceNote("Голос в этом браузере недоступен — напишите текстом.");
      return;
    }
    const recognition = new Ctor();
    voiceAsked.current = false;
    recognition.lang = "ru-RU";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const row = event.results[i];
        const piece = row[0]?.transcript ?? "";
        if (row.isFinal) finalText += piece;
        else interim += piece;
      }
      const shown = (finalText || interim).trim();
      if (shown) setDraft(shown);
      if (finalText.trim() && !voiceAsked.current) {
        voiceAsked.current = true;
        ask(finalText);
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setVoiceNote("Микрофон не включился — напишите текстом.");
    };
    recognition.onend = () => setListening(false);
    speechRef.current = recognition;
    setVoiceNote("");
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceNote("Микрофон не включился — напишите текстом.");
    }
  };

  const clearThread = () => {
    speechRef.current?.stop();
    setListening(false);
    setMessages([]);
    setDraft("");
  };

  return (
    <div
      className="flex flex-col bg-zinc-950 text-white"
      style={{
        height: keyboard > 0 ? `calc(100dvh - ${keyboard}px)` : "100dvh",
        paddingTop: headerH,
      }}
    >
      <div className="shrink-0 border-b border-zinc-800 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
              На площадке
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Прораб
            </h1>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-zinc-400">
              Ответ из базы монтажа КСД. Норма указана документом, без выдуманного пункта.
              Если узел расходится с проектом — остановитесь.
            </p>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearThread}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Очистить
            </button>
          )}
        </div>
      </div>

      <div
        ref={threadRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6"
        aria-live="polite"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4">
              <p className="text-[15px] leading-relaxed text-zinc-300">
                Спросите, как на объекте. Можно голосом: высота камеры, диаметр, потолок, крепёж, заслонка.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => ask(item.query)}
                    className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-left text-[13px] text-zinc-300 hover:border-cyan-400/40 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) =>
            message.role === "user" ? (
              <p
                key={message.id}
                className="ml-auto max-w-[85%] rounded-2xl bg-white px-4 py-3 text-[15px] leading-relaxed text-zinc-950"
              >
                {message.text}
              </p>
            ) : (
              <article
                key={message.id}
                className="max-w-[95%] rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4"
              >
                <p className="font-mono text-[10px] tracking-[0.18em] text-cyan-400 uppercase">
                  {message.reply.confident ? "Что делать" : "Нет готового ответа"}
                </p>
                <h2 className="mt-1 text-base font-semibold tracking-tight text-white">
                  {message.reply.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-200">
                  {message.reply.action}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
                  {message.reply.detail}
                </p>
                <p className="mt-3 border-t border-zinc-800 pt-3 text-[12px] leading-relaxed text-zinc-500">
                  <span className="text-zinc-300">{message.reply.source.label}. </span>
                  {message.reply.source.note}
                </p>
                {message.reply.related.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.reply.related.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => ask(item.ask)}
                        className="rounded-full border border-zinc-700 px-3 py-1.5 text-[12px] text-zinc-300 hover:border-cyan-400/40 hover:text-white"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ),
          )}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-zinc-800 bg-zinc-950 px-4 pt-3 sm:px-6"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-3xl">
          {voiceNote && (
            <p className="mb-2 text-[12px] text-zinc-400">{voiceNote}</p>
          )}
          <div className="flex items-end gap-2">
            {canSpeak && (
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={listening}
                aria-label={listening ? "Остановить запись" : "Спросить голосом"}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                  listening
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
                    : "border-zinc-700 text-zinc-300 hover:text-white"
                }`}
              >
                {listening ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" strokeWidth={1.75} />}
              </button>
            )}
            <label className="sr-only" htmlFor="foreman-question">
              Вопрос с площадки
            </label>
            <textarea
              id="foreman-question"
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  ask(draft);
                }
              }}
              placeholder="Например: высота 105, какой воздуховод"
              className="ksd-input max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white placeholder:text-zinc-500"
            />
            <button
              type="submit"
              aria-label="Спросить"
              disabled={!draft.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-950 disabled:opacity-40"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
            Полные тексты СП и ГОСТ в базу не входят. Инженер:{" "}
            <a href={`tel:${CONTACTS.phoneTel}`} className="text-zinc-300 underline-offset-2 hover:underline">
              {CONTACTS.phoneDisplay}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
