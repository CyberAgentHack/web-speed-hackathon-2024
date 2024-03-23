import useSWR from 'swr';

import { releaseApiClient } from '../apiClient/releaseApiClient';

export function useRelease(...[options]: Parameters<typeof releaseApiClient.fetch>) {
  return useSWR(releaseApiClient.fetch$$key(options), releaseApiClient.fetch, { suspense: true });
}
