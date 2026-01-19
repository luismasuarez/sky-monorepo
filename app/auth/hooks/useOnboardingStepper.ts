"use client";
import { StepConfig } from '@/lib/onboarding-steps.config';
import {
  contributorAccountSchema,
  contributorConfirmationSchema,
  ownerAccountSchema,
  ownerConfirmationSchema,
  ownerOrganizationSchema,
} from '@/schemas/onboarding.schema';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { AccountType } from '../types';

interface UseOnboardingStepperOptions {
  accountType: AccountType;
  steps: StepConfig[];
  onComplete: (data: any) => Promise<void>;
}

export function useOnboardingStepper({
  accountType,
  steps,
  onComplete,
}: UseOnboardingStepperOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepConfig = steps[currentStep];

  /**
   * Get validation schema for current step
   */
  const getStepSchema = useCallback((): z.ZodSchema | null => {
    const stepId = currentStepConfig.id;

    if (accountType === 'ORGANIZATION') {
      if (stepId === 'account') return ownerAccountSchema;
      if (stepId === 'organization') return ownerOrganizationSchema;
      if (stepId === 'confirmation') return ownerConfirmationSchema;
    } else {
      if (stepId === 'account') return contributorAccountSchema;
      if (stepId === 'confirmation') return contributorConfirmationSchema;
    }

    return null;
  }, [accountType, currentStepConfig.id]);

  /**
   * Validate current step data
   */
  const validateStep = useCallback(async (): Promise<boolean> => {
    try {
      const schema = getStepSchema();
      if (schema) {
        await schema.parseAsync(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[String(err.path[0])] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [formData, getStepSchema]);

  /**
   * Go to next step
   */
  const nextStep = async (): Promise<boolean> => {
    const isValid = await validateStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
      return true;
    }
    return isValid;
  };

  /**
   * Go to previous step
   */
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  /**
   * Go to specific step (with validation)
   */
  const goToStep = async (step: number): Promise<boolean> => {
    if (step >= 0 && step < steps.length) {
      if (step > currentStep) {
        const isValid = await validateStep();
        if (!isValid) return false;
      }
      setCurrentStep(step);
      setErrors({});
      return true;
    }
    return false;
  };

  /**
   * Update form data
   */
  const updateFormData = (data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  /**
   * Submit final form
   */
  const handleSubmit = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    currentStepConfig,
    formData,
    errors,
    isSubmitting,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    handleSubmit,
  };
}
