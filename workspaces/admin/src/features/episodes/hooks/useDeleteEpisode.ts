import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { episodeApiClient } from '../apiClient/episodeApiClient';

type DeleteEpisodePayload = {
  bookId: string;
  episodeId: string;
};

export const useDeleteEpisode = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ episodeId }: DeleteEpisodePayload) => {
      return await episodeApiClient.delete({
        params: {
          episodeId,
        },
      });
    },
    onSettled: (_data, _error, { bookId, episodeId }) => {
      queryClient.invalidateQueries({
        queryKey: episodeApiClient.fetchList$$key({ query: { bookId } }),
      });
      queryClient.invalidateQueries({
        queryKey: episodeApiClient.fetch$$key({ params: { episodeId } }),
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: 'エピソードを削除しました',
      });
    },
  });
};
