import Link from "next/link";
import type { Metadata } from "next";
import { BRAND_NAME, LEGAL, SITE_DOMAIN } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Публичная оферта — ${BRAND_NAME}`,
  description: `Договор публичной оферты интернет-магазина ${BRAND_NAME} на сайте ${SITE_DOMAIN}.`,
};

/* ─────────────────────────────── helpers ─────────────────────────────── */

function SectionTitle({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 text-white font-semibold tracking-tight mt-14 mb-4"
      style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)" }}
    >
      <span className="shrink-0 font-mono text-zinc-600 text-sm">{num}</span>
      {children}
    </h2>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">{children}</p>
  );
}

function Clause({
  n,
  children,
  warn,
}: {
  n: string;
  children: React.ReactNode;
  warn?: boolean;
}) {
  return (
    <div
      className={`flex gap-3 mb-3 ${
        warn
          ? "rounded-xl border border-amber-700/50 bg-amber-950/20 p-4"
          : ""
      }`}
    >
      <span
        className={`shrink-0 font-mono text-[13px] mt-0.5 ${
          warn ? "text-amber-500" : "text-zinc-600"
        }`}
      >
        {n}
      </span>
      <p
        className={`text-[15px] leading-relaxed ${
          warn ? "text-amber-200" : "text-zinc-400"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function ReqRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2 border-b border-zinc-800/60 last:border-0">
      <dt className="shrink-0 w-24 text-zinc-600 text-[13px]">{label}</dt>
      <dd className="font-mono text-zinc-300 text-[13px] break-all">{value}</dd>
    </div>
  );
}

/* ─────────────────────────────── page ────────────────────────────────── */

