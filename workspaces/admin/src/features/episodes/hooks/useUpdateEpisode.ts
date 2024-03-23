import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { imageApiClient } from '../../images/apiClient/imageApiClient';
import { episodeApiClient } from '../apiClient/episodeApiClient';

type UpdateEpisodePayload = {
  bookId: string;
  chapter?: number;
  description?: string;
  episodeId: string;
  image?: File;
  name?: string;
  nameRuby?: string;
};

export const useUpdateEpisode = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ bookId, chapter, description, episodeId, image, name, nameRuby }: UpdateEpisodePayload) => {
      const imageId = await (async () => {
        if (image == null) {
          return undefined;
        }
        const { id: imageId } = await imageApiClient.post({
          body: {
            alt: image.name,
            content: image,
          },
        });
        return imageId;
      })();

      return await episodeApiClient.update({
        body: {
          bookId,
          chapter,
          description,
          imageId,
          name,
          nameRuby,
        },
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
        title: 'エピソード情報を更新しました',
      });
    },
  });
};
