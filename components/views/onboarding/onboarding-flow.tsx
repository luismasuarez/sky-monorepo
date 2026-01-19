"use client";
import { AccountType } from '@/app/auth/types';
import { contributorSteps, ownerSteps } from '@/lib/onboarding-steps.config';
import type {
  ContributorOnboardingFormData,
  OwnerOnboardingFormData,
} from '@/schemas/onboarding.schema';
import Link from 'next/link';
import { useState } from 'react';
import { AccountTypeSelection } from './account-type-selection';
import { OnboardingStepper } from './onboarding-stepper';
import { createOrganizationOnboarding, createFreelancerOnboarding } from '@/app/auth/actions';


type OnboardingStep = 'select-type' | 'stepper' | 'success';

export function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>('select-type');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep('stepper');
    setError(null);
  };

  const handleBack = () => {
    setStep('select-type');
    setAccountType(null);
    setError(null);
  };

  const handleComplete = async (
    data: OwnerOnboardingFormData | ContributorOnboardingFormData
  ) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (accountType === 'ORGANIZATION') {
        // Adaptar campos según el formulario
        const formData = new FormData();
        formData.append('email', (data as any).email);
        formData.append('password', (data as any).password);
        formData.append('organizationName', (data as any).organizationName);
        formData.append('workspaceName', (data as any).workspaceName || 'Default');
        formData.append('contactName', (data as any).fullName || '');
        if ((data as any).phone) formData.append('phone', (data as any).phone);
        result = await createOrganizationOnboarding(formData);
      } else if (accountType === 'FREELANCER') {
        const formData = new FormData();
        formData.append('name', (data as any).fullName || (data as any).name);
        formData.append('email', (data as any).email);
        formData.append('password', (data as any).password);
        result = await createFreelancerOnboarding(formData);
      }
      if (result?.success && result.redirectUrl) {
        setSuccessMsg(
          accountType === 'ORGANIZATION'
            ? '¡Organización creada con éxito! Redirigiendo a tu dashboard...'
            : '¡Cuenta personal creada! Redirigiendo a tu dashboard...'
        );
        setStep('success');
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 1800);
      } else if (result?.error) {
        setError(result.error);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al completar el onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-4xl">
        {/* Back to Login Link */}
        <div className="mb-4 text-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>

        <div className="glass-light dark:glass-dark rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-center font-medium">
              {error}
            </div>
          )}

          {step === 'select-type' && (
            <AccountTypeSelection onSelect={handleAccountTypeSelect} />
          )}

          {step === 'stepper' && accountType && (
            <OnboardingStepper
              accountType={accountType}
              steps={accountType === 'ORGANIZATION' ? ownerSteps : contributorSteps}
              onComplete={handleComplete}
              onBack={handleBack}
              loading={loading}
            />
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                {successMsg || '¡Registro exitoso!'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Serás redirigido a tu dashboard en unos segundos...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
