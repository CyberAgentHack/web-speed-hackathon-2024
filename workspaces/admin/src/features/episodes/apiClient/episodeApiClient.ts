import { inject } from 'regexparam';

import type { DeleteEpisodeRequestParams } from '@wsh-2024/schema/src/api/episodes/DeleteEpisodeRequestParams';
import type { DeleteEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/DeleteEpisodeResponse';
import type { GetEpisodeListRequestQuery } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListRequestQuery';
import type { GetEpisodeListResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListResponse';
import type { GetEpisodeRequestParams } from '@wsh-2024/schema/src/api/episodes/GetEpisodeRequestParams';
import type { GetEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeResponse';
import type { PatchEpisodeRequestBody } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeRequestBody';
import type { PatchEpisodeRequestParams } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeRequestParams';
import type { PatchEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeResponse';
import type { PostEpisodeRequestBody } from '@wsh-2024/schema/src/api/episodes/PostEpisodeRequestBody';
import type { PostEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/PostEpisodeResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type EpisodeApiClient = DomainSpecificApiClientInterface<{
  delete: [{ params: DeleteEpisodeRequestParams }, DeleteEpisodeResponse];
  fetch: [{ params: GetEpisodeRequestParams }, GetEpisodeResponse];
  fetchList: [{ query: GetEpisodeListRequestQuery }, GetEpisodeListResponse];
  post: [{ body: PostEpisodeRequestBody }, PostEpisodeResponse];
  update: [{ body: PatchEpisodeRequestBody; params: PatchEpisodeRequestParams }, PatchEpisodeResponse];
}>;

export const episodeApiClient: EpisodeApiClient = {
  delete: async ({ params }) => {
    const response = await apiClient.delete(inject('api/v1/episodes/:episodeId', params)).json<DeleteEpisodeResponse>();
    return response;
  },
  delete$$key: (options) => [
    {
      method: 'delete',
      requestUrl: '/api/v1/episodes/:episodeId',
    },
    options,
  ],
  fetch: async ({ params }) => {
    const response = await apiClient.get(inject('api/v1/episodes/:episodeId', params)).json<GetEpisodeResponse>();
    return response;
  },
  fetch$$key: (options) => [
    {
      method: 'get',
      requestUrl: '/api/v1/episodes/:episodeId',
    },
    options,
  ],
  fetchList: async ({ query }) => {
    const response = await apiClient
      .get(inject('api/v1/episodes', {}), { searchParams: query })
      .json<GetEpisodeListResponse>();
    return response;
  },
  fetchList$$key: (options) => [
    {
      method: 'get',
      requestUrl: '/api/v1/episodes',
    },
    options,
  ],
  post: async ({ body }) => {
    const response = await apiClient.post(inject('api/v1/episodes', {}), { json: body }).json<PostEpisodeResponse>();
    return response;
  },
  post$$key: (options) => [
    {
      method: 'post',
      requestUrl: '/api/v1/episodes',
    },
    options,
  ],
  update: async ({ body, params }) => {
    const response = await apiClient
      .patch(inject('api/v1/episodes/:episodeId', params), { json: body })
      .json<PatchEpisodeResponse>();
    return response;
  },
  update$$key: (options) => [
    {
      method: 'patch',
      requestUrl: '/api/v1/episodes/:episodeId',
    },
    options,
  ],
};
