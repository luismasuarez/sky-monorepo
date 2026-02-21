import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconAlertCircle, IconLock, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });

  const router = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.error) {
        setLoginError(result.error);
      } else if (result?.ok) {
        onSuccess?.();
        router.replace("/");
      } else {
        setLoginError("Error al iniciar sesión");
      }
    } catch (err) {
      setLoginError("Error inesperado al iniciar sesión");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/90 to-blue-600/90 dark:from-blue-400/90 dark:to-blue-500/90 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <IconLock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error message */}
        {loginError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
            <IconAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center"
          >
            <IconMail className="w-4 h-4 mr-2 text-blue-500" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            {...register('email', {
              required: 'Email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Formato de email inválido'
              }
            })}
            disabled={isLoading}
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
            <IconLock className="w-4 h-4 mr-2 text-purple-500" />
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            {...register('password', {
              required: 'Contraseña es requerida',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres'
              }
            })}
            disabled={isLoading}
            className="w-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Iniciando sesión...</span>
            </div>
          ) : (
            <span>Iniciar Sesión</span>
          )}
        </Button>

        {/* Link to Onboarding */}
        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            ¿No tienes cuenta?
          </p>
          <Link
            href="/auth/onboarding"
            className="inline-flex items-center justify-center font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            Comienza gratis →
          </Link>
        </div>
      </form>
    </div>
  );
}