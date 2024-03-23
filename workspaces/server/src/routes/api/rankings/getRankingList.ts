import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { GetRankingListRequestQuerySchema } from '@wsh-2024/schema/src/api/rankings/GetRankingListRequestQuery';
import { GetRankingListResponseSchema } from '@wsh-2024/schema/src/api/rankings/GetRankingListResponse';

import { rankingRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/rankings',
  request: {
    query: GetRankingListRequestQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetRankingListResponseSchema,
        },
      },
      description: 'Get feature list.',
    },
  },
  tags: ['[App] Rankings API'],
});

import NodeCache from "node-cache";
const rankingCache = new NodeCache({ stdTTL: 60 });

app.openapi(route, async (c) => {
  const query = c.req.valid('query');
  const key = `${query.limit}-${query.offset}`
  if (rankingCache.has(key)) {
    const data = rankingCache.get(key)
    return c.json(data);
  }
  const res = await rankingRepository.readAll({ query });

  if (res.isErr()) {
    throw res.error;
  }
  rankingCache.set(key, res.value)
  return c.json(res.value);
});

export { app as getRankingListApp };
