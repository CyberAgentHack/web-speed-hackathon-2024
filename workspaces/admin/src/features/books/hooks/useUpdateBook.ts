import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { imageApiClient } from '../../images/apiClient/imageApiClient';
import { bookApiClient } from '../apiClient/bookApiClient';

type UpdateBookPayload = {
  bookId: string;
  description?: string;
  image?: File;
  name?: string;
  nameRuby?: string;
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ bookId, description, image, name, nameRuby }: UpdateBookPayload) => {
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

      return await bookApiClient.update({
        body: {
          description,
          imageId,
          name,
          nameRuby,
        },
        params: {
          bookId,
        },
      });
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
        title: '作品情報を更新しました',
      });
    },
  });
};
