'use client';

import { useState, useEffect } from "react";
import Image from "next/image";


interface TaskCompleteSheetProps {
  isOpen: boolean;
  
  onContinue: () => void;
  points: number;
  accuracy: number;
  timeLabel: string;
  title?: string;
  buttonLabel?: string;
}


export function TaskCompleteSheet({ 
    isOpen,
    onContinue,
    points,
    accuracy,
    timeLabel,
    title = "Tarefa Finalizada!!",
    buttonLabel = "Continuar"
}: TaskCompleteSheetProps) {
  // Controla se o sheet está montado no DOM (para permitir a animação de saída)
  const [mounted, setMounted] = useState(false);
  // Controla a posição (aberto/fechado) — separado do "mounted" para o CSS transition funcionar
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setMounted(true);
        requestAnimationFrame(() => setVisible(true));
    } else {
        setVisible(false);
        const timeout = setTimeout(() => setMounted(false), 300); //Animação de saída

        return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-end justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-complete-title"
        >
        {/* Backdrop */}
        <div
            className={`absolute inset-0 bg-back/50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
            
        />

        {/* Painel */}
        <div
            className={`relative w-full max-w-md rounded-t-3xl bg-[#FDF6EC] px-6 pb-8 pt-10 shadow-2xl transition-transform duration-300 ease-out $ {visible ? 'translate-y-0' : 'translate-y-full' }`}
        >

        <Image
            className="animation-fade transition absolute left-1/2 -translate-x-1/2 -top-48"
            src="/img/daviCelebrateModal.png"
            alt="Davi"
            width={205}
            height={218}
        />
            
        <h2
            id="task-complete-title"
            className="text-center font-domine text-3xl">
                {title}
        </h2>

        <div className="relative mt-6 grid grid-cols-3 gap-4 mt-10">
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-linear-to-b from-[#FFEFD0] to-[#FDE1BC] px-2 py-4 shadow-[4px_4px_0_0_rgba(115,74,29,1)]"
            > 
                <Image
                className=" absolute bottom-18 "
                src="/svg/star.svg"
                alt="EXP Points"
                width={42}
                height={42}
                />

                <span className="text-sm text-[#6B5B3E]">Pontos</span>
                <div>
                    <span className="text-xl font-bold text-[#2B2A28]">{points}</span>
                    <span className="text-x font-medium text-[#2B2A28]">XP</span>
                </div>
           </div> 

           <div className="flex flex-col items-center gap-1 rounded-2xl bg-linear-to-b from-[#FFEFD0] to-[#FDE1BC] px-2 py-4 shadow-[4px_4px_0_0_rgba(115,74,29,1)]"
            > 
                <Image
                className=" absolute bottom-18 transition-opacity duration-300 ease hover:scale-110"
                src="/svg/goal.svg"
                alt="EXP Points"
                width={42}
                height={42}
                />

                <span className="text-sm text-[#6B5B3E]">Acertos</span>
                <div>
                    <span className="text-xl font-bold text-[#2B2A28]">{accuracy}</span>
                    <span className="text-x font-medium text-[#2B2A28]">%</span>
                </div>
           </div>

           <div className="flex flex-col items-center gap-1 rounded-2xl bg-linear-to-b from-[#FFEFD0] to-[#FDE1BC] px-2 py-4 shadow-[4px_4px_0_0_rgba(115,74,29,1)]"
            > 
                <Image
                className=" absolute bottom-18 transition-opacity duration-300 ease hover:scale-110"
                src="/svg/clock.svg"
                alt="EXP Points"
                width={42}
                height={42}
                />

                <span className="text-sm text-[#6B5B3E]">Tempo</span>
                <div>
                    <span className="text-xl font-bold text-[#2B2A28]">{timeLabel}</span>
                    
                </div>
           </div>    
            
        </div>

        
 
        <button
          onClick={onContinue}
          className="btn btn-primary w-full mt-10 transition-transform active:scale-[0.98]"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
 
