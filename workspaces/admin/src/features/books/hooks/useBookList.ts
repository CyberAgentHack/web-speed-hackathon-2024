import { useQuery } from '@tanstack/react-query';

import { bookApiClient } from '../apiClient/bookApiClient';

export const useBookList = () => {
  return useQuery({
    queryFn: async ({ queryKey: [, options] }) => {
      return bookApiClient.fetchList(options);
    },
    queryKey: bookApiClient.fetchList$$key({ query: {} }),
  });
};
