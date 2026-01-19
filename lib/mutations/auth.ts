import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/services/query-keys';
import { apiService } from '@/lib/services/api-service';
import { toast } from 'sonner';

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
      toast.success('Registro exitoso');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error en el registro';
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiService.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
      toast.success('Inicio de sesión exitoso');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
    },
  });
};
