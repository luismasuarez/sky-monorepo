import { IconBuilding, IconCircleDashedCheck, IconUser } from "@tabler/icons-react";

export const ownerSteps = [
  {
    id: "account",
    title: "Cuenta",
    description: "Crea tu cuenta de administrador",
    icon: IconUser,
  },
  {
    id: "organization",
    title: "Organización",
    description: "Configura tu organización",
    icon: IconBuilding,
  },
  {
    id: "confirmation",
    title: "Confirmación",
    description: "Revisa y confirma",
    icon: IconCircleDashedCheck,
  },
];

export const contributorSteps = [
  {
    id: "account",
    title: "Cuenta",
    description: "Crea tu cuenta personal",
    icon: IconUser,
  },
  {
    id: "confirmation",
    title: "Configura tu espacio",
    description: "Configura tu espacio",
    icon: IconCircleDashedCheck,
  },
];
