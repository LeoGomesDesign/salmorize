"use client";

import { PSALM_TOTAL_STEPS, type PsalmNode } from "@/lib/types/home";

type PsalmModalProps = {
  psalm: PsalmNode | null;
  onClose: () => void;
  onContinue: (psalm: PsalmNode) => void;
  onViewPsalm: (psalm: PsalmNode) => void;
};

export default function PsalmModal({
  psalm,
  onClose,
  onContinue,
  onViewPsalm,
}: PsalmModalProps) {
  if (!psalm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">

      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity hover:opacity-80"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-[300px] rounded-2xl px-6 py-6 flex flex-col items-center gap-5 shadow-2xl"
        style={{
          backgroundColor: "#2D4D42",
          animation: "tooltipIn 0.2s ease-out",
        }}
      >

        {/* Fechar modal */}
        <button
          onClick={onClose}
          className="absolute right-6 top-4 text-white transition-opacity hover:opacity-80 cursor-pointer"
          style={{ fontSize: "24px" }}
        >
          ✕
        </button>

        {/* Título */}
        <div className="w-full font-domine">
          <h2 className="text-2xl font-black text-white">
            Salmo {psalm.number}
          </h2>

          <p className="font-montserrat text-sm text-blue-100">
            Passo {psalm.currentStep} de {PSALM_TOTAL_STEPS}
          </p>
        </div>

        {psalm.status === "locked" && (
          <p className="text-center font-montserrat text-sm text-blue-100">
            Complete os passos anteriores para desbloquear este salmo.
          </p>
        )}

        {/* Continuar — somente Salmo ativo */}
        {psalm.status === "active" && (
          <button
            onClick={() => onContinue(psalm)}
            className="btn-secondary flex w-full cursor-pointer items-center justify-center text-center"
          >
            Decorar
          </button>
        )}

        {/* Ver salmo — todos os Salmos */}
        <button
          onClick={() => onViewPsalm(psalm)}
          className="btn-secondary flex w-full cursor-pointer items-center justify-center text-center"
        >
          Ver salmo
        </button>

      </div>

      <style>{`
        @keyframes tooltipIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}