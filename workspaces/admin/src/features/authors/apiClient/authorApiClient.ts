import { inject } from 'regexparam';

import type { DeleteAuthorRequestParams } from '@wsh-2024/schema/src/api/authors/DeleteAuthorRequestParams';
import type { DeleteAuthorResponse } from '@wsh-2024/schema/src/api/authors/DeleteAuthorResponse';
import type { GetAuthorListRequestQuery } from '@wsh-2024/schema/src/api/authors/GetAuthorListRequestQuery';
import type { GetAuthorListResponse } from '@wsh-2024/schema/src/api/authors/GetAuthorListResponse';
import type { GetAuthorRequestParams } from '@wsh-2024/schema/src/api/authors/GetAuthorRequestParams';
import type { GetAuthorResponse } from '@wsh-2024/schema/src/api/authors/GetAuthorResponse';
import type { PatchAuthorRequestBody } from '@wsh-2024/schema/src/api/authors/PatchAuthorRequestBody';
import type { PatchAuthorRequestParams } from '@wsh-2024/schema/src/api/authors/PatchAuthorRequestParams';
import type { PatchAuthorResponse } from '@wsh-2024/schema/src/api/authors/PatchAuthorResponse';
import type { PostAuthorRequestBody } from '@wsh-2024/schema/src/api/authors/PostAuthorRequestBody';
import type { PostAuthorResponse } from '@wsh-2024/schema/src/api/authors/PostAuthorResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type AuthorApiClient = DomainSpecificApiClientInterface<{
  delete: [{ params: DeleteAuthorRequestParams }, DeleteAuthorResponse];
  fetch: [{ params: GetAuthorRequestParams }, GetAuthorResponse];
  fetchList: [{ query: GetAuthorListRequestQuery }, GetAuthorListResponse];
  post: [{ body: PostAuthorRequestBody }, PostAuthorResponse];
  update: [{ body: PatchAuthorRequestBody; params: PatchAuthorRequestParams }, PatchAuthorResponse];
}>;

export const authorApiClient: AuthorApiClient = {
  delete: async ({ params }) => {
    const response = await apiClient.delete(inject('api/v1/authors/:authorId', params)).json<DeleteAuthorResponse>();
    return response;
  },
  delete$$key: (options) => [
    {
      method: 'delete',
      requestUrl: '/api/v1/authors/:authorId',
    },
    options,
  ],
  fetch: async ({ params }) => {
    const response = await apiClient.get(inject('api/v1/authors/:authorId', params)).json<GetAuthorResponse>();
    return response;
  },
  fetch$$key: (options) => [
    {
      method: 'get',
      requestUrl: '/api/v1/authors/:authorId',
    },
    options,
  ],
  fetchList: async ({ query }) => {
    const response = await apiClient
      .get(inject('api/v1/authors', {}), { searchParams: query })
      .json<GetAuthorListResponse>();
    return response;
  },
  fetchList$$key: (options) => [
    {
      method: 'get',
      requestUrl: '/api/v1/authors',
    },
    options,
  ],
  post: async ({ body }) => {
    const response = await apiClient.post(inject('api/v1/authors', {}), { json: body }).json<PostAuthorResponse>();
    return response;
  },
  post$$key: (options) => [
    {
      method: 'post',
      requestUrl: '/api/v1/authors',
    },
    options,
  ],
  update: async ({ body, params }) => {
    const response = await apiClient
      .patch(inject('api/v1/authors/:authorId', params), { json: body })
      .json<PatchAuthorResponse>();
    return response;
  },
  update$$key: (options) => [
    {
      method: 'patch',
      requestUrl: '/api/v1/authors/:authorId',
    },
    options,
  ],
};
