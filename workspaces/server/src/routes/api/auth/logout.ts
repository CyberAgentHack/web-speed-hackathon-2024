import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { deleteCookie } from 'hono/cookie';

import { LogoutResponseSchema } from '@wsh-2024/schema/src/api/auth/LogoutResponse';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/admin/logout',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LogoutResponseSchema,
        },
      },
      description: 'Logout.',
    },
  },
  tags: ['[Admin] Auth API'],
});

app.openapi(route, async (c) => {
  deleteCookie(c, 'userId');
  return c.json({});
});

export { app as logoutApp };
