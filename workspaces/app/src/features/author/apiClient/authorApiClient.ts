import { inject } from 'regexparam';

import type { GetAuthorListRequestQuery } from '@wsh-2024/schema/src/api/authors/GetAuthorListRequestQuery';
import type { GetAuthorListResponse } from '@wsh-2024/schema/src/api/authors/GetAuthorListResponse';
import type { GetAuthorRequestParams } from '@wsh-2024/schema/src/api/authors/GetAuthorRequestParams';
import type { GetAuthorResponse } from '@wsh-2024/schema/src/api/authors/GetAuthorResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type AuthorApiClient = DomainSpecificApiClientInterface<{
  fetch: [{ params: GetAuthorRequestParams }, GetAuthorResponse];
  fetchList: [{ query: GetAuthorListRequestQuery }, GetAuthorListResponse];
}>;

export const authorApiClient: AuthorApiClient = {
  fetch: async ({ params }) => {
    const response = await apiClient.get<GetAuthorResponse>(inject('/api/v1/authors/:authorId', params));
    return response.data;
  },
  fetch$$key: (options) => ({
    requestUrl: `/api/v1/authors/:authorId`,
    ...options,
  }),
  fetchList: async ({ query }) => {
    const response = await apiClient.get<GetAuthorListResponse>(inject('/api/v1/authors', {}), {
      params: query,
    });
    return response.data;
  },
  fetchList$$key: (options) => ({
    requestUrl: `/api/v1/authors`,
    ...options,
  }),
};
