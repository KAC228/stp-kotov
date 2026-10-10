"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mic, Send, Square, Trash2 } from "lucide-react";
import { CONTACTS } from "@/constants/brand";
import { REGULATION } from "@/data/foreman-regulation";
import { answerForeman, QUICK_QUESTIONS, type ForemanReply } from "@/lib/foreman";

type ThreadMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "foreman"; reply: ForemanReply };

const STORAGE_KEY = "stp-foreman-thread";
const PROGRESS_KEY = "stp-foreman-progress";

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
  const [mode, setMode] = useState<"steps" | "ask">("steps");
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState<string[]>([]);
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
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const saved = parsed as { index?: unknown; done?: unknown };
          if (typeof saved.index === "number" && saved.index >= 0 && saved.index < REGULATION.length) {
            setStepIndex(saved.index);
          }
          if (Array.isArray(saved.done)) {
            const ids = new Set(REGULATION.map((step) => step.id));
            setDone(saved.done.filter((id): id is string => typeof id === "string" && ids.has(id)));
          }
        }
      }
    } catch {
      /* ignore broken progress */
    }
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
    if (!hydrated.current) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ index: stepIndex, done }));
    } catch {
      /* private mode */
    }
  }, [stepIndex, done]);

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

  const step = REGULATION[stepIndex];
  const stepDone = done.includes(step.id);
  const allDone = REGULATION.every((item) => done.includes(item.id));

  const finishStep = () => {
    setDone((prev) => (prev.includes(step.id) ? prev : [...prev, step.id]));
    setStepIndex((index) => Math.min(index + 1, REGULATION.length - 1));
  };

  const resetProgress = () => {
    setDone([]);
    setStepIndex(0);
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
              Регламент монтажа: с чего начать и чем закончить. Идёшь по шагам, спорный узел не закрываешь.
            </p>
          </div>
          {mode === "ask" && messages.length > 0 && (
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
          {mode === "steps" && (
            <>
              <div className="flex items-center justify-between gap-3 text-[12px] text-zinc-500">
                <p>
                  Шаг {stepIndex + 1} из {REGULATION.length}
                  {allDone ? " · регламент пройден" : ""}
                </p>
                {done.length > 0 && (
                  <button type="button" onClick={resetProgress} className="text-zinc-400 hover:text-white">
                    Сначала
                  </button>
                )}
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${(done.length / REGULATION.length) * 100}%` }}
                />
              </div>
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4">
                <p className="font-mono text-[10px] tracking-[0.18em] text-cyan-400 uppercase">
                  {stepDone ? "Сделано" : "Сейчас"}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
                  {step.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-zinc-200">{step.doThis}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">
                  <span className="text-zinc-300">Стоп. </span>
                  {step.stopIf}
                </p>
              </article>
              <ol className="flex flex-col gap-1">
                {REGULATION.map((item, index) => {
                  const checked = done.includes(item.id);
                  const current = index === stepIndex;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setStepIndex(index)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] ${
                          current ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                            checked
                              ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
                              : "border-zinc-700 text-zinc-500"
                          }`}
                        >
                          {checked ? "✓" : index + 1}
                        </span>
                        {item.title}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          {mode === "ask" && messages.length === 0 && (
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

          {mode === "ask" && messages.map((message) =>
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

      {mode === "steps" ? (
        <div
          className="shrink-0 border-t border-zinc-800 bg-zinc-950 px-4 pt-3 sm:px-6"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
                disabled={stepIndex === 0}
                className="h-12 rounded-2xl border border-zinc-700 px-4 text-sm text-zinc-300 disabled:opacity-40"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={finishStep}
                className="h-12 flex-1 rounded-2xl bg-white text-sm font-semibold text-zinc-950"
              >
                {stepIndex === REGULATION.length - 1 && stepDone ? "Регламент пройден" : "Дальше"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setMode("ask");
                setDraft(`Шаг «${step.title}»: `);
              }}
              className="py-1 text-center text-[13px] text-zinc-400 hover:text-white"
            >
              Спросить по этому шагу
            </button>
          </div>
        </div>
      ) : (
      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-zinc-800 bg-zinc-950 px-4 pt-3 sm:px-6"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => setMode("steps")}
            className="mb-2 text-[13px] text-zinc-400 hover:text-white"
          >
            К регламенту
          </button>
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
      )}
    </div>
  );
}
