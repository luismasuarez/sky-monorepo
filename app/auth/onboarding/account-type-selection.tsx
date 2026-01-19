import { IconBuilding, IconUser } from "@tabler/icons-react";

export type AccountType = "ORGANIZATION" | "FREELANCER";

interface AccountTypeSelectionProps {
  onSelect: (type: AccountType) => void;
}

export function AccountTypeSelection({ onSelect }: AccountTypeSelectionProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          ¡Bienvenido a Dokkap!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          ¿Cómo vas a usar la plataforma?
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect("ORGANIZATION")}
          className="group relative p-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-left"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <IconBuilding className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Soy Empleador / Organización
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Crea una organización para gestionar proyectos, invitar desarrolladores y hacer seguimiento del trabajo.
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => onSelect("FREELANCER")}
          className="group relative p-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-left"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <IconUser className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Soy Freelancer
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Crea tu cuenta personal y accede a proyectos, tareas y colaboraciones.
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
