"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, FileText, Globe, Mail, MapPin, Phone } from "lucide-react";
import { PARTNERS } from "@/constants/partners";

function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
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

export default function OurPartnersClient() {
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
            Экосистема СТП-КОТОВ
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="text-white font-semibold tracking-tight leading-tight text-4xl sm:text-5xl"
          >
            Наши партнёры
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-zinc-400 text-base sm:text-lg leading-relaxed mt-5 max-w-3xl"
          >
            Проверенные компании, с которыми мы работаем на объектах и в производстве.
            Контакты и сайты — для прямой связи по профильным задачам.
          </motion.p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {PARTNERS.map((partner) => (
              <motion.article
                key={partner.id}
                variants={item}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden hover:border-cyan-400/35 hover:shadow-[0_0_28px_rgba(0,210,255,0.14)] transition-[box-shadow,border-color] duration-300"
              >
                <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-4">
                  {/* #fff: не bg-white — в light-теме --color-white инвертируется в почти чёрный */}
                  <div
                    className="partner-logo-plate min-h-12 flex items-center rounded-lg px-4 py-2.5 shadow-sm"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <Image
                      src={partner.logo}
                      alt={`Логотип ${partner.name}`}
                      width={567}
                      height={142}
                      className="h-7 sm:h-9 w-auto max-w-[200px] object-contain object-left"
                    />
                  </div>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                  >
                    Сайт
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                  </a>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h2 className="text-white text-2xl font-semibold tracking-tight">
                      {partner.name}
                    </h2>
                    <p className="text-cyan-400/90 text-sm mt-1">{partner.tagline}</p>
                    <p className="text-zinc-400 text-[15px] leading-relaxed mt-3">
                      {partner.description}
                    </p>
                  </div>

                  {partner.catalogUrl && (
                    <a
                      href={partner.catalogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors w-fit"
                    >
                      Каталог на сайте партнёра
                      <ExternalLink className="w-4 h-4" strokeWidth={2} />
                    </a>
                  )}
                  {partner.services && partner.services.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {partner.services.map((service) => (
                        <span
                          key={service}
                          className="px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/60 text-zinc-400 text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {partner.resources && partner.resources.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-zinc-600 text-xs uppercase tracking-wider">Материалы</p>
                      <ul className="space-y-2">
                        {partner.resources.map((resource) => (
                          <li key={resource.href}>
                            {isInternalHref(resource.href) ? (
                              <Link
                                href={resource.href}
                                className="inline-flex items-start gap-2 text-zinc-300 text-sm hover:text-white transition-colors"
                              >
                                <FileText className="w-4 h-4 text-cyan-500/80 shrink-0 mt-0.5" strokeWidth={1.75} />
                                <span>{resource.label}</span>
                                <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0 mt-1" strokeWidth={2} />
                              </Link>
                            ) : (
                              <a
                                href={resource.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-start gap-2 text-zinc-300 text-sm hover:text-white transition-colors"
                              >
                                <FileText className="w-4 h-4 text-cyan-500/80 shrink-0 mt-0.5" strokeWidth={1.75} />
                                <span>{resource.label}</span>
                                <ExternalLink className="w-3 h-3 text-zinc-600 shrink-0 mt-1" strokeWidth={2} />
                              </a>
                            )}
                          </li>
                        ))}                      </ul>
                    </div>
                  )}

                  <dl className="space-y-3 pt-1 border-t border-zinc-800">
                    <div className="flex items-start gap-3 pt-4">
                      <Globe className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div>
                        <dt className="text-zinc-600 text-xs uppercase tracking-wider mb-0.5">Сайт</dt>
                        <dd>
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 text-sm hover:text-white transition-colors break-all"
                          >
                            {partner.website.replace(/^https?:\/\//, "")}
                          </a>
                        </dd>
                      </div>
                    </div>

                    {partner.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                        <div>
                          <dt className="text-zinc-600 text-xs uppercase tracking-wider mb-0.5">Телефон</dt>
                          <dd>
                            <a
                              href={partner.phoneTel ? `tel:${partner.phoneTel}` : undefined}
                              className="text-zinc-300 text-sm hover:text-white transition-colors"
                            >
                              {partner.phone}
                            </a>
                          </dd>
                        </div>
                      </div>
                    )}

                    {partner.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                        <div>
                          <dt className="text-zinc-600 text-xs uppercase tracking-wider mb-0.5">Email</dt>
                          <dd>
                            <a
                              href={`mailto:${partner.email}`}
                              className="text-zinc-300 text-sm hover:text-white transition-colors break-all"
                            >
                              {partner.email}
                            </a>
                          </dd>
                        </div>
                      </div>
                    )}

                    {partner.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                        <div>
                          <dt className="text-zinc-600 text-xs uppercase tracking-wider mb-0.5">Адрес</dt>
                          <dd className="text-zinc-300 text-sm leading-relaxed">{partner.address}</dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
