"use client";

import { useResumeStore } from "@/hooks/useResumeStore";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import EditorView from "@/components/editor/EditorView";

export default function BuilderPage() {
  const { state } = useResumeStore();

  if (state.phase === "onboarding") {
    return <OnboardingWizard />;
  }

  return <EditorView />;
}
