"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import {
  FLIBEN_CERTIFICATE_DOCS,
  FLIBEN_PARTNER_NOTE,
  type FlibenDoc,
} from "@/constants/fliben-docs";
import { PATHS } from "@/constants/brand";

function CertificatePreview({ doc }: { doc: FlibenDoc }) {
  const hasPdf = Boolean(doc.file);
  const images = doc.previewImages ?? [];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white font-medium">{doc.title}</p>
          <p className="text-zinc-500 text-sm mt-1 leading-relaxed">{doc.description}</p>
        </div>
        {hasPdf && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={doc.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:text-white hover:border-zinc-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
              Открыть PDF
            </a>
            <a
              href={doc.file}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:text-white hover:border-cyan-400/40 transition-colors"
            >
              <Download className="w-4 h-4" strokeWidth={1.75} />
              Скачать
            </a>
          </div>
        )}
      </div>

      {hasPdf && (
        <iframe
          title={doc.title}
          src={`${doc.file}#view=FitH&toolbar=1`}
          className="w-full h-[min(78vh,900px)] bg-zinc-800"
        />
      )}

      {images.length > 0 && (
        <div className={`space-y-4 p-4 sm:p-6 ${hasPdf ? "border-t border-zinc-800" : ""}`}>
          {images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- локальные сканы сертификатов
            <img
              key={src}
              src={src}
              alt={`${doc.title} — страница ${index + 1}`}
              className="w-full rounded-xl border border-zinc-800 bg-white"
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CertificatesClient() {
  const [activeId, setActiveId] = useState(FLIBEN_CERTIFICATE_DOCS[0]?.id ?? "");
  const activeDoc =
    FLIBEN_CERTIFICATE_DOCS.find((d) => d.id === activeId) ?? FLIBEN_CERTIFICATE_DOCS[0];
  const multiple = FLIBEN_CERTIFICATE_DOCS.length > 1;

  return (
    <div className="min-h-screen bg-zinc-950 pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <Link
          href={PATHS.home}
          className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          На главную
        </Link>

        <h1 className="text-white font-semibold tracking-tight text-3xl sm:text-4xl mb-3">
          Сертификаты и свидетельства
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed max-w-3xl mb-4">
          Официальные документы на материалы и оборудование — просматривайте прямо на сайте, без
          скачивания.
        </p>
        <p className="text-zinc-600 text-sm leading-relaxed max-w-3xl mb-10">{FLIBEN_PARTNER_NOTE}</p>

        {activeDoc && !multiple && <CertificatePreview doc={activeDoc} />}

        {activeDoc && multiple && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6">
            <ul className="space-y-2">
              {FLIBEN_CERTIFICATE_DOCS.map((doc) => (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(doc.id)}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                      activeDoc.id === doc.id
                        ? "border-cyan-400/40 bg-zinc-900"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText
                        className="w-4 h-4 text-cyan-500/80 shrink-0 mt-0.5"
                        strokeWidth={1.75}
                      />
                      <div>
                        <p className="text-white text-sm font-medium leading-snug">{doc.title}</p>
                        <p className="text-zinc-600 text-xs mt-1">
                          {doc.file ? `${doc.sizeMb} МБ · PDF` : `${doc.previewImages?.length ?? 0} стр.`}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <CertificatePreview doc={activeDoc} />
          </div>
        )}
      </div>
    </div>
  );
}
