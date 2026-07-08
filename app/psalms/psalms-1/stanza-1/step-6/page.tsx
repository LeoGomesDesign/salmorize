'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FailureModal from '@/app/components/FailureModal';
import { TaskCompleteSheet } from '@/app/components/CompleteTaskModal';

export default function StepSixCards() {
  const router = useRouter();
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');

  // 1. As 5 frases correspondentes às 5 cartas da pilha
  const cardsData = [
    { id: 1, phrase: "Salmo 1: Os dois caminhos do homem" },
    { id: 2, phrase: "Feliz é todo aquele que não anda" },
    { id: 3, phrase: "Conforme os conselhos dos perversos" },
    { id: 4, phrase: "que não entra no caminho dos malvados" },
    { id: 5, phrase: "nem junto aos zombadores vai sentar-se" }
  ];

  // Estados da Interface
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Controla qual carta está no topo (0 a 4)
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Modais de feedback do seu sistema
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // 2. Inicializa o Reconhecimento de Voz (Fiel ao Step 2)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }

      transcriptRef.current = currentTranscript;
      setTranscript(currentTranscript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => {
      setIsRecording(false);
      if (transcriptRef.current.trim().length > 0) {
        verifySpeech(transcriptRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [currentCardIndex]);

  // Alterna o estado do microfone
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      transcriptRef.current = '';
      setTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // 3. Validação e Avanço da Pilha (Step 2 Style)
  const verifySpeech = (spokenText: string) => {
    const targetPhrase = cardsData[currentCardIndex].phrase;

    const cleanUserText = spokenText.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const cleanTargetText = targetPhrase.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

    if ((cleanUserText.includes(cleanTargetText) || cleanTargetText.includes(cleanUserText)) && cleanUserText.length > 0) {
      setTimeout(() => {
        if (currentCardIndex < cardsData.length - 1) {
          setCurrentCardIndex((prev) => prev + 1);
          setTranscript('');
          transcriptRef.current = '';
        } else {
          setShowSuccess(true);
        }
      }, 400);
    } else if (cleanUserText.length > 0) {
      setShowFailure(true);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-app text-[#2D2D2D] font-sans p-4 flex flex-col justify-between max-w-md mx-auto relative">
      
    

      {/* TOPO: Botão Fechar e Progresso Atualizado (⚡ 8) */}
      <div className="flex flex-col gap-4 w-full pt-4">
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={() => router.push('/home')}
            className="flex items-center gap-1 bg-white px-4 py-1.5 rounded-xl border border-gray-200 text-sm font-semibold shadow-sm hover:bg-gray-50 text-gray-700"
          >
            ✕ Fechar
          </button>
          
          <div className="flex items-center gap-1 font-bold text-xl text-[#2D2D2D]">
            <span className="text-[#FFC72C]">⚡</span> 8
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden shadow-inner">
          {/* Barra enchendo de forma proporcional (20% por card) */}
          <div 
            className="bg-[#FFC72C] h-full rounded-full transition-all duration-500"
            style={{ width: `${(currentCardIndex + 1) * 20}%` }}
          ></div>
        </div>
      </div>

      {/* CONTEÚDO CENTRAL: Título, Personagem e a Pilha Estilizada */}
      <div className="flex flex-col items-center flex-1 mt-6">
        <h1 className="text-3xl font-serif font-bold text-left w-full px-2 mb-6 text-black tracking-tight">
          Proclame o Salmo 1
        </h1>

        {/* Ilustração do Rei Escutando com Notas Musicais */}
        <div className="flex justify-center items-end mb-8 relative">
          <Image
            src="/img/daviListening.png"
            alt="Rei Davi Escutando" 
            width={200}
            height={230}
            
          />  
        </div>

        {/* 📋 PILHA DE CARTAS (Efeito Visual de Cascata do Layout) */}
        <div className="relative w-full max-w-sm h-36 flex items-center justify-center px-4">
          
          {/* Mapeia os cards apenas mostrando os que ainda faltam responder */}
          {cardsData.map((card, index) => {
            // Ignora cartas que o usuário já acertou e remove da tela
            if (index < currentCardIndex) return null;

            // Calcula a posição visual na fila (0 = topo, 1 = segundo, 2 = terceiro)
            const positionInStack = index - currentCardIndex;

            // Só renderiza as 3 primeiras visíveis para não amontoar muito
            if (positionInStack > 2) return null;

            // CSS Dinâmico para criar profundidade de camadas
            const stackStyle = {
              transform: `scale(${1 - positionInStack * 0.04}) translateY(${positionInStack * 10}px)`,
              zIndex: 30 - positionInStack,
            };

            return (
              <div
                key={card.id}
                style={stackStyle}
                className={`absolute w-[92%] bg-white border border-gray-200 rounded-3xl px-6 py-8 text-center shadow-md transition-all duration-500 flex flex-col justify-center min-h-[110px] ${
                  positionInStack === 0 ? 'border-b-4 border-gray-300' : 'opacity-60 pointer-events-none'
                }`}
              >
                <p className="text-lg font-serif font-medium text-gray-500 leading-normal">
                  {/* Se for a carta ativa e o usuário estiver falando, mostra o áudio na tela */}
                  {positionInStack === 0 && transcript 
                    ? `“ ${transcript} ”` 
                    : card.phrase}
                </p>
              </div>
            );
          })}

        </div>
      </div>

      {/* PAINEL INFERIOR: Botão Falar Estilizado em Azul (Fiel à Imagem) */}
      <div className="pb-10 pt-4 w-full px-4">
        {!isRecording ? (
          <button
            onClick={toggleRecording}
            className="w-full bg-white border-2 border-gray-100 py-5 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-[#00A2E8] font-bold text-lg hover:bg-gray-50 tracking-wider transition-all"
          >
            <span className="text-xl">🎙️</span> FALAR
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            className="w-full bg-white border-2 border-gray-100 py-5 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 min-h-[68px] animate-pulse"
          >
            {/* Animação gráfica das ondas sonoras quando estiver gravando */}
            <div className="w-1.5 h-5 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-8 bg-[#00A2E8] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-11 bg-[#00A2E8] rounded-full animate-bounce delay-150"></div>
            <div className="w-1.5 h-7 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-9 bg-[#00A2E8] rounded-full animate-bounce"></div>
          </button>
        )}
      </div>

      {/* Chame seus modais normais de feedback aqui embaixo */}
      
      <TaskCompleteSheet
        isOpen={showSuccess} // Controlado pelo seu estado de sucesso
        onContinue={() => router.push('/home')} // Manda ele de volta para a Home
        points={12} // Seus pontos salvos no topo (⚡)
        accuracy={100}
        timeLabel="0:45"
      />

      <FailureModal visible={showFailure} onRetry={() => { setShowFailure(false); setTranscript(''); }} />
      

    </div>
  );
}
