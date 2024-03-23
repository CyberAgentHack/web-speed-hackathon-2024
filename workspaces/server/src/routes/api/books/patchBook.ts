import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PatchBookRequestBodySchema } from '@wsh-2024/schema/src/api/books/PatchBookRequestBody';
import { PatchBookRequestParamsSchema } from '@wsh-2024/schema/src/api/books/PatchBookRequestParams';
import { PatchBookResponseSchema } from '@wsh-2024/schema/src/api/books/PatchBookResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { bookRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'patch',
  path: '/api/v1/books/{bookId}',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PatchBookRequestBodySchema,
        },
      },
    },
    params: PatchBookRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PatchBookResponseSchema,
        },
      },
      description: 'Update book.',
    },
  },
  tags: ['[Admin] Books API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const body = c.req.valid('json');
  const res = await bookRepository.update({ body, params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as patchBookApp };
