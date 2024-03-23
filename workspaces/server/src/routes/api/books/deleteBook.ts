import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { DeleteBookRequestParamsSchema } from '@wsh-2024/schema/src/api/books/DeleteBookRequestParams';
import { DeleteBookResponseSchema } from '@wsh-2024/schema/src/api/books/DeleteBookResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { bookRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'delete',
  path: '/api/v1/books/{bookId}',
  request: {
    params: DeleteBookRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DeleteBookResponseSchema,
        },
      },
      description: 'Delete book.',
    },
  },
  tags: ['[Admin] Books API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const res = await bookRepository.delete({ params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as deleteBookApp };
