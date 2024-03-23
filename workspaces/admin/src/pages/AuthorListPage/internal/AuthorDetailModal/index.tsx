import {
  Divider,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useToggle } from '@uidotdev/usehooks';

import { useAuthor } from '../../../../features/authors/hooks/useAuthor';
import { useBookList } from '../../../../features/books/hooks/useBookList';

import { AuthorDetailContent } from './AuthorDetailContent';
import { AuthorEditContent } from './AuthorEditContent';

export type Props = {
  authorId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const AuthorDetailModal: React.FC<Props> = ({ authorId, isOpen, onClose }) => {
  const { data: allBookList } = useBookList();
  const { data: author } = useAuthor({ authorId });
  const [isEdit, toggleIsEdit] = useToggle(false);

  const bookList = allBookList?.filter((book) => book.author.id === authorId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent containerProps={{ p: 8 }} height="100%" m={0} overflowY="auto">
        <ModalCloseButton />
        <Stack height="100%" p={4}>
          {author != null && (
            <>
              {isEdit ? (
                <AuthorEditContent author={author} onEditComplete={() => toggleIsEdit()} />
              ) : (
                <AuthorDetailContent author={author} onCloseDialog={onClose} onEdit={() => toggleIsEdit()} />
              )}
            </>
          )}

          <Divider />

          <Flex flexGrow={1} flexShrink={1} overflow="hidden">
            {bookList != null && (
              <>
                {bookList.length !== 0 ? (
                  <TableContainer flexGrow={1} flexShrink={1} overflowY="auto">
                    <Table aria-label="作品一覧" variant="striped">
                      <Thead backgroundColor="white" position="sticky" top={0} zIndex={1}>
                        <Tr>
                          <Th>作品名</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {bookList.map((book) => (
                          <Tr key={book.id}>
                            <Td verticalAlign="middle">
                              <Text fontWeight="bold">{book.name}</Text>
                              <Text color="gray.400" fontSize="small">
                                {book.id}
                              </Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text align="center" flexGrow={1} flexShrink={1} pt={2}>
                    作品はまだありません
                  </Text>
                )}
              </>
            )}
          </Flex>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
