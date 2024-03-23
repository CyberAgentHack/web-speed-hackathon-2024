import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PostAuthorRequestBodySchema } from '@wsh-2024/schema/src/api/authors/PostAuthorRequestBody';
import { PostAuthorResponseSchema } from '@wsh-2024/schema/src/api/authors/PostAuthorResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { authorRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/authors',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostAuthorRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostAuthorResponseSchema,
        },
      },
      description: 'Create author.',
    },
  },
  tags: ['[Admin] Authors API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const body = c.req.valid('json');
  const res = await authorRepository.create({ body });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as postAuthorApp };
