import { inject } from 'regexparam';

import type { GetReleaseListResponse } from '@wsh-2024/schema/src/api/releases/GetReleaseListResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type ReleaseApiClient = DomainSpecificApiClientInterface<{
  fetchList: [void, GetReleaseListResponse];
}>;

export const releaseApiClient: ReleaseApiClient = {
  fetchList: async () => {
    const response = await apiClient.get(inject('api/v1/releases', {})).json<GetReleaseListResponse>();
    return response;
  },
  fetchList$$key: () => [
    {
      method: 'get',
      requestUrl: `/api/v1/releases`,
    },
  ],
};
