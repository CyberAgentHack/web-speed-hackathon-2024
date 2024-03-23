import { useQuery } from '@tanstack/react-query';

import { releaseApiClient } from '../apiClient/releaseApiClient';

export const useReleaseList = () => {
  return useQuery({
    queryFn: async () => {
      return releaseApiClient.fetchList();
    },
    queryKey: releaseApiClient.fetchList$$key(),
  });
};
