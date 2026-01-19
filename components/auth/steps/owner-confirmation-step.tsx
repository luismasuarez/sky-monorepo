import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { IconBuilding, IconFolder, IconMail, IconShield, IconUser } from '@tabler/icons-react';

interface OwnerConfirmationStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (data: Record<string, any>) => void;
}

export function OwnerConfirmationStep({
  formData,
  errors,
  onChange,
}: OwnerConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Revisa y confirma
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Verifica que toda la información sea correcta antes de crear tu organización
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <IconShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Resumen de tu cuenta
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <IconUser className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Administrador</p>
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

          <div className="flex items-start gap-3">
            <IconBuilding className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Organización</p>
              <p className="text-slate-600 dark:text-slate-400">
                {formData.organizationName || 'No especificado'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconFolder className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Workspace inicial</p>
              <p className="text-slate-600 dark:text-slate-400">
                {formData.workspaceName || 'Default'}
              </p>
            </div>
          </div>
        </div>
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
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                términos de servicio
              </a>
            </p>
          </div>
        </div>
        {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptPrivacy"
            checked={formData.acceptPrivacy || false}
            onCheckedChange={(checked) => onChange({ acceptPrivacy: checked })}
            className={errors.acceptPrivacy ? 'border-red-500' : ''}
          />
          <div className="space-y-1 flex-1">
            <Label
              htmlFor="acceptPrivacy"
              className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              Acepto la política de privacidad <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              He leído y acepto la{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                política de privacidad
              </a>
            </p>
          </div>
        </div>
        {errors.acceptPrivacy && (
          <p className="text-sm text-red-500">{errors.acceptPrivacy}</p>
        )}
      </div>
    </div>
  );
}
