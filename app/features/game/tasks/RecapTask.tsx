'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StepThree() {
  const router = useRouter();

  // 1. ESTADO CENTRAL: Controla em qual rodada do exercício o usuário está (0 ou 1)
  const [currentRound, setCurrentRound] = useState(0);

  // Estados para controlar os modais finais do sistema
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // 2. BANCO DE DADOS DAS FRASES: Organizado em rodadas (Rounds)
  const roundsData = [
    {
      basePhrase: "Salmo 1: Os dois ....",
      correctAnswer: "caminhos do homem",
      alternatives: [
        "caminhos do homem",
        "passos do homem",
        "caminhos da mulher"
      ]
    },
    {
      basePhrase: "Feliz é todo...",
      correctAnswer: "aquele que não anda",
      alternatives: [
        "aquele que anda",
        "aquele que não anda",
        "aquele que caminha"
      ]
    },
    {
      basePhrase: "conforme os...",
      correctAnswer: "conselhos dos perversos",
      alternatives: [
        "conhecimentos dos justos",
        "conselhos dos sábios",
        "conselhos dos perversos"
      ]
    }
   
  ];

  // Armazena as respostas que o usuário escolheu em cada rodada
  const [answers, setAnswers] = useState<(string | null)[]>([null, null]);

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

    function SuccessModal({
  visible,
  onContinue,
}: {
  visible: boolean;
  onContinue: () => void;
}) {
  if (!visible) return null;

  return (  
    <div className= "w-lg px-6 pt-4"
      style={{
        position: "fixed",
        bottom: 0,
        backgroundColor: "#CBFFB8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <h2
        className="text-align-left w-full mb-4"
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#141414",
          fontFamily: "var(--font-domine)",
          
        }}
      >
        Correto!
      </h2>
      <button
        onClick={onContinue}
        className="btn btn-success mb-16"
        style={{
          fontSize: 18,
          fontWeight: 700,
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 16,
          paddingBottom: 16,
          borderRadius: 16,
        }}
      >
        Continuar
      </button>
    </div>
  );
}

  function FailureModal({
  visible,
  onRetry,
}: {
  visible: boolean;
  onRetry: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="w-full px-6 pt-4"
      style={{
        position: "fixed",
        bottom: 0,
        backgroundColor: "#F8BEC4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <h2
        className="w-full "
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#141414",
          fontFamily: "var(--font-domine)",
        }}
      >
        Algo está errado!
      </h2>
      <p
        className="w-full mb-6"
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#141414",
          fontFamily: "var(--font-montserrat)",
        }}
      >
        Verifique as palavras escolhidas
      </p>
      <button
        onClick={onRetry}
        className="btn btn-fail w-full mb-16"
        style={{
          fontSize: 18,
          fontWeight: 700,
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 16,
          paddingBottom: 16,
          borderRadius: 16,
        }}
      >
        Tente novamente
      </button>
    </div>
  );
}

  return (
    <div className="h-screen overflow-hidden bg-[#FDF6EC] text-[#2D2D2D] font-sans p-4 flex flex-col justify-between max-w-md mx-auto relative border border-gray-200 shadow-lg rounded-3xl">
      
      {/* 1. TOPO: Botão Fechar e Barra de Progresso */}
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
        onContinue={() => {
          setShowSuccess(false);
          // Se quiser mandar direto para o step-2 após o acerto:
          router.push('/psalms/psalms-1/step-4');
          
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
    
 )   }

    