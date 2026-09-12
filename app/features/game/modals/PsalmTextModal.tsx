"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchPsalmVerses,
  type PsalmVerse,
} from "@/lib/supabase/psalm-queries";
import type { PsalmNode } from "@/lib/types/home";

type PsalmTextModalProps = {
  psalm: PsalmNode;
  onClose: () => void;
};

export default function PsalmTextModal({
  psalm,
  onClose,
}: PsalmTextModalProps) {
  const [verses, setVerses] = useState<PsalmVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVerses() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const data = await fetchPsalmVerses(
          supabase,
          psalm.id
        );

        setVerses(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar o Salmo."
        );
      } finally {
        setLoading(false);
      }
    }

    loadVerses();
  }, [psalm.id]);

  const stanzas = verses.reduce<
    Record<number, PsalmVerse[]>
  >((groups, verse) => {
    if (!groups[verse.stanzaId]) {
      groups[verse.stanzaId] = [];
    }

    groups[verse.stanzaId].push(verse);

    return groups;
  }, {});

  const orderedStanzas = Object.entries(stanzas).sort(
    ([, versesA], [, versesB]) =>
      versesA[0].stanzaPosition -
      versesB[0].stanzaPosition
  );

  return (
  <div className="fixed inset-0 z-[60]">

    {/* Overlay */}
    <button
      type="button"
      aria-label="Fechar"
      onClick={onClose}
      className="absolute inset-0 bg-black/70"
    />

    {/* Modal */}
    <div className="relative z-10 mx-auto h-full max-w-3xl">

      <div className="relative mx-auto flex h-full max-w-2xl flex-col overflow-hidden  bg-[#F2EDE4] shadow-2xl">

        {/* ============================================================
            HEADER
            Não possui scroll
            ============================================================ */}
        <header className="relative shrink-0 border-b border-stone-300 bg-[#F2EDE4] px-6 pb-5 pt-8">

          {/* Fechar */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full text-4xl font-bold text-stone-700 transition-opacity hover:opacity-70"
          >
            ×
          </button>

          {/* Título */}
          <div className="text-left">
            <p className="font-domine text-sm font-bold uppercase tracking-wider text-stone-500">
              Salmo {psalm.number}
            </p>

            <h1 className="mt-2  font-domine text-xl font-bold text-stone-800">
              {psalm.label}
            </h1>
          </div>

          {/* Progresso */}
          <div className="mx-auto mt-5 w-full max-w-md">

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500">
                Seu progresso
              </span>

              <span className="font-domine text-sm font-bold text-stone-700">
                {psalm.progress}%
              </span>
            </div>

            <div
              className="h-3 w-full overflow-hidden rounded-full"
              style={{
                backgroundColor: "#D8D2C8",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${psalm.progress}%`,
                  background:
                    "linear-gradient(90deg, #279838 0%, #35DE4F 100%)",
                }}
              />
            </div>

          </div>
        </header>

        {/* ============================================================
            TEXTO
            SOMENTE ESTA ÁREA POSSUI SCROLL
            ============================================================ */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4  pb-16">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <p className="text-sm text-stone-500">
                Carregando Salmo...
              </p>
            </div>
          )}

          {/* Erro */}
          {!loading && error && (
            <div className="py-12 text-center">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Texto */}
          {!loading && !error && (
            <article className="font-domine text-[14px] leading-8 text-stone-800">

              {orderedStanzas.map(
                ([stanzaId, stanzaVerses]) => (
                  <div
                    key={stanzaId}
                    className="mb-6 last:mb-0"
                  >
                    {stanzaVerses
                      .sort(
                        (a, b) =>
                          a.position - b.position
                      )
                      .map((verse) => (
                        <p
                        key={verse.id}
                        className="mb-1 last:mb-0"
                        >
                          {verse.text}
                        </p>  
                          
                      ))}
                  </div>
                )
              )}

            </article>
          )}

        </div>

      </div>
    </div>
  </div>
);
}