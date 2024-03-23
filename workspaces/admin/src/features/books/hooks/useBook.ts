import { useQuery } from '@tanstack/react-query';

import { bookApiClient } from '../apiClient/bookApiClient';

export const useBook = ({ bookId }: { bookId: string }) => {
  return useQuery({
    queryFn: async ({ queryKey: [, options] }) => {
      return bookApiClient.fetch(options);
    },
    queryKey: bookApiClient.fetch$$key({ params: { bookId } }),
  });
};
