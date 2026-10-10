import Link from "next/link";
import Footer from "@/components/Footer";
import { BRAND_NAME, CONTACTS, PATHS } from "@/constants/brand";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: `Каталог | ${BRAND_NAME}`,
  description:
    "Системы распределения воздуха и моноблоки СТП-КОТОВ. Финальные испытания моноблока.",
  path: "/catalog",
});

export default function CatalogPage() {
  return (
    <>
      <div className="min-h-screen bg-zinc-950 pt-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <p className="text-zinc-600 text-[11px] font-mono tracking-[0.24em] uppercase mb-3">
            Каталог
          </p>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight mb-12">
            Каталог
          </h1>

          <section className="mb-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <h2 className="text-white text-xl font-semibold tracking-tight mb-3">
              Системы распределения воздуха
            </h2>
            <p className="text-zinc-400 text-[15px] leading-relaxed">
              Раздел в подготовке. Для подбора конфигурации КСД используйте конфигуратор на главной
              странице.
            </p>
            <Link
              href={PATHS.configurator}
              className="inline-flex mt-5 text-cyan-400/90 text-sm hover:text-cyan-300"
            >
              Собрать конфигурацию →
            </Link>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <h2 className="text-white text-xl font-semibold tracking-tight mb-4">Моноблоки</h2>
            <h3 className="text-cyan-400/90 text-base font-medium mb-4">
              Моноблок «СТП-КОТОВ»: Финальные испытания
            </h3>
            <p className="text-zinc-300 text-[15px] leading-relaxed mb-6">
              Инженерный прорыв требует безупречной проверки. Наш флагманский моноблок сейчас проходит
              ресурсные тесты и калибровку автоматики в условиях, максимально приближенных к реальным. Мы
              не поставляем прототипы — мы поставляем готовое решение. Сейчас мы выверяем каждый алгоритм,
              чтобы гарантировать заявленный КПД и акустический комфорт. Старт серийных отгрузок — 20
              января 2027.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${CONTACTS.email}?subject=${encodeURIComponent("Пилотное тестирование / спецификация моноблока")}`}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100"
              >
                Записаться на пилотное тестирование / Получить спецификацию
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
