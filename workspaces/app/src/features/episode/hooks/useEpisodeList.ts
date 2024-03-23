import useSWR from 'swr';

import { episodeApiClient } from '../apiClient/episodeApiClient';

export function useEpisodeList(...[options]: Parameters<typeof episodeApiClient.fetchList>) {
  return useSWR(episodeApiClient.fetchList$$key(options), episodeApiClient.fetchList, { suspense: true });
}
