import { useQuery } from '@tanstack/react-query';

import { episodeApiClient } from '../apiClient/episodeApiClient';

export const useEpisodeList = ({ bookId }: { bookId: string }) => {
  return useQuery({
    queryFn: async ({ queryKey: [, options] }) => {
      return episodeApiClient.fetchList(options);
    },
    queryKey: episodeApiClient.fetchList$$key({ query: { bookId } }),
  });
};
