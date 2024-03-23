import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { GetReleaseRequestParamsSchema } from '@wsh-2024/schema/src/api/releases/GetReleaseRequestParams';
import { GetReleaseResponseSchema } from '@wsh-2024/schema/src/api/releases/GetReleaseResponse';

import { releaseRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/releases/{dayOfWeek}',
  request: {
    params: GetReleaseRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetReleaseResponseSchema,
        },
      },
      description: 'Get release.',
    },
  },
  tags: ['[App] Releases API'],
});

app.openapi(route, async (c) => {
  const params = c.req.valid('param');
  const res = await releaseRepository.read({ params });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as getReleaseApp };
