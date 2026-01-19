import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBuilding } from "@tabler/icons-react";

interface OwnerOrganizationStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (data: Record<string, any>) => void;
}

export function OwnerOrganizationStep({ formData, errors, onChange }: OwnerOrganizationStepProps) {
  const updateField = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Configura tu organización
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Define el nombre de tu organización y tu primer espacio de trabajo
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="organizationName" className="text-slate-700 dark:text-slate-300">
            Nombre de la organización <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <IconBuilding className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="organizationName"
              type="text"
              placeholder="Mi Empresa S.A."
              value={formData.organizationName || ''}
              onChange={e => updateField('organizationName', e.target.value)}
              className="pl-10"
              required
            />
          </div>
          {errors.organizationName && <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>}
        </div>
      </div>
    </div>
  );
}
