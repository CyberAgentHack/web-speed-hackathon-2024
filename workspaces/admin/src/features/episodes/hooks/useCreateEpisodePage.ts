import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { imageApiClient } from '../../images/apiClient/imageApiClient';
import { episodeApiClient } from '../apiClient/episodeApiClient';
import { episodePageApiClient } from '../apiClient/episodePageApiClient';

type CreateEpisodePagePayload = {
  episodeId: string;
  image: File;
  page: number;
};

export const useCreateEpisodePage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ episodeId, image, page }: CreateEpisodePagePayload) => {
      const { id: imageId } = await imageApiClient.post({
        body: {
          alt: image.name,
          content: image,
        },
      });

      return await episodePageApiClient.post({
        body: {
          episodeId,
          imageId,
          page,
        },
      });
    },
    onSettled: (_data, _error, { episodeId }) => {
      queryClient.invalidateQueries({
        queryKey: episodeApiClient.fetch$$key({ params: { episodeId } }),
      });
      queryClient.invalidateQueries({
        queryKey: episodePageApiClient.fetchList$$key({ query: { episodeId } }),
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: 'エピソードページを作成しました',
      });
    },
  });
};
