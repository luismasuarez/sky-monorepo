import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OwnerOnboardingData } from '@/types/onboardingTypes';
import {
  IconBriefcase,
  IconBuilding,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from '@tabler/icons-react';
import { useForm } from 'react-hook-form';

interface OwnerOnboardingFormProps {
  onSubmit: (data: OwnerOnboardingData) => Promise<void>;
  onBack?: () => void;
  isLoading?: boolean;
}

interface OwnerOnboardingFormData extends OwnerOnboardingData {
  confirmPassword: string;
}

export function OwnerOnboardingForm({ onSubmit, onBack, isLoading }: OwnerOnboardingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OwnerOnboardingFormData>({
    mode: 'onBlur',
    defaultValues: {
      workspaceName: 'Default',
    },
  });

  const password = watch('password');

  const handleFormSubmit = async (data: OwnerOnboardingFormData) => {
    try {
      // Remove confirmPassword before submitting
      const { confirmPassword, ...onboardingData } = data;
      await onSubmit(onboardingData);
    } catch (err) {
      console.error('Owner onboarding error:', err);
    }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 max-w-2xl w-full">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:from-blue-400/90 dark:to-blue-500/90 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <IconBuilding className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Crear Organización
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Configura tu organización y workspace inicial
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* User Account Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Datos de Cuenta
            </h3>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
              >
                <IconMail className="w-4 h-4 mr-2 text-blue-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
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
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
                >
                  <IconLock className="w-4 h-4 mr-2 text-blue-500" />
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
                  <IconLock className="w-4 h-4 mr-2 text-blue-500" />
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Confirmación es requerida',
                    validate: value => value === password || 'Las contraseñas no coinciden',
                  })}
                  disabled={isLoading}
                  className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Organization Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Datos de Organización
            </h3>

            <div className="space-y-2">
              <Label
                htmlFor="organizationName"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
              >
                <IconBuilding className="w-4 h-4 mr-2 text-blue-500" />
                Nombre de Organización *
              </Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Mi Empresa S.A."
                {...register('organizationName', {
                  required: 'Nombre de organización es requerido',
                  minLength: {
                    value: 2,
                    message: 'Mínimo 2 caracteres',
                  },
                })}
                disabled={isLoading}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
              />
              {errors.organizationName && (
                <p className="text-sm text-red-500">{errors.organizationName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="workspaceName"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
              >
                <IconBriefcase className="w-4 h-4 mr-2 text-blue-500" />
                Nombre del Workspace Inicial
              </Label>
              <Input
                id="workspaceName"
                type="text"
                placeholder="Default"
                {...register('workspaceName', {
                  required: 'Nombre de workspace es requerido',
                })}
                disabled={isLoading}
                className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
              />
              {errors.workspaceName && (
                <p className="text-sm text-red-500">{errors.workspaceName.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contactName"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
                >
                  <IconUser className="w-4 h-4 mr-2 text-blue-500" />
                  Nombre de Contacto (Opcional)
                </Label>
                <Input
                  id="contactName"
                  type="text"
                  placeholder="Juan Pérez"
                  {...register('contactName')}
                  disabled={isLoading}
                  className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
                >
                  <IconPhone className="w-4 h-4 mr-2 text-blue-500" />
                  Teléfono (Opcional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  {...register('phone')}
                  disabled={isLoading}
                  className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Creando...' : 'Crear Organización'}
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
