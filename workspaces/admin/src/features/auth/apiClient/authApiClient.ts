import { inject } from 'regexparam';

import type { LoginRequestBody } from '@wsh-2024/schema/src/api/auth/LoginRequestBody';
import type { LoginResponse } from '@wsh-2024/schema/src/api/auth/LoginResponse';
import type { LogoutResponse } from '@wsh-2024/schema/src/api/auth/LogoutResponse';
import type { UserResponse } from '@wsh-2024/schema/src/api/auth/UserResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type AuthApiClient = DomainSpecificApiClientInterface<{
  fetchAuthUser: [void, UserResponse];
  login: [{ body: LoginRequestBody }, LoginResponse];
  logout: [void, LogoutResponse];
}>;

export const authApiClient: AuthApiClient = {
  fetchAuthUser: async () => {
    const response = await apiClient.get(inject('api/v1/admin/me', {})).json<UserResponse>();
    return response;
  },
  fetchAuthUser$$key: () => [
    {
      method: 'get',
      requestUrl: `/api/v1/admin/logout`,
    },
  ],
  login: async ({ body }) => {
    const response = await apiClient
      .post(inject('api/v1/admin/login', {}), {
        json: body,
      })
      .json<LoginResponse>();
    return response;
  },
  login$$key: (options) => [
    {
      method: 'post',
      requestUrl: `/api/v1/admin/login`,
    },
    options,
  ],
  logout: async () => {
    const response = await apiClient.post(inject('api/v1/admin/logout', {})).json<LogoutResponse>();
    return response;
  },
  logout$$key: () => [
    {
      method: 'post',
      requestUrl: `/api/v1/admin/logout`,
    },
  ],
};
