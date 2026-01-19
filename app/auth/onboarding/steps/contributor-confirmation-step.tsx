import { IconUser, IconCircleCheck } from "@tabler/icons-react";

interface ContributorConfirmationStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (data: Record<string, any>) => void;
}

export function ContributorConfirmationStep({ formData }: ContributorConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Configura tu espacio
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Personaliza tu workspace personal y acepta los términos
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <IconCircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          Resumen de tu cuenta
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <IconUser className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Nombre</p>
              <p className="text-slate-600 dark:text-slate-400">{formData.fullName || 'No especificado'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
