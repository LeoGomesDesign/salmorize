'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SuccessModal from '@/app/components/game/modals/SuccessModal';
import FailureModal from '@/app/components/game/modals/FailureModal';

export default function StepFour() {
  const router = useRouter();

  // 1. Definição do gabarito das duas lacunas vazias
  const correctSlot1 = "que";
  const correctSlot2 = "no";
  const correctSlot3 = "malvados";

  // Palavras que o usuário pode clicar na parte inferior
  const initialAvailableWords = ['que', 'quem', 'no', 'nos', 'malvados', 'perversos'];

  // 2. Estados da Interface
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);
  const [slot3, setSlot3] = useState<string | null>(null);
  const [availableWords, setAvailableWords] = useState<string[]>(initialAvailableWords);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // 3. Lógica ao clicar em uma palavra de baixo
  const handleSelectWord = (word: string) => {
    // Preenche a primeira lacuna vazia que encontrar de forma automática
    if (!slot1) {
      setSlot1(word);
      setAvailableWords(availableWords.filter(w => w !== word));
    } else if (!slot2) {
      setSlot2(word);
      setAvailableWords(availableWords.filter(w => w !== word));
    } else if (!slot3) {
      setSlot3(word);
      setAvailableWords(availableWords.filter(w => w !== word));
    }
  };

  // 4. Lógica para devolver a palavra se clicar na lacuna lá em cima
  const handleRemoveWord = (word: string, slotNumber: number) => {
    if (slotNumber === 1) setSlot1(null);
    if (slotNumber === 2) setSlot2(null);
    if (slotNumber === 3) setSlot3(null);
    setAvailableWords([...availableWords, word]);
  };

  // O botão "Verificar" acende apenas se as três lacunas estiverem preenchidas
  const isButtonActive = slot1 !== null && slot2 !== null && slot3 !== null;

  // 5. Validação final do exercício
  const handleVerify = () => {
    if (!isButtonActive) return;

    if (slot1 === correctSlot1 && slot2 === correctSlot2 && slot3 === correctSlot3) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  };

  useEffect(() => {
        const t = setTimeout(() => setBubbleVisible(true), 400);
        return () => clearTimeout(t);
      }, []);
    
      useEffect(() => {
        const audioTimer = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {
              // autoplay may be blocked until user interaction
            });
          }
        }, 200);
        return () => clearTimeout(audioTimer);
    }, []);  


