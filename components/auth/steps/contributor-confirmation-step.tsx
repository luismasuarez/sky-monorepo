import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconFolder, IconMail, IconShield, IconUser } from '@tabler/icons-react';

interface ContributorConfirmationStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (data: Record<string, any>) => void;
}

export function ContributorConfirmationStep({
  formData,
  errors,
  onChange,
}: ContributorConfirmationStepProps) {
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

      {/* Summary */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <IconShield className="h-5 w-5 text-green-600 dark:text-green-400" />
          Resumen de tu cuenta
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <IconUser className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Nombre</p>
              <p className="text-slate-600 dark:text-slate-400">
                {formData.fullName || 'No especificado'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconMail className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Email</p>
              <p className="text-slate-600 dark:text-slate-400">
                {formData.email || 'No especificado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Name */}
      <div className="space-y-2">
        <Label htmlFor="workspaceName" className="text-slate-700 dark:text-slate-300">
          Nombre de tu espacio personal
        </Label>
        <div className="relative">
          <IconFolder className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="workspaceName"
            type="text"
            placeholder="Mi Espacio"
            value={formData.workspaceName || 'Mi Espacio'}
            onChange={(e) => onChange({ workspaceName: e.target.value })}
            className="pl-10"
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Puedes cambiarlo después en la configuración
        </p>
      </div>

      {/* Terms */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms || false}
            onCheckedChange={(checked) => onChange({ acceptTerms: checked })}
            className={errors.acceptTerms ? 'border-red-500' : ''}
          />
          <div className="space-y-1 flex-1">
            <Label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              Acepto los términos y condiciones <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              He leído y acepto los{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                términos de servicio
              </a>
            </p>
          </div>
        </div>
        {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
      </div>
    </div>
  );
}
