import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApiClient } from '../apiClient/authApiClient';

type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn({ email, password }: LoginPayload) {
      return authApiClient.login({
        body: { email, password },
      });
    },
    onError: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'error',
        title: 'ログインに失敗しました',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: authApiClient.fetchAuthUser$$key(),
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: 'ログインしました',
      });
    },
  });
};
