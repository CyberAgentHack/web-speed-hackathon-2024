import { inject } from 'regexparam';

import type { DeleteEpisodePageRequestParams } from '@wsh-2024/schema/src/api/episodePages/DeleteEpisodePageRequestParams';
import type { DeleteEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/DeleteEpisodePageResponse';
import type { GetEpisodePageListRequestQuery } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageListRequestQuery';
import type { GetEpisodePageListResponse } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageListResponse';
import type { GetEpisodePageRequestParams } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageRequestParams';
import type { GetEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageResponse';
import type { PatchEpisodePageRequestBody } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageRequestBody';
import type { PatchEpisodePageRequestParams } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageRequestParams';
import type { PatchEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageResponse';
import type { PostEpisodePageRequestBody } from '@wsh-2024/schema/src/api/episodePages/PostEpisodePageRequestBody';
import type { PostEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/PostEpisodePageResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type EpisodePageApiClient = DomainSpecificApiClientInterface<{
  delete: [{ params: DeleteEpisodePageRequestParams }, DeleteEpisodePageResponse];
  fetch: [{ params: GetEpisodePageRequestParams }, GetEpisodePageResponse];
  fetchList: [{ query: GetEpisodePageListRequestQuery }, GetEpisodePageListResponse];
  post: [{ body: PostEpisodePageRequestBody }, PostEpisodePageResponse];
  update: [{ body: PatchEpisodePageRequestBody; params: PatchEpisodePageRequestParams }, PatchEpisodePageResponse];
}>;

export const episodePageApiClient: EpisodePageApiClient = {
  delete: async ({ params }) => {
    const response = await apiClient
      .delete(inject('api/v1/episodePages/:episodePageId', params))
      .json<DeleteEpisodePageResponse>();
    return response;
  },
  delete$$key: (options) => [
    {
      method: 'delete',
      requestUrl: '/api/v1/episodePages/:episodePageId',
    },
    options,
  ],
  fetch: async ({ params }) => {
    const response = await apiClient
      .get(inject('api/v1/episodePages/:episodePageId', params))
      .json<GetEpisodePageResponse>();
    return response;
  },
  fetch$$key: (options) => [
    {
      method: 'get',
      requestUrl: '/api/v1/episodePages/:episodePageId',
    },
    options,
  ],
  fetchList: async ({ query }) => {
    const response = await apiClient
      .get(inject('api/v1/episodePages', {}), { searchParams: query })
      .json<GetEpisodePageListResponse>();
    return response;
  },
  fetchList$$key: (options) => [
    {
      method: 'get',
      requestUrl: '/api/v1/episodePages',
    },
    options,
  ],
  post: async ({ body }) => {
    const response = await apiClient
      .post(inject('api/v1/episodePages', {}), { json: body })
      .json<PostEpisodePageResponse>();
    return response;
  },
  post$$key: (options) => [
    {
      method: 'post',
      requestUrl: '/api/v1/episodePages',
    },
    options,
  ],
  update: async ({ body, params }) => {
    const response = await apiClient
      .patch(inject('api/v1/episodePages/:episodePageId', params), { json: body })
      .json<PatchEpisodePageResponse>();
    return response;
  },
  update$$key: (options) => [
    {
      method: 'patch',
      requestUrl: '/api/v1/episodePages/:episodePageId',
    },
    options,
  ],
};
