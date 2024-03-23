import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { GetEpisodeRequestParamsSchema } from '@wsh-2024/schema/src/api/episodes/GetEpisodeRequestParams';
import { GetEpisodeResponseSchema } from '@wsh-2024/schema/src/api/episodes/GetEpisodeResponse';

import { episodeRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/episodes/{episodeId}',
  request: {
    params: GetEpisodeRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetEpisodeResponseSchema,
        },
      },
      description: 'Get episode.',
    },
  },
  tags: ['[App] Episodes API'],
});

app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const res = await episodeRepository.read({ params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as getEpisodeApp };
