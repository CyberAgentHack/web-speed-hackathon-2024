import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { PatchAuthorRequestBodySchema } from '@wsh-2024/schema/src/api/authors/PatchAuthorRequestBody';
import { PatchAuthorRequestParamsSchema } from '@wsh-2024/schema/src/api/authors/PatchAuthorRequestParams';
import { PatchAuthorResponseSchema } from '@wsh-2024/schema/src/api/authors/PatchAuthorResponse';

import { authMiddleware } from '../../../middlewares/authMiddleware';
import { authorRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'patch',
  path: '/api/v1/authors/{authorId}',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PatchAuthorRequestBodySchema,
        },
      },
    },
    params: PatchAuthorRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PatchAuthorResponseSchema,
        },
      },
      description: 'Update author.',
    },
  },
  tags: ['[Admin] Authors API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const body = c.req.valid('json');
  const res = await authorRepository.update({ body, params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as patchAuthorApp };
