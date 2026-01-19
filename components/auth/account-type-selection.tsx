import { AccountType } from '@/app/auth/types';
import { Button } from '@/components/ui/button';
import { IconBuilding, IconUser } from '@tabler/icons-react';

interface AccountTypeSelectionProps {
  onSelect: (type: AccountType) => void;
}

export function AccountTypeSelection({ onSelect }: AccountTypeSelectionProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          ¡Bienvenido a Dokkao!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          ¿Cómo vas a usar la plataforma?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Owner / Organization Card */}
        <button
          onClick={() => onSelect(AccountType.ORGANIZATION)}
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

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 w-full">
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Invita y asigna tareas a desarrolladores
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Gestiona múltiples proyectos y workspaces
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  Reportes de tiempo y facturación
                </li>
              </ul>
            </div>

            <Button
              variant="default"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Crear Organización
            </Button>
          </div>
        </button>

        {/* Contributor / Freelancer Card */}
        <button
          onClick={() => onSelect(AccountType.FREELANCER)}
          className="group relative p-8 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-400 transition-all duration-200 bg-white/50 dark:bg-slate-800/50 hover:bg-green-50/50 dark:hover:bg-green-900/20 text-left"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <IconUser className="w-10 h-10 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Soy Desarrollador Freelancer
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Organiza tus proyectos personales, registra tu tiempo y acepta invitaciones de empleadores.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 w-full">
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Gestiona tus proyectos personales
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Registra tiempo y calcula costos
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Acepta invitaciones de organizaciones
                </li>
              </ul>
            </div>

            <Button
              variant="default"
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Crear Cuenta Personal
            </Button>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Podrás cambiar tu configuración más adelante
      </div>
    </div>
  );
}
