"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 22, stiffness: 120 },
  },
};

const TEAM = [
  {
    name: "Котов Илья Александрович",
    role: "Владелец",
    bio: "Определяет стратегию развития бренда, продуктовую линейку КСД и стандарты качества на всех этапах — от идеи до отгрузки.",
  },
  {
    name: "Пырсов Алексей Юрьевич",
    role: "Генеральный директор",
    bio: "Руководит операционной деятельностью компании: производство, продажи, партнёрскую сеть и исполнение обязательств перед клиентами.",
  },
  {
    name: "Клещ Андрей Сергеевич",
    role: "Начальник проектного отдела",
    bio: "Курирует проектирование и сопровождение объектов: от технического задания и подбора конфигурации до согласования с монтажными бригадами.",
  },
  {
    name: "Касаткин Михаил Алексеевич",
    role: "Руководитель digital-направления",
    bio: "Отвечает за цифровую инфраструктуру бренда: сайт, онлайн-конфигуратор, автоматизацию заявок и развитие клиентского сервиса в digital.",
  },
  {
    name: "Сватко Иван Иванович",
    role: "Начальник транспортной логистики",
    bio: "Организует доставку продукции клиентам и партнёрам: маршруты, сроки отгрузки, взаимодействие с перевозчиками и контроль сохранности груза.",
  },
] as const;

export default function TeamPageClient() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(63,63,70,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.2) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-28">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-zinc-700 text-[11px] font-mono tracking-[0.24em] uppercase mb-4"
          >
            Люди бренда
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="text-white font-semibold tracking-tight leading-tight text-4xl sm:text-5xl"
          >
            Наша команда
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-zinc-400 text-base sm:text-lg leading-relaxed mt-5 max-w-3xl"
          >
            Люди, которые создают идеальный климат и следят за каждым этапом производства.
          </motion.p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {TEAM.map((person) => (
              <motion.article
                key={person.name}
                variants={item}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
              >
                <div className="aspect-[3/4] bg-zinc-900 rounded-xl border border-zinc-800" />
                <div className="mt-4">
                  <h2 className="text-white text-xl font-semibold tracking-tight">{person.name}</h2>
                  <p className="text-cyan-400 text-sm mt-1">{person.role}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed mt-2">{person.bio}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
