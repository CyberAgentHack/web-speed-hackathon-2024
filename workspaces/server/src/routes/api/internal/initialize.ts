import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';

import { seeding } from '../../../database/seed';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/initialize',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({}),
        },
      },
      description: 'Initialize.',
    },
  },
  tags: ['[Internal] Internal API'],
});

app.openapi(route, async (c) => {
  try {
    await seeding();
    return c.json({});
  } catch (cause) {
    throw new HTTPException(500, { cause, message: 'Failed to initialize DB' });
  }
});

export { app as initializeApp };
