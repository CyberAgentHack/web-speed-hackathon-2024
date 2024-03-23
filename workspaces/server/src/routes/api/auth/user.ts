import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { getSignedCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';

import { UserResponseSchama } from '@wsh-2024/schema/src/api/auth/UserResponse';

import { COOKIE_SECRET_KEY } from '../../../constants/cookieSecretKey';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { userRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/api/v1/admin/me',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserResponseSchama,
        },
      },
      description: 'Get auth user.',
    },
  },
  tags: ['[Admin] Auth API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const userId = await getSignedCookie(c, COOKIE_SECRET_KEY, 'userId');

  if (typeof userId !== 'string') {
    throw new HTTPException(401, { message: 'Unauthorized.' });
  }

  const result = await userRepository.getUser({ internal: { userId } });

  if (result.isErr()) {
    throw result.error;
  }
  return c.json(result.value);
});

export { app as userApp };
