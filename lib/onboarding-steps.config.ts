import type { LucideIcon } from 'lucide-react';
import { User, Building2, CheckCircle2 } from 'lucide-react';

/**
 * Step configuration for onboarding flows
 */
export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
}

/**
 * Owner (Organization) onboarding steps
 */
export const ownerSteps: StepConfig[] = [
  {
    id: 'account',
    title: 'Cuenta',
    description: 'Crea tu cuenta de administrador',
    icon: User,
  },
  {
    id: 'organization',
    title: 'Organización',
    description: 'Configura tu organización',
    icon: Building2,
  },
  {
    id: 'confirmation',
    title: 'Confirmación',
    description: 'Revisa y confirma',
    icon: CheckCircle2,
  },
];

/**
 * Contributor (Freelancer) onboarding steps
 */
export const contributorSteps: StepConfig[] = [
  {
    id: 'account',
    title: 'Cuenta',
    description: 'Crea tu cuenta personal',
    icon: User,
  },
  {
    id: 'confirmation',
    title: 'Confirmación',
    description: 'Configura tu espacio',
    icon: CheckCircle2,
  },
];
