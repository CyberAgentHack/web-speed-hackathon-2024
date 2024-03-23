import * as bcrypt from 'bcryptjs';
import { HTTPException } from 'hono/http-exception';
import { err, ok, type Result } from 'neverthrow';

import type { LoginRequestBody } from '@wsh-2024/schema/src/api/auth/LoginRequestBody';
import type { LoginResponse } from '@wsh-2024/schema/src/api/auth/LoginResponse';
import type { UserResponse } from '@wsh-2024/schema/src/api/auth/UserResponse';

import { getDatabase } from '../database/drizzle';

type UserRepositoryInterface = {
  getUser(options: { internal: { userId: string } }): Promise<Result<UserResponse, HTTPException>>;
  login(options: { body: LoginRequestBody }): Promise<Result<LoginResponse, HTTPException>>;
};

class UserRepository implements UserRepositoryInterface {
  async getUser(options: { internal: { userId: string } }): Promise<Result<UserResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.user.findFirst({
        columns: {
          description: true,
          email: true,
          id: true,
        },
        where(user, { eq }) {
          return eq(user.id, options.internal.userId);
        },
        with: {
          image: {
            columns: {
              alt: true,
              id: true,
            },
          },
        },
      });

      if (data == null) {
        throw new HTTPException(401, { message: `Faild to login user:${options.internal.userId}.` });
      }
      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Faild to login user:${options.internal.userId}.` }));
    }
  }

  async login(options: { body: LoginRequestBody }): Promise<Result<LoginResponse, HTTPException>> {
    try {
      const response = await getDatabase().query.user.findFirst({
        columns: {
          id: true,
          password: true,
        },
        where(user, { eq }) {
          return eq(user.email, options.body.email);
        },
      });

      if (response == null || !(await bcrypt.compare(options.body.password, response.password))) {
        throw new HTTPException(401, { message: `Faild to login user:${options.body.email}.` });
      }

      return this.getUser({ internal: { userId: response.id } });
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Faild to login user:${options.body.email}.` }));
    }
  }
}

export const userRepository = new UserRepository();