export default function TermsPage() {
  const effectiveDate = "01 мая 2026 года";

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 lg:py-28">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors duration-200 mb-12"
        >
          ← Вернуться на главную
        </Link>

        {/* ── Header ── */}
        <div className="mb-12">
          <p className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-4">
            Правовые документы · {SITE_DOMAIN}
          </p>
          <h1
            className="text-white font-semibold tracking-tighter leading-tight mb-5"
            style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.8rem)" }}
          >
            Публичная оферта{" "}
            <br className="hidden sm:block" />
            интернет-магазина «{BRAND_NAME}»
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-zinc-600 font-mono">
            <span>Дата вступления в силу: {effectiveDate}</span>
            <span>Редакция: 1.0</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent mb-2" />

        {/* ── Преамбула ── */}
        <Para>
          Настоящий документ является официальным предложением (публичной офертой) в соответствии со ст. 435 и ч. 2 ст. 437 Гражданского кодекса РФ. Совершение акцепта (оформление заказа, подтверждение оплаты) означает полное и безоговорочное принятие всех условий настоящего Договора без каких-либо изъятий и оговорок.
        </Para>

        {/* ── 1. Общие положения ── */}
        <SectionTitle num="1.">Общие положения</SectionTitle>
        <Para>
          1.1. Настоящая публичная оферта (далее — <strong className="text-zinc-200">Договор</strong>) является официальным предложением{" "}
          <strong className="text-zinc-200">{LEGAL.companyFull}</strong> (далее — <strong className="text-zinc-200">Продавец</strong>) заключить договор купли-продажи товаров дистанционным способом через сайт{" "}
          <strong className="text-zinc-200">{SITE_DOMAIN}</strong>.
        </Para>
        <Para>
          1.2. Лицо, совершившее акцепт настоящей оферты, именуется в дальнейшем <strong className="text-zinc-200">Покупателем</strong>. Вместе Продавец и Покупатель — <strong className="text-zinc-200">Стороны</strong>.
        </Para>
        <Para>
          1.3. Договор считается заключённым с момента подтверждения заказа и получения Продавцом оплаты в полном объёме.
        </Para>
        <Para>
          1.4. Настоящий Договор, Политика конфиденциальности и любые иные документы, размещённые на Сайте, образуют единое соглашение между Сторонами.
        </Para>

        {/* ── 2. Предмет договора ── */}
        <SectionTitle num="2.">Предмет договора</SectionTitle>
        <Para>
          2.1. Продавец обязуется передать в собственность Покупателю, а Покупатель обязуется принять и оплатить товар (камеры статического давления «КСД» и сопутствующие изделия), выбранный и оформленный через интерфейс Сайта, включая товары, сконфигурированные по индивидуальным параметрам через Конфигуратор.
        </Para>
        <Para>
          2.2. Ассортимент, характеристики и стоимость товаров определяются Конфигуратором и/или каталогом Сайта, актуальными на момент оформления заказа.
        </Para>

        {/* ── 3. Оформление заказа и цена ── */}
        <SectionTitle num="3.">Оформление заказа и цена</SectionTitle>
        <Clause n="3.1.">
          Заказ оформляется Покупателем самостоятельно через Конфигуратор или форму заказа. При необходимости заказ может быть оформлен с помощью менеджера Продавца по телефону или в мессенджере.
        </Clause>
        <Clause n="3.2.">
          Цена товара указывается в рублях Российской Федерации (₽) и фиксируется в момент подтверждения заказа. Последующее изменение цены не влияет на уже оплаченные заказы.
        </Clause>
        <Clause n="3.3.">
          Оплата осуществляется в размере 100% предоплаты безналичным путем. Оплата при получении не предусмотрена. Платежи принимаются через платёжный шлюз АО «ТБанк» (банковские карты, СБП, Mir Pay), а для юридических лиц и ИП доступна оплата по выставленному счёту.
        </Clause>
        <Clause n="3.4.">
          Счёт-фактура (кассовый чек) направляется Покупателю на указанный адрес электронной почты не позднее следующего рабочего дня после поступления оплаты.
        </Clause>

        {/* ── 4. Гарантия качества ── */}
        <SectionTitle num="4.">Гарантия качества</SectionTitle>

        {/* Highlight badge */}
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-emerald-800/50 bg-emerald-950/20 mb-5 w-fit">
          <span className="text-emerald-400 text-[13px] font-semibold">✓ Расширенная гарантия</span>
          <span className="text-emerald-300 font-black text-xl">25 лет</span>
        </div>

        <Clause n="4.1.">
          Продавец предоставляет уникальную расширенную гарантию на конструктивную целостность корпуса изделия сроком <strong className="text-zinc-200">25 (двадцать пять) лет</strong> с даты передачи товара Покупателю.
        </Clause>
        <Clause n="4.2.">
          Гарантийные обязательства действуют при условии соблюдения правил монтажа и эксплуатации, указанных в технической документации, прилагаемой к изделию. Гарантия не распространяется на повреждения, возникшие вследствие нарушения правил монтажа, механического воздействия или иных внешних факторов.
        </Clause>
        <Clause n="4.3.">
          Каждое изделие маркируется <strong className="text-zinc-200">индивидуальной алюминиевой биркой</strong> с уникальным серийным номером, датой изготовления и личной подписью инженера контроля качества. Серийный номер является основанием для идентификации изделия по гарантии.
        </Clause>
        <Clause n="4.4.">
          Для обращения по гарантии Покупатель обязан предъявить: серийный номер с бирки изделия и подтверждение оплаты (номер заказа или кассовый чек).
        </Clause>

        {/* ── 5. Доставка и приёмка ── */}
        <SectionTitle num="5.">Доставка и приёмка товара</SectionTitle>
        <Clause n="5.1.">
          Доставка осуществляется по всей территории СНГ силами транспортных компаний-партнёров. Срок изготовления и отгрузки согласовывается индивидуально и указывается в подтверждении заказа.
        </Clause>
        <Clause n="5.2.">
          Право собственности на товар и риски его случайной гибели или повреждения переходят к Покупателю в момент передачи товара транспортной компании для доставки.
        </Clause>
        <Clause n="5.3.">
          Покупатель обязан при получении товара проверить целостность упаковки в присутствии представителя транспортной компании. При обнаружении внешних повреждений — зафиксировать это актом и незамедлительно уведомить Продавца.
        </Clause>
        <Clause n="5.4.">
          Стоимость доставки рассчитывается отдельно в зависимости от региона и тарифов транспортной компании и не включена в цену товара, если иное не указано при оформлении заказа.
        </Clause>

        {/* ── 6. Возврат и обмен ── */}
        <SectionTitle num="6.">Условия возврата и обмена</SectionTitle>
        <Clause n="6.1.">
          Возврат товара надлежащего качества возможен в течение <strong className="text-zinc-200">14 (четырнадцати) дней</strong> с момента получения для стандартных складских позиций при условии сохранения товарного вида, потребительских свойств, упаковки и фискального чека.
        </Clause>

        <Clause n="6.2." warn>
          <strong>⚠ ВНИМАНИЕ — ТОВАР ИНДИВИДУАЛЬНОГО ИЗГОТОВЛЕНИЯ:</strong> В соответствии с п. 4 ст. 26.1 Закона РФ «О защите прав потребителей» №2300-1, Покупатель{" "}
          <strong>не вправе отказаться</strong> от товара надлежащего качества, имеющего индивидуально-определённые свойства (изделия, изготовленные по индивидуальным размерам, параметрам и конфигурациям через Конфигуратор), поскольку указанный товар может быть использован исключительно приобретающим его Покупателем. Факт индивидуального изготовления фиксируется уникальным серийным номером на алюминиевой бирке.
        </Clause>
        <Clause n="6.3.">
          Возврат денежных средств производится на тот же платёжный инструмент (карту, банковский счёт), с которого была совершена оплата, в течение <strong className="text-zinc-200">10 рабочих дней</strong> после получения Продавцом товара и подтверждения законности возврата.
        </Clause>
        <Clause n="6.4.">
          Возврат товара ненадлежащего качества осуществляется в соответствии с требованиями Закона РФ «О защите прав потребителей» и действующим законодательством РФ.
        </Clause>

        {/* ── 7. Обработка данных ── */}
        <SectionTitle num="7.">Обработка персональных данных</SectionTitle>
        <Clause n="7.1.">
          Оформляя заказ, Покупатель даёт согласие на обработку своих персональных данных (ФИО, телефон, адрес электронной почты, адрес доставки) в целях исполнения настоящего Договора в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
        </Clause>
        <Clause n="7.2.">
          Порядок обработки персональных данных подробно описан в{" "}
          <Link href="/privacy" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">
            Политике конфиденциальности
          </Link>{" "}
          сайта.
        </Clause>

        {/* ── 8. Ответственность и споры ── */}
        <SectionTitle num="8.">Ответственность и разрешение споров</SectionTitle>
        <Clause n="8.1.">
          Стороны несут ответственность за ненадлежащее исполнение обязательств по настоящему Договору в соответствии с законодательством Российской Федерации.
        </Clause>
        <Clause n="8.2.">
          Все споры и разногласия, возникающие из настоящего Договора, Стороны обязуются решать путём переговоров. Претензионный порядок урегулирования споров обязателен; срок ответа на претензию — 30 (тридцать) календарных дней.
        </Clause>
        <Clause n="8.3.">
          В случае невозможности урегулировать спор в досудебном порядке, он подлежит рассмотрению в судебном порядке по месту нахождения Продавца (Республика Адыгея, Российская Федерация).
        </Clause>
        <Clause n="8.4.">
          К правоотношениям Сторон, не урегулированным настоящим Договором, применяется законодательство РФ, в том числе Закон РФ «О защите прав потребителей», Гражданский кодекс РФ.
        </Clause>

        {/* ── 9. Прочие условия ── */}
        <SectionTitle num="9.">Прочие условия</SectionTitle>
        <Clause n="9.1.">
          Продавец вправе в одностороннем порядке вносить изменения в настоящую оферту путём публикации новой редакции на Сайте. Изменения вступают в силу с момента публикации и не распространяются на уже оплаченные заказы.
        </Clause>
        <Clause n="9.2.">
          Признание какого-либо положения Договора недействительным не влечёт недействительности остальных его положений.
        </Clause>
        <Clause n="9.3.">
          Настоящий Договор составлен на русском языке и регулируется законодательством Российской Федерации.
        </Clause>

        {/* ── 10. Реквизиты Продавца ── */}
        <SectionTitle num="10.">Реквизиты Продавца</SectionTitle>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden mt-4">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900">
            <p className="text-zinc-500 text-[11px] font-mono tracking-[0.22em] uppercase">
              Реквизиты · {BRAND_NAME}
            </p>
          </div>

          <dl className="px-6 py-5">
            <ReqRow label="Компания" value={LEGAL.companyFull} />
            <ReqRow label="ИНН" value={LEGAL.inn} />
            <ReqRow label="ОГРНИП" value={LEGAL.ogrn} />
            <ReqRow label="Р/с" value={LEGAL.account} />
            <ReqRow label="Банк" value={LEGAL.bank} />
            <ReqRow label="БИК" value={LEGAL.bik} />
            <ReqRow label="к/с" value={LEGAL.corr} />
            <ReqRow
              label="Адрес"
              value="385768, РОССИЯ, РЕСП АДЫГЕЯ, МАЙКОПСКИЙ Р-Н, Х СЕВЕРО-ВОСТОЧНЫЕ САДЫ, УЛ КЛЮЧЕВАЯ, Д 3, КВ 2"
            />
          </dl>
        </div>

        {/* Divider + footer note */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mt-16 mb-6" />
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs text-zinc-600 font-mono">
          <span>Оферта вступает в силу: {effectiveDate}</span>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
            Политика конфиденциальности →
          </Link>
        </div>
      </div>
    </div>
  );
}
