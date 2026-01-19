import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/services/query-keys';
import { apiService } from '@/lib/services/api-service';

export const useSessionUser = () =>
  useQuery({
    queryKey: queryKeys.session,
    queryFn: apiService.getSession,
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data?.user,
  });
