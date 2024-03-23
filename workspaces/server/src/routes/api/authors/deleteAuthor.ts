import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { DeleteAuthorRequestParamsSchema } from '@wsh-2024/schema/src/api/authors/DeleteAuthorRequestParams';
import { DeleteAuthorResponseSchema } from '@wsh-2024/schema/src/api/authors/DeleteAuthorResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { authorRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'delete',
  path: '/api/v1/authors/{authorId}',
  request: {
    params: DeleteAuthorRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DeleteAuthorResponseSchema,
        },
      },
      description: 'Delete author.',
    },
  },
  tags: ['[Admin] Authors API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const res = await authorRepository.delete({ params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as deleteAuthorApp };
