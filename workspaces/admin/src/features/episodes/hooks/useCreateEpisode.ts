import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { imageApiClient } from '../../images/apiClient/imageApiClient';
import { episodeApiClient } from '../apiClient/episodeApiClient';

type CreateEpisodePayload = {
  bookId: string;
  chapter: number;
  description: string;
  image: File;
  name: string;
  nameRuby: string;
};

export const useCreateEpisode = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ bookId, chapter, description, image, name, nameRuby }: CreateEpisodePayload) => {
      const { id: imageId } = await imageApiClient.post({
        body: {
          alt: image.name,
          content: image,
        },
      });

      return await episodeApiClient.post({
        body: {
          bookId,
          chapter,
          description,
          imageId,
          name,
          nameRuby,
        },
      });
    },
    onSettled: (_data, _error, { bookId }) => {
      queryClient.invalidateQueries({
        queryKey: episodeApiClient.fetchList$$key({ query: { bookId } }),
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: 'エピソードを作成しました',
      });
    },
  });
};
