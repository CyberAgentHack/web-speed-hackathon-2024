import useSWR from 'swr';

import { bookApiClient } from '../apiClient/bookApiClient';

export function useBook(...[options]: Parameters<typeof bookApiClient.fetch>) {
  return useSWR(bookApiClient.fetch$$key(options), bookApiClient.fetch, { suspense: true });
}
