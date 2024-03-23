import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { GetAuthorListRequestQuerySchema } from '@wsh-2024/schema/src/api/authors/GetAuthorListRequestQuery';
import { GetAuthorListResponseSchema } from '@wsh-2024/schema/src/api/authors/GetAuthorListResponse';

import { authorRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/authors',
  request: {
    query: GetAuthorListRequestQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetAuthorListResponseSchema,
        },
      },
      description: 'Get author list.',
    },
  },
  tags: ['[App] Authors API'],
});

app.openapi(route, async (c) => {
  const query = c.req.valid('query');
  const res = await authorRepository.readAll({ query });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as getAuthorListApp };
