import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authorApiClient } from '../apiClient/authorApiClient';

type DeleteAuthorPayload = {
  authorId: string;
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ authorId }: DeleteAuthorPayload) => {
      return await authorApiClient.delete({
        params: { authorId },
      });
    },
    onSettled: (_data, _error, { authorId }) => {
      queryClient.invalidateQueries({
        queryKey: authorApiClient.fetch$$key({ params: { authorId } }),
      });
      queryClient.invalidateQueries({
        queryKey: [authorApiClient.fetchList$$key({ query: {} })[0]],
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: '作者を削除しました',
      });
    },
  });
};
