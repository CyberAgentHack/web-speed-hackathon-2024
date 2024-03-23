import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { imageApiClient } from '../../images/apiClient/imageApiClient';
import { authorApiClient } from '../apiClient/authorApiClient';

type CreateAuthorPayload = {
  description: string;
  image: File;
  name: string;
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ description, image, name }: CreateAuthorPayload) => {
      const { id: imageId } = await imageApiClient.post({
        body: {
          alt: image.name,
          content: image,
        },
      });

      return authorApiClient.post({
        body: {
          description,
          imageId,
          name,
        },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [authorApiClient.fetchList$$key({ query: {} })[0]],
      });
    },
    onSuccess: () => {
      toast({
        duration: 1000,
        isClosable: true,
        status: 'success',
        title: '作者を作成しました',
      });
    },
  });
};
