"use client";

import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { StepIndicator } from './step-indicator';

// Owner steps
import { OwnerAccountStep } from './steps/owner-account-step';
import { OwnerConfirmationStep } from './steps/owner-confirmation-step';
import { OwnerOrganizationStep } from './steps/owner-organization-step';

// Contributor steps
import { AccountType } from '@/app/auth/types';
import { useOnboardingStepper } from '@/hooks/useOnboardingStepper';
import { StepConfig } from '@/lib/onboarding-steps.config';
import { ContributorOnboardingFormData, OwnerOnboardingFormData } from '@/schemas/onboarding.schema';
import { ContributorAccountStep } from './steps/contributor-account-step';
import { ContributorConfirmationStep } from './steps/contributor-confirmation-step';

interface OnboardingStepperProps {
  accountType: AccountType;
  steps: StepConfig[];
  onComplete: (data: OwnerOnboardingFormData | ContributorOnboardingFormData) => Promise<void>;
  onBack?: () => void;
}

export function OnboardingStepper({
  accountType,
  steps,
  onComplete,
  onBack,
}: OnboardingStepperProps) {
  const {
    currentStep,
    currentStepConfig,
    formData,
    errors,
    isSubmitting,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    handleSubmit,
  } = useOnboardingStepper({
    accountType,
    steps,
    onComplete,
  });

  const renderStep = () => {
    const stepId = currentStepConfig.id;

    if (accountType === 'ORGANIZATION') {
      if (stepId === 'account') {
        return (
          <OwnerAccountStep formData={formData} errors={errors} onChange={updateFormData} />
        );
      }
      if (stepId === 'organization') {
        return (
          <OwnerOrganizationStep
            formData={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      }
      if (stepId === 'confirmation') {
        return (
          <OwnerConfirmationStep
            formData={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      }
    } else {
      if (stepId === 'account') {
        return (
          <ContributorAccountStep
            formData={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      }
      if (stepId === 'confirmation') {
        return (
          <ContributorConfirmationStep
            formData={formData}
            errors={errors}
            onChange={updateFormData}
          />
        );
      }
    }

    return null;
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
    } else {
      await nextStep();
    }
  };

  const handlePrev = () => {
    if (isFirstStep && onBack) {
      onBack();
    } else {
      prevStep();
    }
  };

  return (
    <div>
      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} onStepClick={goToStep} />

      {/* Step Content */}
      <div className="mt-8">
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            {isFirstStep ? 'Volver' : 'Anterior'}
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className={`flex items-center gap-2 ${accountType === 'ORGANIZATION'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isSubmitting ? (
              'Procesando...'
            ) : isLastStep ? (
              <>
                <IconCheck className="h-4 w-4" />
                Finalizar
              </>
            ) : (
              <>
                Siguiente
                <IconArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
