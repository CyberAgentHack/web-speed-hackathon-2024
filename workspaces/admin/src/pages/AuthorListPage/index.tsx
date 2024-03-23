import {
  Button,
  Divider,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  StackItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useId, useMemo, useState } from 'react';
import _ from 'underscore';
import { create } from 'zustand';

import { useAuthorList } from '../../features/authors/hooks/useAuthorList';
import { isContains } from '../../lib/filter/isContains';

import { AuthorDetailModal } from './internal/AuthorDetailModal';
import { CreateAuthorModal } from './internal/CreateAuthorModal';

const AuthorSearchKind = {
  AuthorId: 'AuthorId',
  AuthorName: 'AuthorName',
} as const;
type AuthorSearchKind = (typeof AuthorSearchKind)[keyof typeof AuthorSearchKind];

const AuthorModalMode = {
  Create: 'Create',
  Detail: 'Detail',
  None: 'None',
} as const;
type AuthorModalMode = (typeof AuthorModalMode)[keyof typeof AuthorModalMode];

type AuthorModalState =
  | {
      mode: typeof AuthorModalMode.None;
      params: object;
    }
  | {
      mode: typeof AuthorModalMode.Detail;
      params: { authorId: string };
    }
  | {
      mode: typeof AuthorModalMode.Create;
      params: object;
    };

type AuthorModalAction = {
  close: () => void;
  openCreate: () => void;
  openDetail: (authorId: string) => void;
};

export const AuthorListPage: React.FC = () => {
  const { data: authorList = [] } = useAuthorList();
  const authorListA11yId = useId();

  const formik = useFormik({
    initialValues: {
      kind: AuthorSearchKind.AuthorId as AuthorSearchKind,
      query: '',
    },
    onSubmit() {},
  });

  const filteredAuthorList = useMemo(() => {
    if (formik.values.query === '') {
      return authorList;
    }

    switch (formik.values.kind) {
      case AuthorSearchKind.AuthorId: {
        return authorList.filter((author) => author.id === formik.values.query);
      }
      case AuthorSearchKind.AuthorName: {
        return authorList.filter((author) => {
          return isContains({ query: formik.values.query, target: author.name });
        });
      }
      default: {
        formik.values.kind satisfies never;
        return authorList;
      }
    }
  }, [formik.values.kind, formik.values.query, authorList]);

  const [useModalStore] = useState(() => {
    return create<AuthorModalState & AuthorModalAction>()((set) => ({
      ...{
        mode: AuthorModalMode.None,
        params: {},
      },
      ...{
        close() {
          set({ mode: AuthorModalMode.None, params: {} });
        },
        openCreate() {
          set({ mode: AuthorModalMode.Create, params: {} });
        },
        openDetail(authorId) {
          set({ mode: AuthorModalMode.Detail, params: { authorId } });
        },
      },
    }));
  });
  const modalState = useModalStore();

  return (
    <>
      <Stack height="100%" p={4} spacing={6}>
        <StackItem aria-label="検索セクション" as="section">
          <RadioGroup name="kind" value={formik.values.kind}>
            <Stack direction="row" spacing={4}>
              <Radio
                color="gray.400"
                colorScheme="teal"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={AuthorSearchKind.AuthorId}
              >
                作者 ID
              </Radio>
              <Radio
                color="gray.400"
                colorScheme="teal"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={AuthorSearchKind.AuthorName}
              >
                作者名
              </Radio>
            </Stack>
          </RadioGroup>

          <Spacer height={2} />

          <Flex gap={2}>
            <Input
              borderColor="gray.400"
              name="query"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="条件を入力"
            />
          </Flex>
        </StackItem>

        <Divider />

        <StackItem
          aria-labelledby={authorListA11yId}
          as="section"
          display="flex"
          flexBasis={0}
          flexDirection="column"
          flexGrow={1}
          flexShrink={1}
          overflow="hidden"
        >
          <Flex align="center" justify="space-between">
            <Text as="h2" fontSize="xl" fontWeight="bold" id={authorListA11yId}>
              作者一覧
            </Text>
            <Button colorScheme="teal" onClick={() => modalState.openCreate()} variant="solid">
              作者を追加
            </Button>
          </Flex>
          <TableContainer flexGrow={1} flexShrink={1} overflowY="auto">
            <Table variant="striped">
              <Thead backgroundColor="white" position="sticky" top={0} zIndex={1}>
                <Tr>
                  <Th w={120}></Th>
                  <Th>作者名</Th>
                </Tr>
              </Thead>
              <Tbody>
                {_.map(filteredAuthorList, (author) => (
                  <Tr key={author.id}>
                    <Td textAlign="center" verticalAlign="middle">
                      <Button colorScheme="teal" onClick={() => modalState.openDetail(author.id)} variant="solid">
                        詳細
                      </Button>
                    </Td>
                    <Td verticalAlign="middle">
                      <Text fontWeight="bold">{author.name}</Text>
                      <Text color="gray.400" fontSize="small">
                        {author.id}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </StackItem>
      </Stack>

      {modalState.mode === AuthorModalMode.Detail ? (
        <AuthorDetailModal isOpen authorId={modalState.params.authorId} onClose={() => modalState.close()} />
      ) : null}
      {modalState.mode === AuthorModalMode.Create ? (
        <CreateAuthorModal isOpen onClose={() => modalState.close()} />
      ) : null}
    </>
  );
};
