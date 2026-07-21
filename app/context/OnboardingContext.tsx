'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type OnboardingContextType = {
  currentStep: number;
  completedSteps: number[];
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (step: number) => void;
  resetOnboarding: () => void;
  userProgress: number;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const previousStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const completeStep = (step: number) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  const userProgress = completedSteps.length;

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        completedSteps,
        nextStep,
        previousStep,
        completeStep,
        resetOnboarding,
        userProgress,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
