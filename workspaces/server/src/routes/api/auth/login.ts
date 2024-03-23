import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { setSignedCookie } from 'hono/cookie';

import { LoginRequestBodySchema } from '@wsh-2024/schema/src/api/auth/LoginRequestBody';
import { LoginResponseSchema } from '@wsh-2024/schema/src/api/auth/LoginResponse';

import { COOKIE_SECRET_KEY } from '../../../constants/cookieSecretKey';
import { userRepository } from '../../../repositories';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7日間有効

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/admin/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        },
      },
      description: 'Login.',
    },
  },
  tags: ['[Admin] Auth API'],
});

app.openapi(route, async (c) => {
  const body = c.req.valid('json');

  const result = await userRepository.login({ body });

  if (result.isErr()) {
    throw result.error;
  }

  await setSignedCookie(c, 'userId', result.value.id, COOKIE_SECRET_KEY, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'Lax',
    secure: true,
  });

  return c.json(result.value);
});

export { app as loginApp };
