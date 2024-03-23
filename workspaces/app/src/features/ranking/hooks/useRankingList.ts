import useSWR from 'swr';

import { rankingApiClient } from '../apiClient/rankingApiClient';

export function useRankingList(...[options]: Parameters<typeof rankingApiClient.fetchList>) {
  return useSWR(rankingApiClient.fetchList$$key(options), rankingApiClient.fetchList, { suspense: true });
}
