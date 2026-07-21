'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import SuccessModal from '@/app/features/game/modals/SuccessModal';
import FailureModal from '@/app/features/game/modals/FailureModal';
import type { Task } from "@/lib/types/task";

type RecapRound = {
  verseId: number;
  basePhrase: string;
  correctAnswer: string;
  alternatives: string[];
};

type RecapTaskProps = {
  task: Task;
  onCompleted: () => Promise<void>;
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

function buildRecapRounds(task: Task): RecapRound[] {
  console.log(task.recap_verses);
  if (!task.recap_verses || task.recap_verses.length === 0) {
    return [];
  }

  return task.recap_verses.map((verse) => {
    const words = verse.text.split(" ");

    const splitIndex = Math.max( 2, 
      Math.floor(words.length * 0.3) 
    );

    const basePhrase =
     words.slice(0, splitIndex).join(" ") + "..."; 

    const correctAnswer =
      words.slice(splitIndex).join(" ");

    const wrongAnswers = task.recap_verses
    .filter(v => v.id !== verse.id)
    .map(v => {
    const words = v.text.split(" ");

    const splitIndex = Math.max(
      2,
      Math.floor(words.length * 0.3)
    );

    return words.slice(splitIndex).join(" ");
    });

    console.log({
  verseAtual: verse.id,
  recapVerses: task.recap_verses.length,
  wrongAnswers,
});

    const alternatives = shuffleArray([
    correctAnswer,
    ...wrongAnswers.slice(0, 2),
    ]);

    

     
    return {
      verseId: verse.id,
      basePhrase,
      correctAnswer,
      alternatives,
    };
  });
}

export default function RecapTask({
  task,
  onCompleted,
}: RecapTaskProps) {
  
console.log(task);

  // 1. ESTADO CENTRAL: Controla em qual rodada do exercício o usuário está (0 ou 1)
  const [currentRound, setCurrentRound] = useState(0);

  // Estados para controlar os modais finais do sistema
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // 2. BANCO DE DADOS DAS FRASES: Organizado em rodadas (Rounds)
  const roundsData = buildRecapRounds(task);

  if (roundsData.length === 0) {
  return <p>Nenhum recap encontrado.</p>;
  }

  // Armazena as respostas que o usuário escolheu em cada rodada
  const [answers, setAnswers] = useState<(string | null)[]>(
  Array(roundsData.length).fill(null)
  );

  // Captura os dados da rodada que está ativa no momento
  const activeRound = roundsData[currentRound];

  // 1. LÓGICA DO CLIQUE ATUALIZADA (Substitua a sua função handleSelectOption por esta)
  const handleSelectOption = (option: string) => {
    // Correção: Atualiza o estado usando o padrão correto do React para clonar arrays
    setAnswers(prevAnswers => {
      const nextAnswers = [...prevAnswers];
      nextAnswers[currentRound] = option;
      return nextAnswers;
    });

    // Verifica se a resposta está certa
    if (option === activeRound.correctAnswer) {
      setTimeout(() => {
        if (currentRound < roundsData.length - 1) {
          // Se acertou a rodada 1, muda o número da rodada para ativar o próximo bloco
          setCurrentRound(prev => prev + 1);
        } else {
          // Se acertou a rodada 2, abre o modal de sucesso final
          setShowSuccess(true);
        }
      }, 500);
    } else {
      // Se errar em qualquer uma das etapas, dispara o modal de falha na hora
      setTimeout(() => {
        setShowFailure(true);
      }, 300);
    }
  };



  return (
    <div className="h-screen overflow-hidden bg-[#FDF6EC] text-[#2D2D2D] font-sans p-4 flex flex-col justify-between max-w-md mx-auto relative border border-gray-200 shadow-lg rounded-3xl">
      
      {/* 1. TOPO: Botão Fechar e Barra de Progresso */}
      <div className="flex flex-col gap-4 w-full pt-4">
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-1 bg-white px-4 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold shadow-sm hover:bg-gray-50 text-gray-700"
          >
            ✕ Fechar
          </button>
          <div className="flex items-center gap-1 font-bold text-lg text-[#2D2D2D]">
            <span className="text-[#FFC72C]">⚡</span> 4
          </div>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
          {/* Progresso dinâmico com base na rodada atual */}
          <div 
            className="bg-[#FFC72C] h-full rounded-full transition-all duration-500"
            style={{ width: currentRound === 0 ? '45%' : '60%' }}
          ></div>
        </div>
      </div>

        {/* 2. CONTEÚDO CENTRAL: Histórico de Diálogos acumulados */}
  <div className="flex flex-col flex-1 mt-6 px-2 overflow-hidden gap-y-4">
    <h1 className="text-2xl font-serif font-bold text-left mb-2">
      Continue o Salmo:
    </h1>

    {/* --- BLOCO DA RODADA 1 --- */}
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <img 
          src="https://placeholder.com" 
          alt="Rei Davi" 
          className="w-11 h-11 rounded-full border border-gray-200 object-cover shadow-sm"
        />
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm text-sm font-medium">
          {roundsData[0].basePhrase}
        </div>
      </div>
      
      <div className="flex items-center gap-3 justify-end pr-1">
        <div className="w-56 h-10 bg-[#F2F2F2] border border-gray-300 rounded-xl flex items-center justify-center shadow-inner text-sm font-medium text-gray-800 px-3">
          {answers[0] || ""}
        </div>
        <img 
          src="https://placeholder.com" 
          alt="Ovelhinha" 
          className="w-11 h-11 rounded-full object-cover"
        />
      </div>
    </div>

    {/* --- BLOCO DA RODADA 2 --- */}
    {/* Só aparece se o usuário já estiver na segunda rodada ou já tiver respondido ela */}
    {currentRound >= 1 && (
      <div className="flex flex-col gap-2.5 transition-all duration-300">
        <div className="flex items-center gap-3">
          <img 
            src="https://placeholder.com" 
            alt="Rei Davi" 
            className="w-11 h-11 rounded-full border border-gray-200 object-cover shadow-sm"
          />
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm text-sm font-medium">
            {roundsData[1].basePhrase}
          </div>
        </div>
        
        <div className="flex items-center gap-3 justify-end pr-1">
          <div className="w-56 h-10 bg-[#F2F2F2] border border-gray-300 rounded-xl flex items-center justify-center shadow-inner text-sm font-medium text-gray-800 px-3">
            {answers[1] || ""}
          </div>
          <img 
            src="https://placeholder.com" 
            alt="Ovelhinha" 
            className="w-11 h-11 rounded-full object-cover"
          />
        </div>
      </div>
    )}

        {/* --- BLOCO DA RODADA 3 --- */}
    {/* Só aparece se o usuário já estiver na terceira rodada ou já tiver respondido ela */}
    {currentRound >= 2 && (
      <div className="flex flex-col gap-2.5 transition-all duration-300">
        <div className="flex items-center gap-3">
          <img 
            src="https://placeholder.com" 
            alt="Rei Davi" 
            className="w-11 h-11 rounded-full border border-gray-200 object-cover shadow-sm"
          />
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm text-sm font-medium">
            {roundsData[2].basePhrase}
          </div>
        </div>
        
        <div className="flex items-center gap-3 justify-end pr-1">
          <div className="w-56 h-10 bg-[#F2F2F2] border border-gray-300 rounded-xl flex items-center justify-center shadow-inner text-sm font-medium text-gray-800 px-3">
            {answers[2] || ""}
          </div>
          <img 
            src="https://placeholder.com" 
            alt="Ovelhinha" 
            className="w-11 h-11 rounded-full object-cover"
          />
        </div>
      </div>
    )}
  </div>



      {/* 3. PAINÉL INFERIOR: Texto dinâmico e botões de opções que mudam de acordo com a rodada */}
      <div className="flex flex-col gap-3 pb-6 w-full px-2">
        <p className="text-base font-serif text-gray-800 font-medium mb-1">
          Qual a sequencia correta?
        </p>

        {/* Renderiza dinamicamente as alternativas da rodada ativa */}
        {activeRound.alternatives.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectOption(option)}
            className="w-full bg-[#FFEAD2] border-2 border-b-4 border-[#F5CBA7] active:border-b-2 active:mt-[2px] py-3.5 rounded-2xl text-lg font-bold text-black shadow-sm transition-all hover:bg-[#FDD7B2] text-center tracking-wide"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Integração nativa com os Modais de Sucesso e Falha do seu sistema */}
    

 

      
     {/* MODAIS DE FEEDBACK (Ficam aqui embaixo para renderizar por cima da tela) */}
      <SuccessModal
        visible={showSuccess}
        onContinue={async () => {
          setShowSuccess(false);
          await onCompleted();
          
          // OU se quiser abrir o modal de recompensa primeiro, como no seu exemplo:
          // setShowRewardModal(true);
        }}
      />
   
      <FailureModal
        visible={showFailure}
        onRetry={() => {
          setShowFailure(false);
          // Opcional: Limpar as palavras para o usuário tentar do zero se quiser
          // setSelectedWords([]);
          // setAvailableWords(['Feliz', 'não', 'aquele', 'todo', 'é', 'que', 'anda']);
        }}
      />
      
      {/* Se for usar o RewardModal, adicione ele aqui também da mesma forma */}
    </div>
    
 )  
}

    