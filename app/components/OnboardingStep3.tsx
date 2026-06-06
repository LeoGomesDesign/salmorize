'use client';

import { useOnboarding } from '../context/OnboardingContext';
import { useState } from 'react';

export default function OnboardingStep3() {
  const { nextStep, previousStep, completeStep } = useOnboarding();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      completeStep(3);
      nextStep();
    }
  };

  const goals = [
    {
      id: 'daily-practice',
      title: 'Praticar diariamente',
      description: 'Dedicar tempo todos os dias',
    },
    {
      id: 'full-psalms',
      title: 'Memorizar Salmos completos',
      description: 'Aprender livros inteiros',
    },
    {
      id: 'spiritual-growth',
      title: 'Crescimento espiritual',
      description: 'Aprofundar a fé através dos Salmos',
    },
    {
      id: 'meditation',
      title: 'Meditação',
      description: 'Usar os Salmos para meditação',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-purple-50 to-white">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Seus objetivos</h1>
        <p className="text-gray-600 text-center mb-8">
          Selecione um ou mais objetivos para sua jornada com Salmorize.
        </p>

        <div className="space-y-3 mb-8">
          {goals.map(goal => (
            <button
              key={goal.id}
              onClick={() => handleToggleGoal(goal.id)}
              className={`w-full p-4 rounded-lg border-2 transition duration-200 text-left ${
                selectedGoals.includes(goal.id)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedGoals.includes(goal.id)}
                  onChange={() => {}}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 mr-4 cursor-pointer"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
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
            disabled={selectedGoals.length === 0}
            className={`flex-1 font-semibold py-3 px-6 rounded-lg transition duration-200 ${
              selectedGoals.length > 0
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Próximo: Login
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">Etapa 3 de 3</p>
      </div>
    </div>
  );
}
