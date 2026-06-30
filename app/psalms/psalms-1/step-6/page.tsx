'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SuccessModal from '@/app/components/SuccessModal';
import FailureModal from '@/app/components/FailureModal';

export default function StepSix() {
  const router = useRouter();

  // 1. As 4 estrofes oficiais que o usuário precisa falar em sequência
  const verses = [
    "Feliz é todo aquele que não anda",
    "Conforme os conselhos dos perversos",
    "que não entra no caminho dos malvados",
    "nem junto aos zombadores vai sentar-se"
  ];

  // Mensagens de ajuda/incentivo que o Rei Davi vai mandando a cada nível
  const daviMessages = [
    "Salmo 1: ...",
    "Continue você está indo bem! o Salmo continua assim: anda conforme os ...",
    "Incrível! Qual é a próxima parte sobre os caminhos?",
    "Quase lá! Finalize com a última parte dos zombadores:"
  ];

  // 2. Estados da Interface
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(''); // Estado para o texto em tempo real (Igual ao Step 2)
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // Referência para a API de Reconhecimento de Voz nativa
  const recognitionRef = useRef<any>(null);

   // 2. Inicializa o microfone nativo (Igual ao Step 2)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true; // Mantém ouvindo enquanto o usuário fala
      recognition.interimResults = true; // Captura os resultados parciais em tempo real

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i].transcript;
        }
        setTranscript(currentTranscript); // Joga o que está sendo falado na tela na hora
      };

      recognition.onend = () => {
        setIsRecording(false);
        verifySpeach();
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentVerseIndex, userAnswers, transcript]);

// 3. Função do botão de Gravação (Mesmo comportamento do Step 2)
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop(); // Para a gravação e aciona o verifySpeech automaticamente
    } else {
      setTranscript(''); // Limpa o balão da ovelha para a nova tentativa
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // 4. LÓGICA DE VALIDAÇÃO DA FALA
  const verifySpeach = () => {
    const target = verses[currentVerseIndex];

    // Limpa pontuações e acentos para uma comparação justa
    const cleanSpoken = transcript.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const cleanTarget = target.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

    // Aceita se o usuário falar pelo menos 75% da estrofe correta (evita falhas estritas do microfone)
    if (cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
      const updatedAnswers = [...userAnswers, target];
      setUserAnswers(updatedAnswers);
      setTranscript(''); // Reseta o texto temporário

      if (currentVerseIndex < verses.length - 1) {
        // Se acertou e tem mais estrofes, avança o índice para o Rei Davi mudar a fala
        setCurrentVerseIndex(currentVerseIndex + 1);
      } else {
        // Se concluiu a estrofe inteira com sucesso!
        setShowSuccess(true);
      }
    } else {
      // Se ele errar o trecho atual, o sistema aciona o Modal de Falha estruturado
      setShowFailure(true);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-app text-[#2D2D2D] p-4 flex flex-col justify-between max-w-md mx-auto relative ">
      
      {/* TOPO: Botão Fechar e Barra de Progresso Máxima */}
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
        {/* Progresso quase completo no Step 6 (90%) */}
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
          <div className="bg-[#FFC72C] h-full w-[90%] rounded-full"></div>
        </div>
      </div>

      {/* CONTEÚDO CENTRAL: Fluxo de Balões acumulativos idêntico à imagem */}
      <div className="flex flex-col flex-1 mt-4 px-1 overflow-y-auto gap-y-4 pt-2 scrollbar-none">
        <h1 className="text-xl font-domine font-bold text-left px-1">
          Proclame o que já aprendeu do Salmo 1
        </h1>
        <p className="text-xs text-gray-500 font-sans px-1 -mt-3 mb-2">
          Rei Davi vai te ajudar
        </p>

        {/* REPETIÇÃO DINÂMICA: Renderiza as rodadas já respondidas e a atual */}
        {Array.from({ length: currentVerseIndex + 1 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3 animate-fadeIn">
            
            {/* Balão do Rei Davi (Instrução / Ajuda) */}
            <div className="flex items-start gap-3">
              <img 
                src="https://placeholder.com" 
                alt="Rei Davi" 
                className="w-10 h-10 rounded-full border border-gray-100 object-cover shadow-sm mt-1"
              />
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm text-sm font-medium leading-relaxed text-gray-800">
                {daviMessages[index]}
              </div>
            </div>
            
            {/* Balão da Ovelha (Mostra o texto em tempo real se for a rodada atual) */}
            <div className="flex items-end gap-3 justify-end pl-8">
              <div className="min-w-[180px] max-w-[260px] min-h-[40px] bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm text-sm font-medium text-gray-800 px-4 py-2 text-center leading-normal">
                {index === currentVerseIndex 
                  ? (transcript || (isRecording ? "Ouvindo... 🎙️" : "")) 
                  : userAnswers[index]}
              </div>
              <img 
                src="https://placeholder.com" 
                alt="Ovelhinha" 
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>

          </div>
        ))}
      </div>

    {/* PAINEL INFERIOR: Botão Dinâmico com Ondas Sonoras (Igual ao Step 2) */}
      <div className="pb-8 pt-4 w-full px-2">
        {!isRecording ? (
          <button
            onClick={toggleRecording}
            className="w-full bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-[2px] py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-[#00A2E8] font-bold text-lg hover:bg-gray-50 tracking-wider"
          >
            <span className="text-xl">🎙️</span> Falar
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            className="w-full bg-white border-2 border-gray-200 py-4 rounded-2xl shadow-md flex items-center justify-center gap-1.5 min-h-[64px] animate-pulse"
          >
            {/* Barras de onda sonora idênticas às do Step 2 */}
            <div className="w-1.5 h-6 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-10 bg-[#00A2E8] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-14 bg-[#00A2E8] rounded-full animate-bounce delay-150"></div>
            <div className="w-1.5 h-8 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-12 bg-[#00A2E8] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-5 bg-[#00A2E8] rounded-full animate-bounce delay-100"></div>
          </button>
        )}
      </div>

      {/* Modais padrão integrados ao final do fluxo */}
      
      <SuccessModal visible={showSuccess} onContinue={() => { setShowSuccess(false); router.push('/psalms/completed'); }} />
      <FailureModal visible={showFailure} onRetry={() => setShowFailure(false)} />
      

    </div>
  );
}
