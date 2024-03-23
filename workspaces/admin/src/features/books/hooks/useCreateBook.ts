import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { imageApiClient } from '../../images/apiClient/imageApiClient';
import { bookApiClient } from '../apiClient/bookApiClient';

type CreateBookPayload = {
  authorId: string;
  description: string;
  image: File;
  name: string;
  nameRuby: string;
  releaseId: string;
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ authorId, description, image, name, nameRuby, releaseId }: CreateBookPayload) => {
      const { id: imageId } = await imageApiClient.post({
        body: {
          alt: image.name,
          content: image,
        },
      });

      return bookApiClient.post({
        body: {
          authorId,
          description,
          imageId,
          name,
          nameRuby,
          releaseId,
        },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [bookApiClient.fetchList$$key({ query: {} })[0]],
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: '作品を作成しました',
      });
    },
  });
};
