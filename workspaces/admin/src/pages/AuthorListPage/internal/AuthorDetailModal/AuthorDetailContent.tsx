import { Avatar, Box, Button, Flex, Stack, StackItem, Text } from '@chakra-ui/react';
import { useCallback } from 'react';

import type { GetAuthorResponse } from '@wsh-2024/schema/src/api/authors/GetAuthorResponse';

import { useDeleteAuthor } from '../../../../features/authors/hooks/useDeleteAuthor';
import { getImageUrl } from '../../../../lib/image/getImageUrl';

type AuthorDetailContentProps = {
  author: GetAuthorResponse;
  onCloseDialog: () => void;
  onEdit: () => void;
};

export const AuthorDetailContent: React.FC<AuthorDetailContentProps> = ({ author, onCloseDialog, onEdit }) => {
  const { mutate: deleteAuthor } = useDeleteAuthor();

  const handleEditClick = useCallback(() => {
    onEdit();
  }, [onEdit]);

  const handleDeleteClick = useCallback(() => {
    deleteAuthor(
      { authorId: author.id },
      {
        onSuccess() {
          onCloseDialog();
        },
      },
    );
  }, [author, deleteAuthor, onCloseDialog]);

  return (
    <Box aria-label="作者詳細" as="section">
      <Flex align="center" pb={2}>
        <Avatar name={author.name} size="xl" src={getImageUrl({ format: 'jpg', imageId: author.image.id })} />
        <Stack p={4} spacing={2}>
          <StackItem>
            <Text fontWeight="bold">{author.name}</Text>
          </StackItem>
          <StackItem>
            <Text>{author.description}</Text>
          </StackItem>
        </Stack>
      </Flex>
      <Flex gap={4} justify="flex-end" pb={4}>
        <Button colorScheme="teal" onClick={handleEditClick} variant="solid">
          編集
        </Button>
        <Button onClick={handleDeleteClick}>削除</Button>
      </Flex>
    </Box>
  );
};
