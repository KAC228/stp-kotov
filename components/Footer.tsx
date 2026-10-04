"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/context/ThemeContext";
import {
  BRAND_NAME,
  CONTACTS,
  PRICE_PER_METER_RUB,
  LEGAL,
  MAIN_NAV,
  PATHS,
  SOCIAL,
} from "@/constants/brand";
import { sitePath } from "@/lib/site-path";

const spring = { type: "spring" as const, damping: 30, stiffness: 150 };

export default function Footer() {
  const year = new Date().getFullYear();
  const { theme } = useTheme();

  return (
    <footer
      id="footer"
      className="bg-zinc-950 text-zinc-500 border-t border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-zinc-800"
        >
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 group-hover:border-zinc-600 transition-colors">
                <BrandLogo height={26} dark={theme === "dark"} />
              </span>
              <span
                style={{ fontFamily: "var(--font-brand)" }}
                className="text-white font-black tracking-tighter text-[17px]"
              >
                {BRAND_NAME}
              </span>
            </Link>
            <p className="text-[15px] leading-relaxed mb-8 max-w-md text-zinc-400">
              Камеры статического давления нового поколения. Единая цена{" "}
              <span className="text-zinc-300">
                {PRICE_PER_METER_RUB.toLocaleString("ru-RU")} ₽ за метр
              </span>{" "}
              — тип потолка и
              врезки включены в стоимость.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={SOCIAL.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors duration-200"
              >
                ВКонтакте
              </a>
              <a
                href={SOCIAL.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors duration-200"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <p className="text-white text-xs font-medium tracking-widest uppercase mb-5">
              Разделы
            </p>
            <ul className="space-y-3 text-[15px]">
              {MAIN_NAV.map(({ href, label }) => (
                <li key={href + label}>
                  {href === PATHS.installation ? (
                    <a
                      href={sitePath(href)}
                      className="text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white text-xs font-medium tracking-widest uppercase mb-5">
              Контакты
            </p>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a
                  href={`tel:${CONTACTS.phoneTel}`}
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  {CONTACTS.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACTS.email}`}
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  {CONTACTS.email}
                </a>
              </li>
              <li className="leading-snug text-zinc-500">{CONTACTS.address}</li>
              <li className="pt-1">
                <span className="text-zinc-300">{CONTACTS.hours}</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 border-b border-zinc-800">
          <div>
            <p className="text-white text-xs font-medium tracking-widest uppercase mb-4">
              Реквизиты
            </p>
            <dl className="space-y-2 text-[13px] text-zinc-500">
              {([
                ["Компания", LEGAL.companyFull],
                ["ИНН", LEGAL.inn],
                [LEGAL.ogrnLabel, LEGAL.ogrn],
                ["Р/с", LEGAL.account],
                ["Банк", LEGAL.bank],
                ["БИК", LEGAL.bik],
                ["к/с", LEGAL.corr],
              ] as [string, string][]).map(([dt, dd]) => (
                <div key={dt} className="flex gap-2">
                  <dt className="shrink-0 w-16 text-zinc-600">{dt}:</dt>
                  <dd className="font-mono text-zinc-400 break-all">{dd}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-zinc-600 max-w-sm">
              Реквизиты — для предварительного ознакомления. Актуальные данные
              уточняйте в договоре и счёте.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-600">
          <p>
            © {year} СТП-КОТОВ. Все права защищены. {LEGAL.companyShort}.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <span>Производство КСД</span>
            <Link href={PATHS.team} className="hover:text-zinc-400 transition-colors">
              Команда
            </Link>
            <Link href={PATHS.privacy} className="hover:text-zinc-400 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href={PATHS.terms} className="hover:text-zinc-400 transition-colors">
              Публичная оферта
            </Link>
            <Link href={PATHS.contacts} className="hover:text-zinc-400 transition-colors">
              Связаться с нами
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
