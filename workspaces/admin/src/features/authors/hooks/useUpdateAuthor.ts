import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { imageApiClient } from '../../images/apiClient/imageApiClient';
import { authorApiClient } from '../apiClient/authorApiClient';

type UpdateAuthorPayload = {
  authorId: string;
  description?: string | undefined;
  image?: File | undefined;
  name?: string | undefined;
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ authorId, description, image, name }: UpdateAuthorPayload) => {
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

      return authorApiClient.update({
        body: {
          description,
          imageId,
          name,
        },
        params: {
          authorId,
        },
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
        title: '作者情報を更新しました',
      });
    },
  });
};
