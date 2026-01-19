import { useState } from "react";
import { ownerSteps, contributorSteps } from "./steps";
import { StepIndicator } from "./step-indicator";
import { AccountTypeSelection, AccountType } from "./account-type-selection";

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
    // Aquí deberías renderizar los componentes visuales de cada paso
    // Ejemplo:
    // if (accountType === "ORGANIZATION" && steps[step].id === "account") return <OwnerAccountStep ... />;
    // if (accountType === "ORGANIZATION" && steps[step].id === "organization") return <OwnerOrganizationStep ... />;
    // if (accountType === "ORGANIZATION" && steps[step].id === "confirmation") return <OwnerConfirmationStep ... />;
    // if (accountType === "FREELANCER" && steps[step].id === "account") return <ContributorAccountStep ... />;
    // if (accountType === "FREELANCER" && steps[step].id === "confirmation") return <ContributorConfirmationStep ... />;
    return (
      <div className="p-8 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">{steps[step].title}</h2>
        <p className="mb-4">{steps[step].description}</p>
        {/* Aquí van los campos del paso actual */}
        <button type="button" className="mr-2" onClick={handlePrev} disabled={step === 0}>Atrás</button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={handleNext}>Siguiente</button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading}>{loading ? "Registrando..." : "Finalizar"}</button>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      {accountType && <StepIndicator steps={steps} currentStep={step} />}
      {renderStep()}
    </div>
  );
}
