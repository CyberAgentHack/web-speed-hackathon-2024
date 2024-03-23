import { inject } from 'regexparam';

import type { GetRankingListRequestQuery } from '@wsh-2024/schema/src/api/rankings/GetRankingListRequestQuery';
import type { GetRankingListResponse } from '@wsh-2024/schema/src/api/rankings/GetRankingListResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type RankingApiClient = DomainSpecificApiClientInterface<{
  fetchList: [{ query: GetRankingListRequestQuery }, GetRankingListResponse];
}>;

export const rankingApiClient: RankingApiClient = {
  fetchList: async ({ query }) => {
    const response = await apiClient.get<GetRankingListResponse>(inject('/api/v1/rankings', {}), {
      params: query,
    });
    return response.data;
  },
  fetchList$$key: (options) => ({
    requestUrl: `/api/v1/rankings`,
    ...options,
  }),
};
