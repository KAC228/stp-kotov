import Link from "next/link";
import CatalogKitsClient from "@/components/CatalogKitsClient";
import Footer from "@/components/Footer";
import { BRAND_NAME, CONTACTS, PATHS } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Каталог | ${BRAND_NAME}`,
  description:
    "Готовые комплекты вентиляции СТП-КОТОВ: один клик — всё для монтажа в корзине. Моноблоки и системы распределения воздуха.",
  path: "/catalog",
});

export default function CatalogPage() {
  return (
    <>
      <div className="min-h-screen bg-zinc-950 pt-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <p className="ksd-shimmer-text text-[11px] font-mono tracking-[0.24em] uppercase mb-3 font-medium">
            Каталог
          </p>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Каталог
          </h1>
          <p className="text-zinc-500 text-[15px] leading-relaxed mb-10 max-w-2xl">
            Готовый комплект под площадь дома — без разбора конфигуратора. Нажал
            «Купить» — в корзине весь набор.
          </p>

          <section className="mb-14" aria-labelledby="kits-heading">
            <h2 id="kits-heading" className="sr-only">
              Комплекты
            </h2>
            <CatalogKitsClient />
          </section>

          <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <h2 className="text-white text-xl font-semibold tracking-tight mb-3">
              Индивидуальный подбор
            </h2>
            <p className="text-zinc-400 text-[15px] leading-relaxed">
              Нужна другая длина КСД или нестандарт — соберите в конфигураторе на
              главной.
            </p>
            <Link
              href={PATHS.configurator}
              className="inline-flex mt-5 text-cyan-400/90 text-sm hover:text-cyan-300"
            >
              Собрать конфигурацию →
            </Link>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <h2 className="text-white text-xl font-semibold tracking-tight mb-4">
              Моноблоки
            </h2>
            <h3 className="text-cyan-400/90 text-base font-medium mb-4">
              Моноблок «СТП-КОТОВ»: Финальные испытания
            </h3>
            <p className="text-zinc-300 text-[15px] leading-relaxed mb-6">
              Инженерный прорыв требует безупречной проверки. Наш флагманский
              моноблок сейчас проходит ресурсные тесты и калибровку автоматики.
              Старт серийных отгрузок — 20 января 2027.
            </p>
            <a
              href={`mailto:${CONTACTS.email}?subject=${encodeURIComponent("Пилотное тестирование / спецификация моноблока")}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100"
            >
              Записаться на пилот / Получить спецификацию
            </a>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
