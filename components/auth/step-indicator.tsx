import { StepConfig } from '@/lib/onboarding-steps.config';
import { Check } from 'lucide-react';

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
          const leftConnectorCompleted = index <= currentStep;
          const rightConnectorCompleted = index < currentStep;
          const StepIcon = step.icon;

          return (
            <li key={step.id} className="relative flex-1">
              {/* Step Button/Indicator */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className="group relative flex w-full flex-col items-center text-center"
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Paso ${index + 1}: ${step.title}`}
              >
                <div className="relative flex w-full items-center justify-center">
                  {index !== 0 && (
                    <span
                      className={`absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 transition-colors ${leftConnectorCompleted
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      aria-hidden="true"
                    />
                  )}

                  {index !== steps.length - 1 && (
                    <span
                      className={`absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 transition-colors ${rightConnectorCompleted
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Step Icon/Check */}
                  <span
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${isCompleted
                      ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                      : isActive
                        ? 'border-blue-600 bg-white text-blue-600 shadow-lg dark:border-blue-500 dark:bg-slate-900 dark:text-blue-400'
                        : 'border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <StepIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2 text-sm font-medium transition-colors ${isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : isCompleted
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400'
                    }`}
                >
                  {step.title}
                </span>

                {/* Step Description (hidden on mobile) */}
                {step.description && (
                  <span
                    className={`mt-1 hidden text-xs sm:block ${isActive || isCompleted
                      ? 'text-slate-600 dark:text-slate-400'
                      : 'text-slate-400 dark:text-slate-500'
                      }`}
                  >
                    {step.description}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
