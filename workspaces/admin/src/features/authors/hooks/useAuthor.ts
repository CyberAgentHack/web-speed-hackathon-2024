import { useQuery } from '@tanstack/react-query';

import { authorApiClient } from '../apiClient/authorApiClient';

export const useAuthor = ({ authorId }: { authorId: string }) => {
  return useQuery({
    queryFn: async ({ queryKey: [, options] }) => {
      return authorApiClient.fetch(options);
    },
    queryKey: authorApiClient.fetch$$key({ params: { authorId } }),
  });
};
