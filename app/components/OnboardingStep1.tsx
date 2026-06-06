'use client';

import { useOnboarding } from '../context/OnboardingContext';
import Image from 'next/image';

export default function OnboardingStep1() {
  const { nextStep, completeStep } = useOnboarding();

  const handleContinue = () => {
    completeStep(1);
    nextStep();
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="text-center">
        <Image 
          src="/img/01_bg_florest.png" 
          alt="Floresta - Onboarding" 
          width={400}
          height={520}
          priority
          className="mx-auto mb-8 rounded-lg"
        />

       

        <div className="space-y-3 mb-8 text-center px-6">
             <h1 className="text-3xl font-domine font-bold text-gray-9 mb-4">Memorize os Salmos</h1>
        
            <p className="text-lg text-center text-gray-6 mb-6">
            Uma jornada diária de oração, contemplação e constância
            </p>

          <div className="flex items-start">
            <span className="text-green-600 font-bold mr-3">✓</span>
            <p className="text-gray-7">Aprenda um Salmo por dia</p>
          </div>
          <div className="flex items-start">
            <span className="text-green-600 font-bold mr-3">✓</span>
            <p className="text-gray-7">Exercícios interativos</p>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 font-bold mr-3">✓</span>
            <p className="text-gray-7">Acompanhe seu progresso</p>
          </div>
        

          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out"
          >
            Continuar
          </button>
        </div>

        
      </div>
    </div>
  );
}
