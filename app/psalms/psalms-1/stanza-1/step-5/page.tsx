'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SuccessModal from '@/app/components/game/modals/SuccessModal';
import FailureModal from '@/app/components/game/modals/FailureModal';



// --- COMPONENTE PRINCIPAL DA TELA ---
export default function StepFive() {
  const router = useRouter();

  // Configurações do Salmo
  // 1. A frase dividida em palavras individuais para podermos pintar uma por uma
  const targetWords = ["Nem", "Junto", "aos", "zombadores", "vai", "sentar-se"];
  const targetPhrase = "nem junto aos zombadores vai sentar-se";

  // Estados da Interface
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  
  
 // Referência para guardar a instância do reconhecedor de voz
  const recognitionRef = useRef<any>(null);   

 // Inicializa a API de Reconhecimento de Voz ao carregar a tela
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
    recognition.stop();
  };
}, []);

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
}
    }
  };
  

 

  // Avalia se o que foi falado bate com a frase do Salmo
  const verifySpeech = (spokenText: string) => {
    // Usamos uma verificação simples removendo pontos e letras maiúsculas
    const cleanUserText = spokenText.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const cleanTargetText = targetPhrase.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    console.log('Usuário:', cleanUserText);
    console.log('Esperado:', cleanTargetText);

    if (cleanUserText === cleanTargetText) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  };

  // 2. FUNÇÃO MÁGICA: Limpa o texto falado e verifica se a palavra específica já foi dita
  const isWordSpoken = (word: string) => {
    const cleanTranscript = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    return cleanTranscript.includes(cleanWord);
  };
  


  return (
    // Fundo bege claro cobrindo toda a tela
    <div className="h-screen overflow-hidden flex flex-col justify-between bg-app pt-6 pb-16 px-6">
      
      {/* 1. TOPO: Botão Voltar */}
      <div className="flex flex-row pt-4">
        <button 
        onClick={() => router.push('/home')}
        className="btn btn-secondary cursor-pointer w-max ">
          <Image
            src="/svg/chevron-left.svg"
            alt="Voltar"
            width={24}
            height={24}
          />
        </button>
        
        <div className="flex items-center gap-2 flex-1 mx-4">
          {/* Barra de progresso amarela */}
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
            <div className="bg-linear-to-r from-[#FFFFAD] to-[#FFA40B] h-full w-[35%] rounded-full"></div>
          </div>
          
          {/* Ícone de raio/energia */}
          <div className="flex items-center gap-1 font-bold text-lg text-[#2D2D2D]">
            <span className="text-[#FFC72C]">⚡</span> 8
          </div>
        </div>
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
            className="w-full bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-[2px] py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-[#00A2E8] font-bold text-lg hover:bg-gray-50 tracking-wider"
          >
            <span className="text-xl">🎙️</span> Falar
          </button>
        ) : (
          <button
            onClick={toggleRecording}
            className="w-full bg-white border-2 border-gray-200 py-4 rounded-2xl shadow-md flex items-center justify-center gap-1.5 min-h-[64px] animate-pulse"
          >
            <div className="w-1.5 h-6 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-10 bg-[#00A2E8] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-14 bg-[#00A2E8] rounded-full animate-bounce delay-150"></div>
            <div className="w-1.5 h-8 bg-[#00A2E8] rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-12 bg-[#00A2E8] rounded-full animate-bounce"></div>
            <div className="w-1.5 h-5 bg-[#00A2E8] rounded-full animate-bounce delay-100"></div>
          </button>
        )}


       { /*
        <button 
          onClick={() => router.push('/psalms/psalms-1/step-3')}
          className="text-sm font-bold text-gray-500 hover:text-gray-700 tracking-wide mt-2"
        >
          Não posso falar agora
        </button>
        */}
      </div>


    

    {/* MODAIS DE FEEDBACK (Ficam aqui embaixo para renderizar por cima da tela) */}
      <SuccessModal
        visible={showSuccess}
        onContinue={() => {
          setShowSuccess(false);
          // Se quiser mandar direto para o step-2 após o acerto:
          router.push('/psalms/psalms-1/step-6');
          
          // OU se quiser abrir o modal de recompensa primeiro, como no seu exemplo:
          // setShowRewardModal(true);
        }}
        title="Perfeito!"
        buttonLabel="Continue"
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
  
</div>
  
)}