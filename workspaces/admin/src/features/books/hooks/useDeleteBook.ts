import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookApiClient } from '../apiClient/bookApiClient';

type DeleteBookPayload = {
  bookId: string;
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ bookId }: DeleteBookPayload) => {
      return await bookApiClient.delete({ params: { bookId } });
    },
    onSettled: (_data, _error, { bookId }) => {
      queryClient.invalidateQueries({
        queryKey: bookApiClient.fetch$$key({ params: { bookId } }),
      });
      queryClient.invalidateQueries({
        queryKey: [bookApiClient.fetchList$$key({ query: {} })[0]],
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: '作品を削除しました',
      });
    },
  });
};
