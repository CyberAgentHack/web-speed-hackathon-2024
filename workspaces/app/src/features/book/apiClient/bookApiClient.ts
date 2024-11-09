import { inject } from 'regexparam';

import type { GetBookListRequestQuery } from '@wsh-2024/schema/src/api/books/GetBookListRequestQuery';
import type { GetBookListResponse } from '@wsh-2024/schema/src/api/books/GetBookListResponse';
import type { GetBookRequestParams } from '@wsh-2024/schema/src/api/books/GetBookRequestParams';
import type { GetBookResponse } from '@wsh-2024/schema/src/api/books/GetBookResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type BookApiClient = DomainSpecificApiClientInterface<{
  fetch: [{ params: GetBookRequestParams }, GetBookResponse];
  fetchList: [{ query: GetBookListRequestQuery }, GetBookListResponse];
}>;

export const bookApiClient: BookApiClient = {
  fetch: async ({ params }) => {
    const response = await apiClient.get<GetBookResponse>(inject('/api/v1/books/:bookId', params));
    return response.data;
  },
  fetch$$key: (options) => ({
    requestUrl: `/api/v1/books/:bookId`,
    ...options,
  }),
  fetchList: async ({ query }) => {
    const response = await apiClient.get<GetBookListResponse>(inject('/api/v1/books', {}), {
      params: query,
    });
    return response.data;
  },
  fetchList$$key: (options) => ({
    requestUrl: `/api/v1/books`,
    ...options,
  }),
};
