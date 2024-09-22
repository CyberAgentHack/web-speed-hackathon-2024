import useSWR from 'swr';

import { bookApiClient } from '../apiClient/bookApiClient';

export function useBookDetail(...[options]: Parameters<typeof bookApiClient.fetchDetail>) {
  return useSWR(bookApiClient.fetchDetail$$key(options), bookApiClient.fetchDetail, { suspense: true });
}
