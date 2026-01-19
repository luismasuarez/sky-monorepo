import { User, Building2, CheckCircle2 } from "lucide-react";

export const ownerSteps = [
  {
    id: "account",
    title: "Cuenta",
    description: "Crea tu cuenta de administrador",
    icon: User,
  },
  {
    id: "organization",
    title: "Organización",
    description: "Configura tu organización",
    icon: Building2,
  },
  {
    id: "confirmation",
    title: "Confirmación",
    description: "Revisa y confirma",
    icon: CheckCircle2,
  },
];

export const contributorSteps = [
  {
    id: "account",
    title: "Cuenta",
    description: "Crea tu cuenta personal",
    icon: User,
  },
  {
    id: "confirmation",
    title: "Configura tu espacio",
    description: "Configura tu espacio",
    icon: CheckCircle2,
  },
];
