import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PatchEpisodeRequestBodySchema } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeRequestBody';
import { PatchEpisodeRequestParamsSchema } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeRequestParams';
import { PatchEpisodeResponseSchema } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { episodeRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'patch',
  path: '/api/v1/episodes/{episodeId}',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PatchEpisodeRequestBodySchema,
        },
      },
    },
    params: PatchEpisodeRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PatchEpisodeResponseSchema,
        },
      },
      description: 'Update episode.',
    },
  },
  tags: ['[Admin] Episodes API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const body = c.req.valid('json');
  const res = await episodeRepository.update({ body, params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as patchEpisodeApp };
