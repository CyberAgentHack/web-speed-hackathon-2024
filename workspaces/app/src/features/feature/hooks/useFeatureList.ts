import useSWR from 'swr';

import { featureApiClient } from '../apiClient/featureApiClient';

export function useFeatureList(...[options]: Parameters<typeof featureApiClient.fetchList>) {
  return useSWR(featureApiClient.fetchList$$key(options), featureApiClient.fetchList, { suspense: true });
}
