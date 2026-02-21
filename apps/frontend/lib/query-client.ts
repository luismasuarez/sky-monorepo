import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos por defecto
      gcTime: 10 * 60 * 1000,   // 10 minutos en caché
      retry: 1,                  // 1 reintento
      refetchOnWindowFocus: false, // No refetch al cambiar ventana
    },
  },
});
