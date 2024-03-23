import { useSuspenseQuery } from '@tanstack/react-query';

import { authApiClient } from '../apiClient/authApiClient';

export function useAuthUser() {
  return useSuspenseQuery({
    queryFn: async () => {
      try {
        const user = await authApiClient.fetchAuthUser();
        return user;
      } catch (_err) {
        return null;
      }
    },
    queryKey: authApiClient.fetchAuthUser$$key(),
  });
}
