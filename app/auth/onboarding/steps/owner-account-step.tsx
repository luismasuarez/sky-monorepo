import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUser } from "@tabler/icons-react";

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
              onChange={e => updateField('fullName', e.target.value)}
              className="pl-10"
              required
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <IconUser className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="correo@empresa.com"
              value={formData.email || ''}
              onChange={e => updateField('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
}
