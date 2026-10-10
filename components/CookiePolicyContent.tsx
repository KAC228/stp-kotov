"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CONTACTS, LEGAL, PATHS, SITE_DOMAIN } from "@/constants/brand";

const sp = { type: "spring" as const, damping: 28, stiffness: 130 };

export default function CookiePolicyContent() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-3xl mx-auto py-20 px-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm group mb-14"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={1.75} />
            Вернуться на главную
          </Link>
        </motion.div>

        <p className="text-zinc-500 text-[11px] font-mono tracking-[0.26em] uppercase mb-4">
          Правовые документы
        </p>
        <h1 className="text-white font-bold tracking-tight leading-tight text-3xl sm:text-4xl mb-5">
          Политика использования файлов cookie
        </h1>
        <p className="text-zinc-400 text-sm mb-10">
          Редакция от 04.10.2026 · Оператор: {LEGAL.companyShort} · Сайт {SITE_DOMAIN}
        </p>

        <div className="space-y-10 text-[15px] leading-[1.8] text-zinc-400">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Что такое cookie</h2>
            <p>
              Cookie — небольшие текстовые файлы, которые сайт сохраняет в браузере. Они помогают
              обеспечивать работу сайта, запоминать настройки и (при вашем согласии) собирать
              статистику посещений.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Какие cookie мы используем</h2>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex gap-3">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2.5" />
                <span>
                  <strong className="text-zinc-300 font-medium">Необходимые</strong> — тема оформления
                  (`ksd-theme`), согласие на cookie (`cookie_consent`), служебные данные корзины и
                  оплаты в session/local storage браузера. Без них сайт работает некорректно; они
                  не требуют отдельного согласия на аналитику.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2.5" />
                <span>
                  <strong className="text-zinc-300 font-medium">Аналитические</strong> — «Яндекс.Метрика»
                  (ООО «ЯНДЕКС»), включая вебвизор. Загружаются{" "}
                  <strong className="text-zinc-300 font-medium">только после нажатия «Принять»</strong>{" "}
                  в баннере cookie.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. Управление согласием</h2>
            <p className="mb-3">
              При первом визите показывается баннер с кнопками «Принять» и «Отклонить». При отказе
              аналитика не включается; необходимые cookie для работы сайта могут сохраняться.
            </p>
            <p>
              Чтобы изменить выбор, очистите данные сайта в настройках браузера или напишите на{" "}
              <a href={`mailto:${CONTACTS.email}`} className="text-zinc-300 underline underline-offset-2 hover:text-white">
                {CONTACTS.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Сторонние сервисы</h2>
            <p>
              При оплате вы переходите на платёжную форму АО «ТБанк» — там могут применяться cookie
              банка. Подробнее об обработке ПДн — в{" "}
              <Link href={PATHS.privacy} className="text-zinc-300 underline underline-offset-2 hover:text-white">
                Политике конфиденциальности
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Контакты</h2>
            <p>
              {LEGAL.companyFull}, ИНН {LEGAL.inn}. Вопросы:{" "}
              <a href={`mailto:${CONTACTS.email}`} className="text-zinc-300 underline underline-offset-2 hover:text-white">
                {CONTACTS.email}
              </a>
              , тел. {CONTACTS.phoneDisplay}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
