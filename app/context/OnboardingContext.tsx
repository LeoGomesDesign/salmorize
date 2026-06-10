'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  userProgress: {
    step1Completed: boolean;
    step2Completed: boolean;
  };
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (step: number) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2; // Atualize conforme o número total de passos do onboarding
  const [userProgress, setUserProgress] = useState({
    step1Completed: false,
    step2Completed: false,
    
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeStep = (step: number) => {
    setUserProgress(prev => ({
      ...prev,
      [`step${step}Completed`]: true,
    }));
  };

  const resetOnboarding = () => {
    setCurrentStep(1);
    setUserProgress({
      step1Completed: false,
      step2Completed: false,
     
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        userProgress,
        nextStep,
        previousStep,
        completeStep,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
