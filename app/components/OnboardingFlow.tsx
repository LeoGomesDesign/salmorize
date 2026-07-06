'use client';

import { useOnboarding } from '../context/OnboardingContext';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingFlow() {
  const { currentStep, totalSteps } = useOnboarding();
  const [loginCompleted, setLoginCompleted] = useState(false);
  const router = useRouter();

  if (loginCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-linear-to-b from-green-50 to-white">
        <div className="text-center max-w-sm">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sua conta foi criada com sucesso. Você está pronto para começar sua jornada espiritual.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Ir para Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentStep === 1 && <OnboardingStep1 />}
      {currentStep === 2 && <OnboardingStep2 />}
      {currentStep === 4 && (
        <LoginForm onLoginSuccess={() => setLoginCompleted(true)} />
      )}
    </div>
  );
}
