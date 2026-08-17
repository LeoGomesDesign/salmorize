'use client';

import React, { useEffect, useRef, useState } from 'react';

import SuccessModal from '@/app/features/game/modals/SuccessModal';
import FailureModal from '@/app/features/game/modals/FailureModal';
import { TaskCompleteSheet } from '@/app/features/game/modals/CompleteTaskModal';
import type { Task } from "@/lib/types/task";
import HeaderBackButton from '@/app/features/game/components/task/HeaderBackButton';
import ProgressBar from '@/app/features/game/components/task/ProgressBar';

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

  const wrongAnswers = shuffleArray(
    task.psalm_verses
    .filter(v => v.id !== verse.id)
    .map(v => {
    const words = v.text.split(" ");

    const splitIndex = Math.max(
      2,
      Math.floor(words.length * 0.3)
    );

    return words.slice(splitIndex).join(" ");
    })
  );


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

  const progressPercent = (task.task_order / task.stanza_total_tasks) * 100;
  // 1. ESTADO CENTRAL: Controla em qual rodada do exercício o usuário está (0 ou 1)
  const [currentRound, setCurrentRound] = useState(0);

  // Estados para controlar os modais finais do sistema
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const roundsContainerRef = useRef<HTMLDivElement | null>(null);

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
    // Última rodada do Recap
  const isLastTaskOfStanza =
    task.task_order === task.stanza_total_tasks;

  if (isLastTaskOfStanza) {
    setShowComplete(true);
  } else {
    setShowSuccess(true);
  }
}
      }, 500);
    } else {
      // Se errar em qualquer uma das etapas, dispara o modal de falha na hora
      setTimeout(() => {
        setShowFailure(true);
      }, 300);
    }
  };
 
  useEffect(() => {
    if (!roundsContainerRef.current || currentRound < 2) return;

    const roundElements = roundsContainerRef.current.querySelectorAll('[data-round-index]');
    const targetIndex = currentRound - 1;
    const targetElement = roundElements[targetIndex] as HTMLElement | undefined;

    if (!targetElement) return;

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentRound]);

  return (
    <div className="h-screen overflow-hidden bg-[#FDF6EC] text-[#2D2D2D] font-sans">
      <div className="mx-auto max-w-md h-full flex flex-col p-4">
        {/* 1. TOPO: Botão Voltar */}
                  <div className="flex items-center gap-2">
                    
                    <HeaderBackButton onClick={() => window.history.back()} />
                    <ProgressBar task={task} />
                  </div>

        <div className="flex-1 flex flex-col mt-6 overflow-hidden">
          <h1 className="text-2xl font-serif font-bold text-left mb-2">
            Continue o Salmo:
          </h1>

          <div
            ref={roundsContainerRef}
            className="flex-1 overflow-y-auto pr-1 space-y-4"
            style={{ scrollPaddingTop: 8 }}
          >
            {roundsData.map((round, index) => {
              if (index > currentRound) return null;

              return (
                <div
                  key={index}
                  data-round-index={index}
                  className="flex flex-col gap-2.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/img/david_Recap.png"
                      alt="Rei Davi"
                      className="w-18 h-18 rounded-full border border-gray-200 object-cover shadow-sm"
                    />

                    <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm text-sm font-medium">
                      {round.basePhrase}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end pr-1">
                    <div className="w-56 h-10 bg-[#F2F2F2] border border-gray-300 rounded-xl flex items-center justify-center shadow-inner text-sm font-medium text-gray-800 px-3">
                      {answers[index] || ""}
                    </div>

                    <img
                      src="/img/ovelha_Recap.png"
                      alt="Ovelhinha"
                      className="w-18 h-18 rounded-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-none flex flex-col gap-3 pb-6 w-full px-2">
          <p className="text-base font-serif text-gray-800 font-medium mb-1">
            Qual a sequencia correta?
          </p>

          {activeRound.alternatives.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(option)}
              className="w-full bg-[#FFEAD2] border-2 border-b-4 border-[#F5CBA7] active:border-b-2 active:mt-0.5 py-3.5 rounded-2xl text-lg font-bold text-black shadow-sm transition-all hover:bg-[#FDD7B2] text-center tracking-wide"
            >
              {option}
            </button>
          ))}
        </div>

        <SuccessModal
          visible={showSuccess}
          onContinue={async () => {
            setShowSuccess(false);
            await onCompleted();
          }}
        />

        <FailureModal
          visible={showFailure}
          onRetry={() => {
            setShowFailure(false);
            setAnswers((prevAnswers) => {
              const nextAnswers = [...prevAnswers];
              nextAnswers[currentRound] = null;
              return nextAnswers;
            });
          }}
        />

        {showComplete ? (
          <div className="fixed inset-0 z-40 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: 'rgba(34, 34, 34, 0.8)',
                backdropFilter: 'blur(8px)',
              }}
            />
          </div>
        ) : null}

        <TaskCompleteSheet
          isOpen={showComplete}
          onContinue={async () => {
            setShowComplete(false);
            await onCompleted();
          }}
          points={12}
          accuracy={100}
          timeLabel="0:45"
        />
      </div>
    </div>
  );
}

    