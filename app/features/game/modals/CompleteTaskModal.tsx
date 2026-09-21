"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface TaskCompleteSheetProps {
  isOpen: boolean;

  onContinue: () => void;
  onBack: () => void;

  points: number;
  accuracy: number;
  timeLabel: string;

  stanzaNumber: number;
  psalmNumber: number;
  isPsalmComplete: boolean;
}

export function TaskCompleteSheet({
  isOpen,
  onContinue,
  onBack,
  points,
  accuracy,
  timeLabel,
  stanzaNumber,
  psalmNumber,
  isPsalmComplete,
}: TaskCompleteSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);

      requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);

      const timeout = setTimeout(() => {
        setMounted(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const title = isPsalmComplete
    ? `Salmo ${psalmNumber} finalizado!`
    : `Estrofe ${stanzaNumber} finalizada!`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-complete-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-back/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Painel */}
      <div
        className={`relative w-full max-w-md rounded-t-3xl bg-[#FDF6EC] px-6 pb-8 pt-10 shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Davi */}
        <Image
          className="absolute left-1/2 -top-48 -translate-x-1/2"
          src="/img/daviCelebrateModal.png"
          alt="Davi"
          width={205}
          height={218}
        />

        {/* Título */}
        <h2
          id="task-complete-title"
          className="text-center font-domine text-3xl"
        >
          {title}
        </h2>

        {/* Indicadores */}
        <div className="relative mt-10 grid grid-cols-3 gap-4">
          {/* Pontos */}
          <div className="flex flex-col items-center justify-center gap-1 rounded-2xl p-2 border-4 border-[#734A1D]">
            <Image
              src="/svg/star.svg"
              alt="Pontos"
              width={42}
              height={42}
            />

            <div>
              <span className="text-xl font-bold text-[#2B2A28]">
                +{points}
              </span>
            </div>
          </div>

          {/* Acertos */}
          <div className="flex flex-col items-center justify-center gap-1 rounded-2xl p-2 border-4 border-[#734A1D]">
            <Image
              src="/svg/goal.svg"
              alt="Acertos"
              width={42}
              height={42}
            />

            <div>
              <span className="text-xl font-bold text-[#2B2A28]">
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Tempo */}
          <div className="flex flex-col items-center justify-center gap-1 rounded-2xl p-2 border-4 border-[#734A1D]">
            <Image
              src="/svg/clock.svg"
              alt="Tempo"
              width={42}
              height={42}
            />

            <div>
              <span className="text-xl font-bold text-[#2B2A28]">
                {timeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Continuar */}
        <button
          onClick={onContinue}
          className="btn btn-primary mt-10 w-full transition-transform active:scale-[0.98]"
        >
          Continuar
        </button>

        {/* Voltar */}
        <button
          onClick={onBack}
          className="mt-4 w-full rounded-2xl bg-[#FFF1DF] px-6 py-3 text-lg font-bold text-[#2B2A28] shadow-[0_4px_0_0_rgba(198,163,126,1)] transition-transform active:translate-y-[2px] active:shadow-none"
        >
          Voltar para o início
        </button>
      </div>
    </div>
  );
}