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
import { createUser, createOrganization, createWorkspace, createOrganizationMembership } from '../services';
import { PlanType, MembershipRole } from '../types';

type OnboardingStep = 'select-type' | 'stepper';

export function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>('select-type');
  const [accountType, setAccountType] = useState<AccountType | null>();

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep('stepper');
  };

  const handleBack = () => {
    setStep('select-type');
    setAccountType(null);
  };

  const handleComplete = async (
    data: OwnerOnboardingFormData | ContributorOnboardingFormData
  ) => {
    try {
      if (!accountType) return;

      if (accountType === 'ORGANIZATION') {
        // 1. Crear usuario (admin/owner)
        const { fullName, email, organizationName, workspaceName } = data as any;
        const user = await createUser({ name: fullName || data.name, email, accountType });
        // 2. Crear organización
        const org = await createOrganization({ name: organizationName, ownerId: user.id, plan: PlanType.FREE });
        // 3. Crear membresía OWNER
        await createOrganizationMembership({ organizationId: org.id, userId: user.id, role: MembershipRole.OWNER });
        // 4. Crear workspace inicial
        await createWorkspace({ ownerType: accountType, organizationId: org.id, ownerId: user.id });
        window.location.href = '/dashboard';
        return;
      }

      if (accountType === 'FREELANCER') {
        const { fullName, email } = data as any;
        await createUser({ name: fullName || data.name, email, accountType });
        window.location.href = '/dashboard';
        return;
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Hubo un error al finalizar el onboarding. Intenta de nuevo.');
      throw error;
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
          {step === 'select-type' && (
            <AccountTypeSelection onSelect={handleAccountTypeSelect} />
          )}

          {step === 'stepper' && accountType && (
            <OnboardingStepper
              accountType={accountType}
              steps={accountType === 'ORGANIZATION' ? ownerSteps : contributorSteps}
              onComplete={handleComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
