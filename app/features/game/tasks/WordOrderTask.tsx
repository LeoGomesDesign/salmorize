'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getVerseAudioUrl } from "@/lib/storage/getVerseAudioUrl";
import Image from 'next/image';
import SuccessModal from '@/app/features/game/modals/SuccessModal';
import FailureModal from '@/app/features/game/modals/FailureModal';
import type { Task } from "@/lib/types/task";
import DavidSpeechBubble from '../components/DavidSpeechBubble';




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
function SortableWord({
  item,
  onRemove,
}: {
  item: WordItem;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-[2px] px-4 py-2 rounded-xl font-medium shadow-sm cursor-grab active:cursor-grabbing hover:bg-gray-50 flex items-center gap-2 select-none"
    >
      <span>{item.word}</span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
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

type WordItem = {
  id: string;
  word: string;
};

export default function WordOrderTask({
  task,
  onCompleted,
}: WordOrderTaskProps) {

  

  // A frase correta para referência
  const correctSentence = task.verses?.text ?? "";
  const progressPercent =
  (task.global_order / task.psalm_total_tasks) * 100;

   // 1. ESTADO: Palavras que aparecem na caixa de resposta (começa vazia)
  const [selectedWords, setSelectedWords] = useState<WordItem[]>([]);

   // 2. ESTADO: Palavras disponíveis para clicar (embaralhadas ou na ordem inicial)
 
  const [availableWords, setAvailableWords] = useState<WordItem[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

const playAudio = async () => {
  const audio = audioRef.current;

  if (!audio || !audioUrl) {
    console.warn("Áudio ainda não está disponível.");
    return;
  }

  try {
    audio.currentTime = 0;
    await audio.play();

    console.log("WORD ORDER - áudio reproduzido novamente");
  } catch (error) {
    console.error(
      "WORD ORDER - erro ao reproduzir áudio:",
      error
    );
  }
};

  useEffect(() => {
  setSelectedWords([]);

  if (!correctSentence) {
    setAvailableWords([]);
    return;
  }

const words = correctSentence.split(" ").map((word, index) => ({
  id: `word-${index}`,
  word,
}));

const shuffled = [...words].sort(() => Math.random() - 0.5);

setAvailableWords(shuffled);

}, [task.id]);

  useEffect(() => {
      const t = setTimeout(() => setBubbleVisible(true), 400);
      return () => clearTimeout(t);
  }, []);


  
useEffect(() => {
  if (!task.verses?.id) {
    console.warn("WordOrderTask: verso sem ID.");
    setAudioUrl("");
    return;
  }

  let cancelled = false;

  async function loadAudio() {
    const verseId = task.verses!.id;

    console.log("WORD ORDER - carregando áudio");
    console.log("Verse ID:", verseId);

    const url = await getVerseAudioUrl(verseId);

    if (cancelled) return;

    console.log("Áudio encontrado:", url);

    setAudioUrl(url ?? "");

    if (!url) {
      console.warn(
        `Nenhum áudio encontrado para o verso ${verseId}.`
      );
    }
  }

  loadAudio();

  return () => {
    cancelled = true;
  };
}, [task.verses?.id]);

useEffect(() => {
  const audio = audioRef.current;

  if (!audio || !audioUrl) return;

  console.log("WORD ORDER - preparando autoplay");
  console.log("URL:", audioUrl);

  audio.src = audioUrl;
  audio.load();

  const playWhenReady = async () => {
    try {
      audio.currentTime = 0;
      await audio.play();

      console.log("WORD ORDER - autoplay iniciado");
    } catch (error) {
      console.warn(
        "WORD ORDER - autoplay bloqueado pelo navegador.",
        error
      );
    }
  };

  if (audio.readyState >= 3) {
    playWhenReady();
  } else {
    audio.addEventListener("canplay", playWhenReady, {
      once: true,
    });
  }

  return () => {
    audio.removeEventListener("canplay", playWhenReady);
  };
}, [audioUrl]);
 

  // Configuração de sensores para detectar mouse, touch (celular) e teclado
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Só arrasta se mover 5 pixels (evita cliques acidentais)
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

 // Função executada ao clicar em uma palavra disponível
 const handleSelectedWord = (item: WordItem) => {
  setSelectedWords((prev) => [...prev, item]);

  setAvailableWords((prev) =>
    prev.filter((word) => word.id !== item.id)
  );
};

  // Função executada ao clicar em uma palavra já selecionada (para remover)
const handleRemoveWord = (item: WordItem) => {
  setSelectedWords((prev) =>
    prev.filter((word) => word.id !== item.id)
  );

  setAvailableWords((prev) => [...prev, item]);
};

  // Função que organiza a nova ordem da lista quando o usuário solta o arrasto
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setSelectedWords((items) => {
    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    return arrayMove(items, oldIndex, newIndex);
  });
};
  

  //O botão ''Verificar'' fica ativo ao selecionar uma palavra
  const isButtonActive = selectedWords.length > 0;

  //Função para verificar se a frase formada está correta
  const handleVerify = () => {
    if (!isButtonActive) return; // Evita verificar se não há palavras selecionadas

    const userSentence = selectedWords
    .map((item) => item.word)
    .join(' ');
    
    if (userSentence === correctSentence) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  };
  





  return (
    // Fundo bege claro cobrindo toda a tela
    <div className="h-screen overflow-hidden flex flex-col bg-app pt-6 pb-16 px-6">
      
      {/* 1. TOPO: Botão Voltar */}
      <div className="flex flex-col pt-4">
        <button 
        onClick={() => window.history.back()}
        className="btn btn-secondary cursor-pointer w-max mb-4">
          X
        </button>
        
        <div className="flex items-center gap-2 flex-1 mx-4">
          {/* Barra de progresso amarela */}
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
            <div className="bg-linear-to-r from-[#FFFFAD] to-[#FFA40B] h-full rounded-full transition-all duration-500"
                 style={{width: `${progressPercent}%`,}} 
            ></div>
          </div>
          
          {/* Ícone de raio/energia */}
          <div className="flex items-center gap-1 font-bold text-lg text-[#2D2D2D]">
            <span className="text-[#FFC72C]">⚡</span> {task.battery}
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO CENTRAL: Título e Personagem */}
      <div className="flex flex-col  mt-6 flex-1">
        <h1 className="text-2xl font-domine font-bold  mb-4">
          Escreva o que você ouviu
        </h1>

        {/* Bloco da Imagem e Botão de Áudio */}
        <div className="relative w-auto h-56 flex justify-center mb-4">
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
            onPlay={playAudio}
          />

          <audio
  ref={audioRef}
  src={audioUrl || undefined}
  preload="auto"
  onLoadedData={() => {
    console.log("WORD ORDER - áudio carregado");
  }}
  onCanPlay={() => {
    console.log("WORD ORDER - áudio pronto para reproduzir");
  }}
  onError={(event) => {
    console.error(
      "WORD ORDER - erro no elemento de áudio:",
      event.currentTarget.error
    );
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
                items={selectedWords.map((item) => item.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap gap-2 justify-center w-full">
                  {selectedWords.map((item) => (
                    <SortableWord 
                      key={item.id} 
                      item={item} 
                      onRemove={() => handleRemoveWord(item)} 
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
            {availableWords.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectedWord(item)}
                className="bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-[2px] px-4 py-2 rounded-xl text-lg font-medium shadow-sm hover:bg-gray-50"
              >
                {item.word}
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