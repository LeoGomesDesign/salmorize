'use client';

import { useOnboarding } from '../context/OnboardingContext';
import { useState } from 'react';

export default function OnboardingStep2() {
  const { nextStep, previousStep, completeStep } = useOnboarding();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedLevel) {
      completeStep(2);
      nextStep();
    }
  };

  const levels = [
    {
      id: 'beginner',
      title: 'Iniciante',
      description: 'Começar do zero',
      icon: '🌱',
    },
    {
      id: 'intermediate',
      title: 'Intermediário',
      description: 'Já tenho experiência',
      icon: '🌿',
    },
    {
      id: 'advanced',
      title: 'Avançado',
      description: 'Já memorizo Salmos',
      icon: '🌳',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Qual é seu nível?</h1>
        <p className="text-gray-600 text-center mb-8">
          Escolha o nível que melhor se adequa a você para personalizarmos sua experiência.
        </p>

        <div className="space-y-4 mb-8">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`w-full p-4 rounded-lg border-2 transition duration-200 text-left ${
                selectedLevel === level.id
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-4xl mr-4">{level.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{level.title}</h3>
                  <p className="text-sm text-gray-600">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={previousStep}
            className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Voltar
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedLevel}
            className={`flex-1 font-semibold py-3 px-6 rounded-lg transition duration-200 ${
              selectedLevel
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continuar
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">Etapa 2 de 3</p>
      </div>
    </div>
  );
}
