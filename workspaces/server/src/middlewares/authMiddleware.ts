import { getSignedCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import { COOKIE_SECRET_KEY } from '../constants/cookieSecretKey';

export const authMiddleware = createMiddleware(async (c, next) => {
  const userId = await getSignedCookie(c, COOKIE_SECRET_KEY, 'userId');

  if (typeof userId !== 'string') {
    throw new HTTPException(401, { message: 'authMiddeware: Unauthorized.' });
  }
  await next();
});
