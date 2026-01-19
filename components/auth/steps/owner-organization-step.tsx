import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, FolderKanban, Mail, Phone } from 'lucide-react';

interface OwnerOrganizationStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (data: Record<string, any>) => void;
}

export function OwnerOrganizationStep({
  formData,
  errors,
  onChange,
}: OwnerOrganizationStepProps) {
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
        {/* Organization Name */}
        <div className="space-y-2">
          <Label htmlFor="organizationName" className="text-slate-700 dark:text-slate-300">
            Nombre de la organización <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="organizationName"
              type="text"
              placeholder="Mi Empresa S.A."
              value={formData.organizationName || ''}
              onChange={(e) => updateField('organizationName', e.target.value)}
              className={`pl-10 ${errors.organizationName ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.organizationName && (
            <p className="text-sm text-red-500">{errors.organizationName}</p>
          )}
        </div>

        {/* Workspace Name */}
        <div className="space-y-2">
          <Label htmlFor="workspaceName" className="text-slate-700 dark:text-slate-300">
            Nombre del workspace inicial <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <FolderKanban className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="workspaceName"
              type="text"
              placeholder="Proyectos Principales"
              value={formData.workspaceName || 'Default'}
              onChange={(e) => updateField('workspaceName', e.target.value)}
              className={`pl-10 ${errors.workspaceName ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.workspaceName && (
            <p className="text-sm text-red-500">{errors.workspaceName}</p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Puedes crear más espacios de trabajo después
          </p>
        </div>

        {/* Contact Email (optional) */}
        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-slate-700 dark:text-slate-300">
            Email de contacto (opcional)
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="contactEmail"
              type="email"
              placeholder="contacto@empresa.com"
              value={formData.contactEmail || ''}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              className={`pl-10 ${errors.contactEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
          </div>
          {errors.contactEmail && (
            <p className="text-sm text-red-500">{errors.contactEmail}</p>
          )}
        </div>

        {/* Phone (optional) */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">
            Teléfono (opcional)
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
