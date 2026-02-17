"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ONBOARDING_STEPS } from "@/lib/constants";
import StepBasicData from "./StepBasicData";
import StepTargetSetting from "./StepTargetSetting";
import StepDynamicQuestions from "./StepDynamicQuestions";

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-secondary/30 p-4 overflow-auto">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {ONBOARDING_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm ${
                  index <= currentStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-accent text-accent-foreground"
                        : "bg-border text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border p-6 sm:p-8">
          <h2 className="text-xl font-bold text-primary mb-1">
            {ONBOARDING_STEPS[currentStep].label}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {ONBOARDING_STEPS[currentStep].description}
          </p>

          {currentStep === 0 && <StepBasicData onNext={handleNext} />}
          {currentStep === 1 && (
            <StepTargetSetting onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 2 && <StepDynamicQuestions onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
}
