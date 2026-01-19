import { useState } from "react";
import { AccountType, AccountTypeSelection } from "./account-type-selection";
import { StepIndicator } from "./step-indicator";
import { contributorSteps, ownerSteps } from "./steps";
import { OwnerAccountStep } from "./steps/owner-account-step";
import { OwnerOrganizationStep } from "./steps/owner-organization-step";
import { OwnerConfirmationStep } from "./steps/owner-confirmation-step";
import { ContributorAccountStep } from "./steps/contributor-account-step";
import { ContributorConfirmationStep } from "./steps/contributor-confirmation-step";

// TODO: Import and implement step components for each step (see legacy/auth/components/steps/*)

export function OnboardingFlow() {
  const [step, setStep] = useState<number>(0);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const steps = accountType === "ORGANIZATION" ? ownerSteps : contributorSteps;

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep(0);
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Adaptar payload según tipo de cuenta
      const payload: any = {
        accountType,
        ...formData,
        plan: "FREE",
      };
      if (accountType === "ORGANIZATION") {
        payload.organizationName = formData.organizationName;
        payload.name = formData.fullName;
      } else {
        payload.name = formData.fullName;
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el registro");
      window.location.href = data.redirect;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render step content (simplificado, debes crear los componentes visuales)
  const renderStep = () => {
    if (!accountType) {
      return <AccountTypeSelection onSelect={handleAccountTypeSelect} />;
    }
    const stepId = steps[step].id;
    if (accountType === "ORGANIZATION") {
      if (stepId === "account") {
        return <OwnerAccountStep formData={formData} errors={{}} onChange={handleChange} />;
      }
      if (stepId === "organization") {
        return <OwnerOrganizationStep formData={formData} errors={{}} onChange={handleChange} />;
      }
      if (stepId === "confirmation") {
        return <OwnerConfirmationStep formData={formData} errors={{}} onChange={handleChange} />;
      }
    }
    if (accountType === "FREELANCER") {
      if (stepId === "account") {
        return <ContributorAccountStep formData={formData} errors={{}} onChange={handleChange} />;
      }
      if (stepId === "confirmation") {
        return <ContributorConfirmationStep formData={formData} errors={{}} onChange={handleChange} />;
      }
    }
    return null;
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      {accountType && <StepIndicator steps={steps} currentStep={step} />}
      <div className="p-8 bg-white rounded shadow">
        {renderStep()}
        <div className="flex justify-between mt-8">
          <button type="button" className="mr-2 px-4 py-2 rounded bg-slate-200" onClick={handlePrev} disabled={step === 0}>Atrás</button>
          {accountType && step < steps.length - 1 ? (
            <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleNext}>Siguiente</button>
          ) : accountType ? (
            <button type="button" className="px-4 py-2 rounded bg-green-600 text-white" onClick={handleSubmit} disabled={loading}>{loading ? "Registrando..." : "Finalizar"}</button>
          ) : null}
        </div>
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
}
