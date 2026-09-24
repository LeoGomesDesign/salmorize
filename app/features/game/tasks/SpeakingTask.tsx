'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SuccessModal from '@/app/features/game/modals/SuccessModal';
import FailureModal from '@/app/features/game/modals/FailureModal';
import type { Task } from "@/lib/types/task";
import HeaderBackButton from '@/app/features/game/components/task/HeaderBackButton';
import ProgressBar from '@/app/features/game/components/task/ProgressBar';
import TypingTask from './TypingTask';



// --- COMPONENTE PRINCIPAL DA TELA ---
type SpeakingTaskProps = {
  task: Task;
  onCompleted: () => Promise<void>;
};
export default function SpeakingTask({
  task,
  onCompleted,
}: SpeakingTaskProps) {
  

  // Configurações do Salmo
  // 1. A frase dividida em palavras individuais para podermos pintar uma por uma
  const targetPhrase = task.verses?.text ?? "";
  const progressPercent = (task.task_order / task.stanza_total_tasks) * 100;
  const targetWords = targetPhrase.split(" ");
  const minimumAccuracy = 0.7;

 

  // Estados da Interface
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  
  
 // Referência para guardar a instância do reconhecedor de voz
  const recognitionRef = useRef<any>(null);   

  function normalizeText(text: string) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const verifySpeech = useCallback((spokenText: string) => {
    const targetWords = normalizeText(targetPhrase).split(" ");
    const spokenWords = normalizeText(spokenText).split(" ");
    let correct = 0;
    const usedIndexes = new Set<number>();

    for (const targetWord of targetWords) {
      const foundIndex = spokenWords.findIndex(
        (word, index) => !usedIndexes.has(index) && word === targetWord
      );

      if (foundIndex !== -1) {
        usedIndexes.add(foundIndex);
        correct++;
      }
    }

    const accuracy = targetWords.length > 0 ? correct / targetWords.length : 0;
    const percentage = Math.round(accuracy * 100);

    console.log("Esperado:", targetWords);
    console.log("Falado:", spokenWords);
    console.log(`Acerto: ${percentage}%`);

    if (accuracy >= minimumAccuracy) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  }, [targetPhrase]);

  // Reinicia o reconhecimento para cada nova frase/task.

  useEffect(() => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error('Speech Recognition não suportado');
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: any) => {
    let currentTranscript = '';

    for (let i = 0; i < event.results.length; i++) {
      currentTranscript += event.results[i][0].transcript;
    }

    setTranscript(currentTranscript);
    console.log('Texto reconhecido:', currentTranscript);

    const lastResult = event.results[event.results.length - 1];

    if (lastResult.isFinal) {
    verifySpeech(currentTranscript);
    }
  };

  recognition.onend = () => {
    setIsRecording(false);
    
  };

  recognition.onerror = (event: any) => {
  console.error('SpeechRecognition Error:', event.error);

  switch (event.error) {
    case 'not-allowed':
      alert('Permissão do microfone negada.');
      break;

    case 'audio-capture':
      alert('Nenhum microfone encontrado.');
      break;

    case 'network':
      alert('Erro de rede.');
      break;

    default:
      alert(`Erro: ${event.error}`);
  }

  setIsRecording(false);
  };

  recognitionRef.current = recognition;

  return () => {
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;

    try {
      recognition.stop();
    } catch {
      // O reconhecimento pode já ter sido encerrado pelo navegador.
    }
  };
  }, [task.id, targetPhrase, verifySpeech]);

  // Inicia ou para a gravação ao clicar no botão
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado ou não carregado.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setIsRecording(true);

      console.log('Iniciando reconhecimento...');

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Erro ao iniciar:', error);
        setIsRecording(false);
      }
    }
  };

  // 2. FUNÇÃO MÁGICA: Limpa o texto falado e verifica se a palavra específica já foi dita
  const isWordSpoken = (word: string) => {
    const cleanTranscript = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    return cleanTranscript.includes(cleanWord);
  };

  if (showTyping) {
    return <TypingTask task={task} onCompleted={onCompleted} />;
  }
  


  return (
    // Fundo bege claro cobrindo toda a tela
    <div className="h-screen overflow-hidden flex flex-col justify-between bg-app pt-6 pb-16 px-6">
      
     {/* 1. TOPO: Botão Voltar */}
           <div className="flex items-center gap-2">
             
             <HeaderBackButton onClick={() => window.history.back()} />
             <ProgressBar task={task} />
           </div>

      {/* 2. CONTEÚDO CENTRAL: Título e Personagem */}
      <div className="flex flex-col  mt-6 flex-1">
        <h1 className="text-2xl font-domine font-bold  mb-4">
          Fale a frase
        </h1>

        {/* Bloco da Imagem e Botão de Áudio */}
        <div className="relative flex flex-col justify-center items-center mb-4">
          {/* Substitua o 'src' pela imagem real do Rei Davi quando tiver */}
          <Image
            src="/img/daviListening.png" 
            height={230}
            width={200}
            alt="Rei Davi com Harpa" 
            className="object-contain mt-8"
          />
        
          {/* 3. CAIXA INTEGRADA (Igual à sua imagem) */}
          <div className=" position-absolute bottom-4 w-full bg-white border-2 border-gray-200 rounded-3xl p-4 text-center shadow-sm relative max-w-sm mx-auto">
          <p className="text-2xl font-serif font-medium leading-relaxed flex flex-wrap justify-center gap-x-2 gap-y-1">
            <span className="text-gray-400">“</span>
            
            {/* Maquete dinâmica: Mapeia cada palavra mudando de cor */}
            {targetWords.map((word, index) => {
              const spoken = isWordSpoken(word);
              return (
                <span 
                  key={index} 
                  className={`transition-colors duration-300 ${
                    spoken 
                      ? 'text-black font-bold' // Se falou, fica preto e em negrito igual a imagem
                      : 'text-gray-400'        // Se não falou, fica em tom de cinza
                  }`}
                >
                  {word}
                </span>
              );
            })}

            <span className="text-gray-400">”</span>
          </p>
          </div>
        </div>

      {/* 4. CONTROLES DE ÁUDIO */}
      <div className="fixed bottom-16 left-6 right-6 flex flex-col items-center gap-4">
        {!isRecording ? (
          <button
            onClick={toggleRecording}
            className="w-full bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-0.5 py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-[#00A2E8] font-bold text-lg hover:bg-gray-50 tracking-wider"
          >
            <span className="text-xl">🎙️</span> Falar
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            className="w-full bg-white border-2 border-gray-200 py-4 rounded-2xl shadow-md flex items-center justify-center gap-1.5 min-h-16 animate-pulse"
          >
            <div className="w-1.5 h-6 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-10 bg-[#00A2E8] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-14 bg-[#00A2E8] rounded-full animate-bounce delay-150"></div>
            <div className="w-1.5 h-8 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-12 bg-[#00A2E8] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-5 bg-[#00A2E8] rounded-full animate-bounce delay-100"></div>
          </button>
        )}


        <button 
          onClick={() => setShowTyping(true)}
          className="text-sm font-bold text-gray-500 hover:text-gray-700 tracking-wide mt-2"
        >
          Não posso falar agora
        </button>
      </div>


    

      {/* MODAIS DE FEEDBACK (Ficam aqui embaixo para renderizar por cima da tela) */}
      <SuccessModal
      visible={showSuccess}
      onContinue={async () => {
        setShowSuccess(false);
        await onCompleted();
      }}
      title="Perfeito!"
      buttonLabel="Continuar"
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
      
     
      </div>
    </div>
  
  )
}