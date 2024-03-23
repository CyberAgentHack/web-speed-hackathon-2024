import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PostEpisodePageRequestBodySchema } from '@wsh-2024/schema/src/api/episodePages/PostEpisodePageRequestBody';
import { PostEpisodePageResponseSchema } from '@wsh-2024/schema/src/api/episodePages/PostEpisodePageResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { episodePageRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/episodePages',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostEpisodePageRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostEpisodePageResponseSchema,
        },
      },
      description: 'Create episode page.',
    },
  },
  tags: ['[Admin] Episode Pages API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const body = c.req.valid('json');
  const res = await episodePageRepository.create({ body });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as postEpisodePageApp };
