import { IconUser, IconBuilding, IconCircleCheck } from '@tabler/icons-react';

/**
 * Step configuration for onboarding flows
 */
export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
}

/**
 * Owner (Organization) onboarding steps
 */
export const ownerSteps: StepConfig[] = [
  {
    id: 'account',
    title: 'Cuenta',
    description: 'Crea tu cuenta de administrador',
    icon: IconUser,
  },
  {
    id: 'organization',
    title: 'Organización',
    description: 'Configura tu organización',
    icon: IconBuilding,
  },
  {
    id: 'confirmation',
    title: 'Confirmación',
    description: 'Revisa y confirma',
    icon: IconCircleCheck,
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
    icon: IconUser,
  },
  {
    id: 'confirmation',
    title: 'Confirmación',
    description: 'Configura tu espacio',
    icon: IconCircleCheck,
  },
];
