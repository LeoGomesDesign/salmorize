'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StepOne() {
  const router = useRouter();
  // Estado simples apenas para simular a seleção de palavras (opcional para o layout)
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const words = ['Feliz', 'é', 'todo', 'aquele', 'que', 'não', 'anda'];

  return (
    // Fundo bege claro cobrindo toda a tela
    <div className="min-h-screen bg-[#FDF6EC] text-[#2D2D2D] font-sans p-4 flex flex-col justify-between max-w-md mx-auto shadow-lg relative rounded-3xl border border-gray-200">
      
      {/* 1. TOPO: Botão Voltar e Progresso */}
      <div className="flex items-center justify-between w-full pt-4">
        <button 
        onClick={() => router.push('/home')}
        className="btn btn-secondary cursor-pointer">
          <span>&lt;</span> Voltar
        </button>
        
        <div className="flex items-center gap-2 flex-1 mx-4">
          {/* Barra de progresso amarela */}
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div className="bg-[#FFC72C] h-full w-[15%] rounded-full"></div>
          </div>
          {/* Ícone de raio/energia */}
          <div className="flex items-center gap-1 font-bold text-lg text-[#2D2D2D]">
            <span className="text-[#FFC72C]">⚡</span> 12
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO CENTRAL: Título e Personagem */}
      <div className="flex flex-col items-center mt-6 flex-1">
        <h1 className="text-2xl font-serif font-bold text-center mb-4">
          Escreva o que você ouviu
        </h1>

        {/* Bloco da Imagem e Botão de Áudio */}
        <div className="relative w-48 h-56 flex justify-center items-end mb-4">
          {/* Substitua o 'src' pela imagem real do Rei Davi quando tiver */}
          <img 
            src="https://placeholder.com" 
            alt="Rei Davi com Harpa" 
            className="w-full h-full object-contain"
          />
          
          {/* Botão Escutar Novamente posicionado ao lado */}
          <button className="absolute bottom-12 -right-12 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-sm font-bold whitespace-nowrap hover:bg-gray-50">
            <span className="text-blue-500">🔊</span> Escutar novamente
          </button>
        </div>

        {/* 3. CAMPO DE RESPOSTA: Caixa com linhas tracejadas */}
        <div className="w-full bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl p-6 min-h-[100px] flex flex-wrap gap-2 items-center justify-center shadow-inner mb-6">
          {selectedWords.length === 0 ? (
            <div className="w-full space-y-4 opacity-30">
              <div className="border-b border-dashed border-gray-400 w-full h-2"></div>
              <div className="border-b border-dashed border-gray-400 w-full h-2"></div>
            </div>
          ) : (
            selectedWords.map((word, index) => (
              <span key={index} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-medium shadow-sm">
                {word}
              </span>
            ))
          )}
        </div>

        {/* 4. SELEÇÃO DE PALAVRAS */}
        <div className="w-full text-center mb-4">
          <p className="text-sm text-gray-600 mb-3 font-serif">Selecione as palavras na ordem correta:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {words.map((word, index) => (
              <button
                key={index}
                onClick={() => setSelectedWords([...selectedWords, word])}
                className="bg-white border-2 border-b-4 border-gray-200 active:border-b-2 active:mt-[2px] px-4 py-2 rounded-xl text-lg font-medium shadow-sm hover:bg-gray-50"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RODAPÉ: Botão Verificar */}
      <div className="pb-4 pt-2">
        <button className="w-full bg-[#A0A0A0] text-white text-lg font-bold py-3 rounded-2xl shadow-md cursor-not-allowed transition-all">
          Verificar
        </button>
      </div>

    </div>
  );
}