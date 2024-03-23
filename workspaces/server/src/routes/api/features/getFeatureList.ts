import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { GetFeatureListRequestQuerySchema } from '@wsh-2024/schema/src/api/features/GetFeatureListRequestQuery';
import { GetFeatureListResponseSchema } from '@wsh-2024/schema/src/api/features/GetFeatureListResponse';

import { featureRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/features',
  request: {
    query: GetFeatureListRequestQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetFeatureListResponseSchema,
        },
      },
      description: 'Get feature list.',
    },
  },
  tags: ['[App] Features API'],
});

app.openapi(route, async (c) => {
  const query = c.req.valid('query');
  const res = await featureRepository.readAll({ query });

  if (res.isErr()) {
    throw res.error;
  }
  return c.json(res.value);
});

export { app as getFeatureListApp };
