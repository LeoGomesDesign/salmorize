'use client';

import { useOnboarding } from '../context/OnboardingContext';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';

export default function OnboardingFlow() {
  const { currentStep } = useOnboarding();

  return (
    <div>
      {currentStep === 1 && <OnboardingStep1 />}
      {currentStep === 2 && <OnboardingStep2 />}
    </div>
  );
}
