import { useQuery } from '@tanstack/react-query';

import { episodeApiClient } from '../apiClient/episodeApiClient';

export const useEpisode = ({ episodeId }: { episodeId: string }) => {
  return useQuery({
    queryFn: async ({ queryKey: [, options] }) => {
      return episodeApiClient.fetch(options);
    },
    queryKey: episodeApiClient.fetch$$key({ params: { episodeId } }),
  });
};
