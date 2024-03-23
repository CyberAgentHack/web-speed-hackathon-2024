import { inject } from 'regexparam';

import type { PostImageRequestBody } from '@wsh-2024/schema/src/api/images/PostImageRequestBody';
import type { PostImageResponse } from '@wsh-2024/schema/src/api/images/PostImageResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

export type ImageApiClient = DomainSpecificApiClientInterface<{
  post: [{ body: PostImageRequestBody }, PostImageResponse];
}>;

export const imageApiClient: ImageApiClient = {
  post: async ({ body }) => {
    const formData = new FormData();
    formData.append('alt', body.alt);
    formData.append('content', body.content);

    const response = await apiClient
      .post(inject('api/v1/images', {}), {
        body: formData,
      })
      .json<PostImageResponse>();
    return response;
  },
  post$$key: (options) => [
    {
      method: 'post',
      requestUrl: `/api/v1/images`,
    },
    options,
  ],
};
