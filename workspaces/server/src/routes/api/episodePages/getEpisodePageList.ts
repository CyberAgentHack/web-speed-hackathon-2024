import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { GetEpisodePageListRequestQuerySchema } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageListRequestQuery';
import { GetEpisodePageListResponseSchema } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageListResponse';

import { episodePageRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/episodePages',
  request: {
    query: GetEpisodePageListRequestQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetEpisodePageListResponseSchema,
        },
      },
      description: 'Get episode page list.',
    },
  },
  tags: ['[App] Episode Pages API'],
});

app.openapi(route, async (c) => {
  const query = c.req.valid('query');
  const res = await episodePageRepository.readAll({ query });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as getEpisodePageListApp };
