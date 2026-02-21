import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';

interface OwnerAccountStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (data: Record<string, any>) => void;
}

export function OwnerAccountStep({ formData, errors, onChange }: OwnerAccountStepProps) {
  const updateField = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Crea tu cuenta de administrador
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Empecemos configurando tu cuenta personal de administrador
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300">
            Nombre completo <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <IconUser className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              value={formData.fullName || ''}
              onChange={(e) => updateField('fullName', e.target.value)}
              className={`pl-10 ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <IconMail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="tu@empresa.com"
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
            Contraseña <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <IconLock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password || ''}
              onChange={(e) => updateField('password', e.target.value)}
              className={`pl-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mínimo 8 caracteres, una mayúscula y un número
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">
            Confirmar contraseña <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <IconLock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword || ''}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              className={`pl-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
}
