'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import SuccessModal from '@/app/features/game/modals/SuccessModal';
import FailureModal from '@/app/features/game/modals/FailureModal';
import type { Task } from "@/lib/types/task";




// 1. Importações do DnD Kit para o efeito de arrastar
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';


// --- COMPONENTE AUXILIAR PARA A PALAVRA ARRASTÁVEL ---
// Criamos este pequeno bloco para dar o poder de "drag" para cada palavra individualmente
function SortableWord({ word, onRemove }: { word: string; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: word });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Deixa o elemento meio transparente enquanto ele é arrastado para dar um efeito bonito
    opacity: isDragging ? 0.5 : 1, 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // listeners e attributes dão os superpoderes de clique/arraste pelo mouse ou touch
      {...listeners}
      {...attributes}
      className="bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-[2px] px-4 py-2 rounded-xl font-medium shadow-sm cursor-grab active:cursor-grabbing hover:bg-gray-50 flex items-center gap-2 select-none"
    >
      <span>{word}</span>
      {/* Um pequeno botão 'x' discreto caso o usuário queira devolver a palavra clicando rápido */}
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Impede que o clique ative o arrastar por acidente
          onRemove();
        }}
        className="text-xs text-gray-400 hover:text-red-500 font-bold ml-1"
      >
        ✕
      </button>
    </div>
  );
}




// --- COMPONENTE PRINCIPAL DA TELA ---
type WordOrderTaskProps = {
  task: Task;
  onCompleted: () => Promise<void>;
};

export default function WordOrderTask({
  task,
  onCompleted,
}: WordOrderTaskProps) {

  

  // A frase correta para referência
  const correctSentence = task.verses?.text ?? "";

   // 1. ESTADO: Palavras que aparecem na caixa de resposta (começa vazia)
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

   // 2. ESTADO: Palavras disponíveis para clicar (embaralhadas ou na ordem inicial)
 
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  useEffect(() => {
  setSelectedWords([]);

  if (!correctSentence) {
    setAvailableWords([]);
    return;
  }

  const shuffled = [...correctSentence.split(" ")].sort(
    () => Math.random() - 0.5
  );

  setAvailableWords(shuffled);

}, [task.id]);

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
  
 

  // Configuração de sensores para detectar mouse, touch (celular) e teclado
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Só arrasta se mover 5 pixels (evita cliques acidentais)
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

 // Função executada ao clicar em uma palavra disponível
  const handleSelectedWord = (word: string) => {
    // Adiciona a palavra clicada ao array de palavras selecionadas
    setSelectedWords([...selectedWords, word]);
    // Remove a palavra clicada do array de palavras disponíveis
    setAvailableWords(availableWords.filter(w => w !== word));
  };

  // Função executada ao clicar em uma palavra já selecionada (para remover)
  const handleRemoveWord = (word: string) => {
    // Remove a palavra clicada do array de palavras selecionadas
    setSelectedWords(selectedWords.filter(w => w !== word));
    // Adiciona a palavra clicada de volta ao array de palavras disponíveis
    setAvailableWords([...availableWords, word]);
  };

  // Função que organiza a nova ordem da lista quando o usuário solta o arrasto
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedWords((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  

  //O botão ''Verificar'' fica ativo ao selecionar uma palavra
  const isButtonActive = selectedWords.length > 0;

  //Função para verificar se a frase formada está correta
  const handleVerify = () => {
    if (!isButtonActive) return; // Evita verificar se não há palavras selecionadas

    const userSentence = selectedWords.join(' ');
    
    if (userSentence === correctSentence) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  };


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

      {/*TODO: Receber áudio da task */}
      <audio ref={audioRef} src="/audio/psalm-1/psalm1_step1.mp3" preload="auto" />
    </div>
  );
}


  return (
    // Fundo bege claro cobrindo toda a tela
    <div className="h-screen overflow-hidden flex flex-col bg-app pt-6 pb-16 px-6">
      
      {/* 1. TOPO: Botão Voltar */}
      <div className="flex flex-col pt-4">
        <button 
        onClick={() => window.history.back()}
        className="btn btn-secondary cursor-pointer w-max mb-4">
          <span>&lt;</span> Voltar
        </button>
        
        <div className="flex items-center gap-2 flex-1 mx-4">
          {/* Barra de progresso amarela */}
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
            <div className="bg-linear-to-r from-[#FFFFAD] to-[#FFA40B] h-full w-[15%] rounded-full"></div>
          </div>
          
          {/* Ícone de raio/energia */}
          <div className="flex items-center gap-1 font-bold text-lg text-[#2D2D2D]">
            <span className="text-[#FFC72C]">⚡</span> 12
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO CENTRAL: Título e Personagem */}
      <div className="flex flex-col  mt-6 flex-1">
        <h1 className="text-2xl font-domine font-bold  mb-4">
          Escreva o que você ouviu
        </h1>

        {/* Bloco da Imagem e Botão de Áudio */}
        <div className="relative w-48 h-56 flex justify-center mb-4">
          {/* Substitua o 'src' pela imagem real do Rei Davi quando tiver */}
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

        {/* 3. CAMPO DE RESPOSTA: Caixa com linhas tracejadas */}
        <div className="w-full bg-white/50  border border-gray-300 rounded-2xl p-6 min-h-[100px] flex flex-wrap gap-2 items-center justify-center mb-6">
          {selectedWords.length === 0 ? (
            <div className="w-full space-y-4 opacity-30">
              <div className="border-b border-dashed border-gray-400 w-full h-2"></div>
              <div className="border-b border-dashed border-gray-400 w-full h-2"></div>
            </div>
          ) : (
             // Abstraímos o contexto de arrastar aqui dentro para monitorar apenas essa área
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedWords}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap gap-2 justify-center w-full">
                  {selectedWords.map((word) => (
                    <SortableWord 
                      key={word} 
                      word={word} 
                      onRemove={() => handleRemoveWord(word)} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* 4. SELEÇÃO DE PALAVRAS */}
        <div className="w-full  mb-4">
          <p className="text-sm text-gray-600 mb-3 font-domine">Selecione as palavras na ordem correta:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {availableWords.map((word, index) => (
              <button
                key={word}
                onClick={() => handleSelectedWord(word)}
                className="bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-[2px] px-4 py-2 rounded-xl text-lg font-medium shadow-sm hover:bg-gray-50"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>

    {/* 5. RODAPÉ: Botão Verificar Dinâmico */}
      <div className="pb-4 pt-2">
        <button 
          onClick={handleVerify}
          disabled={!isButtonActive}
          className={`w-full text-lg font-bold py-3 rounded-2xl shadow-md transition-all border-b-4 ${
            isButtonActive 
              ? 'btn btn-primary' 
              : 'bg-[#E5E5E5] text-[#AFAFAF] border-[#C0C0C0] cursor-not-allowed'
          }`}
        >
          Verificar
        </button>
      </div>

    

    {/* MODAIS DE FEEDBACK (Ficam aqui embaixo para renderizar por cima da tela) */}
      <SuccessModal
        visible={showSuccess}
        onContinue={ async () => {
          setShowSuccess(false);
          await onCompleted();
          
          
          // OU se quiser abrir o modal de recompensa primeiro, como no seu exemplo:
          // setShowRewardModal(true);
        }}
        title="Perfeito! Você acertou!"
        buttonLabel="Próxima fase"
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
  );

  
}