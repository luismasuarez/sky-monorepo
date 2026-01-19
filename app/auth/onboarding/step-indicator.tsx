import { IconCheck } from "@tabler/icons-react";

interface StepConfig {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
}

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progreso del registro" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep && onStepClick;
          const StepIcon = step.icon;
          return (
            <li key={step.id} className="relative flex-1">
              <button
                type="button"
                onClick={() => isClickable && onStepClick && onStepClick(index)}
                disabled={!isClickable}
                className={`group relative flex w-full flex-col items-center text-center ${isActive ? "font-bold" : ""}`}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Paso ${index + 1}: ${step.title}`}
              >
                <div className="relative flex w-full items-center justify-center">
                  <span className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${isActive ? "border-blue-600" : isCompleted ? "border-green-500" : "border-slate-300"} bg-white dark:bg-slate-900 shadow-lg`}>
                    {isCompleted ? <IconCheck className="w-6 h-6 text-green-500" /> : <StepIcon className="w-6 h-6 text-blue-600" />}
                  </span>
                </div>
                <span className="mt-2 text-xs text-slate-700 dark:text-slate-300">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
