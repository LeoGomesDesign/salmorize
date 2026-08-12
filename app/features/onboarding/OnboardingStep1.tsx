'use client';

import { useOnboarding } from '@/app/context/OnboardingContext';
import Image from 'next/image';

export default function OnboardingStep1() {
  const { nextStep, completeStep } = useOnboarding();

  const handleContinue = () => {
    completeStep(1);
    nextStep();
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-app">
      <div className="text-center">
        <Image 
          src="/img/daviFront.png" 
          alt="Floresta - Onboarding" 
          width={400}
          height={520}
          priority
          className="mx-auto mb-2 rounded-lg"
        />

        <div className="space-y-3 mb-6 text-center px-6">
          <h1 className="text-3xl font-domine font-bold text-gray-9 mb-4">Memorize os Salmos</h1>
        
            <p className="text-lg text-center text-gray-6 mb-6">
            Apenda os Salmos e tenha mais intimidade com a Palavra de Deus!
            </p>
  
            <button
            onClick={handleContinue}
            className="btn btn-primary w-full"
            >
            Continuar
            </button>
        </div>

        
      </div>
    </div>
  );
}
