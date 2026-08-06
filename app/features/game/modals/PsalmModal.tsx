"use client";

import { PSALM_TOTAL_STEPS, type PsalmNode } from "@/lib/types/home";

type PsalmModalProps = {
    psalm: PsalmNode | null;
    onClose: () => void;
    onContinue: (psalm: PsalmNode) => void;
}

export default function PsalmModal({ 
  psalm, 
  onClose,
  onContinue, 
}: PsalmModalProps) {

if (!psalm) return null;

return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", animation: "fadeIn 0.3s ease-in-out" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-3xl px-8 py-8 flex flex-col items-center gap-6 w-[260] mx-4 shadow-2xl"
        style={{ backgroundColor: "#2D4D42" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-white hover:opacity-80 transition-opacity"
          style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}
        >
          ✕
        </button>

        

        {/* Título */}
        <div className="font-domine w-full">
          <h2 className="text-white font-black text-3xl mb-2">
            Samo {psalm.number}
          </h2>
          <p className="text-blue-100 font-montserrat text-sm">
            Passo {psalm.currentStep} de {PSALM_TOTAL_STEPS}
          </p>        
        </div>

        {/* Botão Continuar */} 
        <button
          onClick={() => onContinue(psalm)}
          className="btn-secondary w-full text-center cursor-pointer flex justify-center items-center"
          >
          Continuar
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}