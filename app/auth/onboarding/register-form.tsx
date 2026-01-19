import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Mail, UserPlus, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const roles = [
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'developer', label: 'Developer' },
  { value: 'qa', label: 'QA' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  // const { register, isRegisterLoading } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
    defaultValues: {
      role: 'freelancer', // Set default role
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    // try {
    //   await register({
    //     email: data.email,
    //     password: data.password,
    //     role: data.role as RegisterRequest['role'],
    //   });
    //   onSuccess?.();
    // } catch (err) {
    //   // Error handling is now done in the hook with toast notifications
    //   console.error('Register error:', err);
    // }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 max-w-md w-full">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500/90 to-green-600/90 dark:from-green-400/90 dark:to-green-500/90 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Regístrate para acceder a todas las funcionalidades
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
            >
              <Mail className="w-4 h-4 mr-2 text-blue-500" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...registerField('email', {
                required: 'Email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Formato de email inválido'
                }
              })}
              // disabled={isRegisterLoading}
              className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
            >
              <Lock className="w-4 h-4 mr-2 text-purple-500" />
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...registerField('password', {
                required: 'Contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos'
                }
              })}
              // disabled={isRegisterLoading}
              className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
            >
              <Lock className="w-4 h-4 mr-2 text-purple-500" />
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              {...registerField('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: (value, formValues) => value === formValues.password || 'Las contraseñas no coinciden'
              })}
              // disabled={isRegisterLoading}
              className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
              <Users className="w-4 h-4 mr-2 text-orange-500" />
              Rol
            </Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setValue('role', value)}
            // disabled={isRegisterLoading}
            >
              <SelectTrigger className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm">
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent className="glass-light dark:glass-dark border border-slate-200/50 dark:border-slate-700/50">
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value} className="text-slate-900 dark:text-slate-100">
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed py-3"
          // disabled={isRegisterLoading}
          >
            {isRegisterLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creando cuenta...</span>
              </div>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center pt-4">
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToLogin}
                // disabled={isRegisterLoading}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}