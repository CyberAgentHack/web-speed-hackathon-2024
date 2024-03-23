import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { episodeApiClient } from '../apiClient/episodeApiClient';
import { episodePageApiClient } from '../apiClient/episodePageApiClient';

type DeleteEpisodePagePayload = {
  episodeId: string;
  episodePageId: string;
};

export const useDeleteEpisodePage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ episodePageId }: DeleteEpisodePagePayload) => {
      return await episodePageApiClient.delete({
        params: {
          episodePageId,
        },
      });
    },
    onSettled: (_data, _error, { episodeId, episodePageId }) => {
      queryClient.invalidateQueries({
        queryKey: episodeApiClient.fetch$$key({ params: { episodeId } }),
      });
      queryClient.invalidateQueries({
        queryKey: episodePageApiClient.fetchList$$key({ query: { episodeId } }),
      });
      queryClient.invalidateQueries({
        queryKey: episodePageApiClient.fetch$$key({ params: { episodePageId } }),
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: 'エピソードページを削除しました',
      });
    },
  });
};
