import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContributorOnboardingData } from '@/types/onboardingTypes';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';

interface ContributorOnboardingFormProps {
  onSubmit: (data: ContributorOnboardingData) => Promise<void>;
  onBack?: () => void;
  isLoading?: boolean;
}

interface ContributorOnboardingFormData extends ContributorOnboardingData {
  confirmPassword: string;
}

export function ContributorOnboardingForm({ onSubmit, onBack, isLoading }: ContributorOnboardingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContributorOnboardingFormData>({
    mode: 'onBlur',
    defaultValues: {
      workspaceName: 'Personal',
    },
  });

  const password = watch('password');

  const handleFormSubmit = async (data: ContributorOnboardingFormData) => {
    try {
      // Remove confirmPassword before submitting
      const { confirmPassword, ...onboardingData } = data;
      await onSubmit(onboardingData);
    } catch (err) {
      console.error('Contributor onboarding error:', err);
    }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 max-w-lg w-full">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500/90 to-green-600/90 dark:from-green-400/90 dark:to-green-500/90 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <IconUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Crear Cuenta Personal
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Configura tu cuenta de freelancer
          </p>
        </div>

        <form onSubmit={() => { }} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
              >
                <IconUser className="w-4 h-4 mr-2 text-green-500" />
                Nombre Completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                {...register('name', {
                  required: 'Nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'Mínimo 2 caracteres',
                  },
                })}
                disabled={isLoading}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
              >
                <IconMail className="w-4 h-4 mr-2 text-green-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register('email', {
                  required: 'Email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Formato de email inválido',
                  },
                })}
                disabled={isLoading}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
              >
                <IconLock className="w-4 h-4 mr-2 text-green-500" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Contraseña es requerida',
                  minLength: {
                    value: 8,
                    message: 'Mínimo 8 caracteres',
                  },
                })}
                disabled={isLoading}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
              >
                <IconLock className="w-4 h-4 mr-2 text-green-500" />
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Confirmación es requerida',
                  validate: (value) =>
                    value === password || 'Las contraseñas no coinciden',
                })}
                disabled={isLoading}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>Cuenta gratuita:</strong> Como freelancer, tu cuenta es completamente gratuita.
              Podrás gestionar tus proyectos y aceptar invitaciones de organizaciones.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
                className="flex-1"
              >
                Volver
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Creando...' : 'Crear Cuenta'}
            </Button>
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Al crear tu cuenta, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </form>
      </div>
    </div>
  );
}
