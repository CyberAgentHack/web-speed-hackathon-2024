import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { GetEpisodeListRequestQuerySchema } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListRequestQuery';
import { GetEpisodeListResponseSchema } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListResponse';

import { episodeRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/episodes',
  request: {
    query: GetEpisodeListRequestQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetEpisodeListResponseSchema,
        },
      },
      description: 'Get episode.',
    },
  },
  tags: ['[App] Episodes API'],
});

app.openapi(route, async (c) => {
  const query = c.req.valid('query');
  const res = await episodeRepository.readAll({ query });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as getEpisodeListApp };
