import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { DeleteEpisodeRequestParamsSchema } from '@wsh-2024/schema/src/api/episodes/DeleteEpisodeRequestParams';
import { DeleteEpisodeResponseSchema } from '@wsh-2024/schema/src/api/episodes/DeleteEpisodeResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { episodeRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'delete',
  path: '/api/v1/episodes/{episodeId}',
  request: {
    params: DeleteEpisodeRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DeleteEpisodeResponseSchema,
        },
      },
      description: 'Get episode list.',
    },
  },
  tags: ['[Admin] Episodes API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const res = await episodeRepository.delete({ params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as deleteEpisodeApp };
