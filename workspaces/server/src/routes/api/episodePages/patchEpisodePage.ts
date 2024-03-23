import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PatchEpisodePageRequestBodySchema } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageRequestBody';
import { PatchEpisodePageRequestParamsSchema } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageRequestParams';
import { PatchEpisodePageResponseSchema } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { episodePageRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'patch',
  path: '/api/v1/episodePages/{episodePageId}',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PatchEpisodePageRequestBodySchema,
        },
      },
    },
    params: PatchEpisodePageRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PatchEpisodePageResponseSchema,
        },
      },
      description: 'Update episode page.',
    },
  },
  tags: ['[Admin] Episode Pages API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const body = c.req.valid('json');
  const res = await episodePageRepository.update({ body, params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as patchEpisodePageApp };
