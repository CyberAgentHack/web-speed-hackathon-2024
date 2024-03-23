import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApiClient } from '../apiClient/authApiClient';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn() {
      return authApiClient.logout();
    },
    onError: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'error',
        title: 'ログアウトに失敗しました',
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
        title: 'ログアウトしました',
      });
    },
  });
};
