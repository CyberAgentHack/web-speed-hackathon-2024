import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { bookRepository } from '../../../repositories';
import { GetBookDetailParamsSchema } from '@wsh-2024/schema/src/api/books/GetBookDetailParams';
import { GetBookDetailResponseSchema } from '@wsh-2024/schema/src/api/books/GetBookDetailResponse';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/books/{bookId}/detail',
  request: {
    params: GetBookDetailParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetBookDetailResponseSchema,
        },
      },
      description: 'Get book detail',
    },
  },
  tags: ['[App] Books API'],
});

app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const res = await bookRepository.readDetail({ params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as getBookDetailApp };
