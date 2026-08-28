"use client";

import { PSALM_TOTAL_STEPS, type PsalmNode } from "@/lib/types/home";

type PsalmModalPosition = {
  top: number;
  left: number;
};

type PsalmModalProps = {
  psalm: PsalmNode | null;
  onClose: () => void;
  onContinue: (psalm: PsalmNode) => void;
  position: PsalmModalPosition | null;
}


export default function PsalmModal({ 
  psalm,
  position, 
  onClose,
  onContinue, 
}: PsalmModalProps) {

if (!psalm || !position) return null;

return (
    <div
      className="fixed z-50"
      style={{
        top: position.top,
        left: position.left,
        animation: "tooltipIn 0.2s ease-out",
      }}
      
    >
      <div
        className="relative px-6 py-6  rounded-2xl flex flex-col items-center gap-5 w-[190px] shadow-2xl"
        style={{ backgroundColor: "#2D4D42" }}
        
      >
        {/* Fechar modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-white hover:opacity-80 transition-opacity cursor-pointer"
          style={{ fontSize: "24px"}}
        >
          ✕
        </button>

        

        {/* Título */}
        <div className="font-domine w-full">
          <h2 className="text-white font-black text-2xl ">
            Salmo {psalm.number}
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

        {/* Botão Ver salmo */} 
        <button
          onClick={() => onContinue(psalm)}
          className="btn-secondary w-full text-center cursor-pointer flex justify-center items-center"
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