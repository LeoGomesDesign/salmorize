'use client';

import { OnboardingProvider } from '../context/OnboardingContext';
import OnboardingFlow from '../components/OnboardingFlow';

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
    <OnboardingFlow />
    </OnboardingProvider>
  );
}
