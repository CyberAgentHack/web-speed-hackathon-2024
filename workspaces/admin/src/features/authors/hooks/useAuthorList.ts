import { useQuery } from '@tanstack/react-query';

import { authorApiClient } from '../apiClient/authorApiClient';

export const useAuthorList = () => {
  return useQuery({
    queryFn: async ({ queryKey: [, options] }) => {
      return authorApiClient.fetchList(options);
    },
    queryKey: authorApiClient.fetchList$$key({ query: {} }),
  });
};
