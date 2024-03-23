import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PostEpisodeRequestBodySchema } from '@wsh-2024/schema/src/api/episodes/PostEpisodeRequestBody';
import { PostEpisodeResponseSchema } from '@wsh-2024/schema/src/api/episodes/PostEpisodeResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { episodeRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/episodes',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostEpisodeRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostEpisodeResponseSchema,
        },
      },
      description: 'Create episode.',
    },
  },
  tags: ['[Admin] Episodes API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const body = c.req.valid('json');
  const res = await episodeRepository.create({ body });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as postEpisodeApp };