function DavidSpeechBubble({
  visible,
  audioRef,
  onPlay,
}: {
  visible: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onPlay: () => void;
}) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: visible ? "0.6s" : "0s",
      }}
      className="absolute -bottom-4.5 -right-20 z-1"
    >
      <button
        type="button"
        onClick={onPlay}
        className="relative bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-1 cursor-pointer"
      >
        <span style={{ fontSize: 18 }}>🔊</span>
        <span
          className="text-xs font-medium"
          style={{ color: "#6B6B6B", fontFamily: "var(--font-montserrat)" }}
        >
          Escutar novamente
        </span>
      </button>
      <audio ref={audioRef} src="/audio/psalm-1/psalm1_step4.mp3" preload="auto" />
    </div>
  );
}

  return (
    <div className="h-screen overflow-hidden bg-app text-[#2D2D2D] p-4 flex flex-col justify-between max-w-md mx-auto relative">
      
      {/* TOPO: Botão Fechar e Progresso (Passo 4: 65%) */}
      <div className="flex flex-col gap-4 w-full pt-4">
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={() => router.push('/home')}
            className="flex items-center gap-1 bg-white px-4 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold shadow-sm hover:bg-gray-50 text-gray-700"
          >
            ✕ Fechar
          </button>
          <div className="flex items-center gap-1 font-bold text-lg text-[#2D2D2D]">
            <span className="text-[#FFC72C]">⚡</span> 4
          </div>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
          <div className="bg-[#FFC72C] h-full w-[65%] rounded-full"></div>
        </div>
      </div>

      {/* CONTEÚDO CENTRAL: Título, Personagem e Caixa de Texto Mixada */}
      <div className="flex flex-col items-center flex-1 mt-4">
        <h1 className="text-2xl font-serif font-bold text-left w-full px-2 mb-12">
          Complete a frase
        </h1>

        {/* Ilustração e Botão Flutuante */}
        <div className="relative w-48 h-56 flex justify-center items-end mb-4">
           <Image
            src="/img/DaviSpeaking.png" 
            height={224}
            width={192}
            alt="Rei Davi com Harpa" 
            className="w-full h-full object-contain"
                    />
           {/* Botão Escutar Novamente posicionado ao lado */}
          {/* Speech bubble */}
          <DavidSpeechBubble
            visible={bubbleVisible}
            audioRef={audioRef}
            onPlay={() => {
              if (audioRef.current) {
                audioRef.current.play().catch(() => {
                  // browser may block play until interaction
                });
              }
            }}
          />
        </div>

        {/* CAIXA DE TEXTO MIXADA (Igual ao layout da foto) */}
        <div className="w-full bg-white/50  border border-gray-300 rounded-2xl p-6 min-h-[100px] flex flex-wrap gap-2 items-center justify-center mb-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
            
            {/* Lacuna 1 (Início da frase) */}
            <button 
              onClick={() => slot1 && handleRemoveWord(slot1, 1)}
              className={`min-w-[60px] h-8 border-b-2 border-dashed border-gray-400 text-center font-sans font-medium px-2 ${slot1 ? 'border-none bg-gray-100 rounded-lg text-base' : ''}`}
            >
              {slot1 || ""}
            </button>

            <span>não entra</span>

            {/* Lacuna 2 (Meio) */}
            <button 
              onClick={() => slot2 && handleRemoveWord(slot2, 2)}
              className={`min-w-[60px] h-8 border-b-2 border-dashed border-gray-400 text-center font-sans font-medium px-2 ${slot2 ? 'border-none bg-gray-100 rounded-lg text-base' : ''}`}
            >
              {slot2 || ""}
            </button>

            <span>caminho</span>
            <span>dos</span>

            {/* Lacuna 3 (Fim) */}
            <button 
              onClick={() => slot3 && handleRemoveWord(slot3, 3)}
              className={`min-w-[80px] h-8 border-b-2 border-dashed border-gray-400 text-center font-sans font-medium px-2 ${slot3 ? 'border-none bg-gray-100 rounded-lg text-base' : ''}`}
            >
              {slot3 || ""}
            </button>

          </div>
        </div>
      </div>

      {/* PAINEL INFERIOR: Seleção de Palavras e Botão de Verificação */}
      <div className="flex flex-col gap-4 pb-6 w-full px-2">
        <p className="text-sm font-serif text-gray-600 font-medium">
          Selecione as palavras corretas:
        </p>

        {/* Grade de Palavras Disponíveis */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {availableWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleSelectWord(word)}
              className="bg-white border border-gray-300 px-4 py-2 rounded-xl text-base font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Botão Verificar Estilizado Dinamicamente */}
        <button 
          onClick={handleVerify}
          disabled={!isButtonActive}
          className={`w-full text-lg font-bold py-3 rounded-2xl shadow-md transition-all border-b-4 ${
            isButtonActive 
              ? 'btn btn-primary cursor-pointer' 
              : 'bg-[#C0C0C0] text-white border-[#A0A0A0] cursor-not-allowed'
          }`}
        >
          Verificar
        </button>
      </div>

      {/* Modais padrão de feedback */}
      
        
      <SuccessModal visible={showSuccess} onContinue={() => { setShowSuccess(false); router.push('/psalms/psalms-1/step-5'); }} />
      <FailureModal visible={showFailure} onRetry={() => {
        setShowFailure(false);
        // Opcional: Reiniciar o exercício limpando as lacunas
        setSlot1(null); setSlot2(null); setSlot3(null);
        setAvailableWords(initialAvailableWords);
      }} />
      

    </div>
  );
}
