import useSWR from 'swr';

import { authorApiClient } from '../apiClient/authorApiClient';

export function useAuthorList(...[options]: Parameters<typeof authorApiClient.fetchList>) {
  return useSWR(authorApiClient.fetchList$$key(options), authorApiClient.fetchList, { suspense: true });
}
