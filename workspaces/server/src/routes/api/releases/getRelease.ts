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

import NodeCache from "node-cache";
const releaseCache = new NodeCache({ stdTTL: 60 });

app.openapi(route, async (c) => {
  const params = c.req.valid('param')
  if (releaseCache.has(params.dayOfWeek)) {
    const data = releaseCache.get(params.dayOfWeek)
    return c.json(data)
  }
  const res = await releaseRepository.read({ params })
  if (res.isErr()) {
    throw res.error;
  }
  releaseCache.set(params.dayOfWeek, res.value)
  return c.json(res.value);
});

export { app as getReleaseApp };
