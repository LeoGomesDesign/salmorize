'use client';

import { OnboardingProvider } from '../context/OnboardingContext';
import OnboardingFlow from '../features/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  );
}
