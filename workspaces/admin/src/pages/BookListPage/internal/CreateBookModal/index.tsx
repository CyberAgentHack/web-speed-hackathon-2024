import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  Stack,
  StackItem,
  Textarea,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';

import { useAuthorList } from '../../../../features/authors/hooks/useAuthorList';
import { useCreateBook } from '../../../../features/books/hooks/useCreateBook';
import { useReleaseList } from '../../../../features/release/hooks/useReleaseList';
import { isSupportedImage } from '../../../../lib/image/isSupportedImage';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateBookModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { data: authorList = [] } = useAuthorList();
  const { data: releaseList = [] } = useReleaseList();

  const { mutate: createBook } = useCreateBook();

  const formik = useFormik({
    initialValues: {
      authorId: '',
      description: '',
      image: undefined as File | undefined,
      name: '',
      nameRuby: '',
      releaseId: '',
    },
    onSubmit(values) {
      createBook(
        {
          authorId: values.authorId,
          description: values.description,
          image: values.image!,
          name: values.name,
          nameRuby: values.nameRuby,
          releaseId: values.releaseId,
        },
        {
          onSuccess() {
            onClose();
          },
        },
      );
    },
    validationSchema: yup.object().shape({
      authorId: yup.string().uuid('作者を選択してください').required('作者を選択してください'),
      description: yup.string().required('概要を入力してください'),
      image: yup
        .mixed((image): image is File => image instanceof File)
        .optional()
        .test('is-supported-image', '対応していない画像形式です', async (image) => {
          return image == null || (await isSupportedImage(image));
        }),
      name: yup.string().required('作品名を入力してください'),
      nameRuby: yup
        .string()
        .required('作品名のふりがなを入力してください')
        .matches(/^[\p{Script_Extensions=Hiragana}]+$/u, '作品名のふりがなはひらがなで入力してください'),
      releaseId: yup.string().uuid('更新曜日を選択してください').required('更新曜日を選択してください'),
    }),
  });

  const [avatorUrl, updateAvatorUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (formik.values.image == null) return;
    const url = URL.createObjectURL(formik.values.image);
    updateAvatorUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formik.values.image]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent containerProps={{ p: 8 }} height="100%" m={0} overflowY="auto">
        <ModalCloseButton />
        <Box aria-label="作品追加" as="section">
          <Box as="form" onSubmit={formik.handleSubmit} p={4}>
            <Flex align="center" pb={2}>
              <Box flexShrink={0} position="relative">
                <Image aspectRatio="3 / 4" height={256} objectFit="cover" src={avatorUrl} width={192} />

                <FormControl
                  alignItems="center"
                  bg="rgba(0, 0, 0, 0.5)"
                  display="flex"
                  height="100%"
                  justifyContent="center"
                  left="50%"
                  position="absolute"
                  top="50%"
                  transform="translate(-50%, -50%)"
                  width="100%"
                >
                  <Input
                    ref={fileInputRef}
                    hidden
                    onChange={(ev) => {
                      formik.setFieldValue('image', ev.target.files?.[0], true);
                    }}
                    type="file"
                  />
                  <IconButton
                    _focus={{ background: 'none' }}
                    _hover={{ background: 'none' }}
                    aria-label="作品の画像を選択"
                    background="none"
                    height="100%"
                    icon={<AddIcon color="white" />}
                    onClick={() => {
                      formik.setFieldTouched('image', true, false);
                      fileInputRef.current?.click();
                    }}
                    width="100%"
                  />
                </FormControl>
              </Box>
              <Stack p={4} spacing={2} width="100%">
                <StackItem>
                  <Input
                    aria-label="作品名（ふりがな）"
                    bgColor="white"
                    borderColor="gray.300"
                    fontSize="sm"
                    name="nameRuby"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="作品名（ふりがな）"
                    value={formik.values.nameRuby}
                  />
                </StackItem>
                <StackItem>
                  <Input
                    aria-label="作品名"
                    bgColor="white"
                    borderColor="gray.300"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="作品名"
                    value={formik.values.name}
                  />
                </StackItem>
                <StackItem>
                  <FormControl>
                    <FormLabel>作者</FormLabel>
                    <Select
                      borderColor="gray.300"
                      name="authorId"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="作者を選択"
                    >
                      {authorList.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </StackItem>
                <StackItem>
                  <FormControl>
                    <FormLabel>更新曜日</FormLabel>
                    <Select
                      borderColor="gray.300"
                      name="releaseId"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      placeholder="更新曜日を選択"
                    >
                      {releaseList.map((release) => (
                        <option key={release.id} value={release.id}>
                          {release.dayOfWeek.replace(/^./, (char) => char.toUpperCase())}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </StackItem>
                <StackItem>
                  <Textarea
                    aria-label="概要"
                    bgColor="white"
                    borderColor="gray.300"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="概要"
                    value={formik.values.description}
                  />
                </StackItem>
              </Stack>
            </Flex>
            {formik.isValidating ? (
              <Box>
                <Alert mb={4} status="info">
                  <CircularProgress isIndeterminate color="green.600" mr={2} size="1em" />
                  検証中...
                </Alert>
              </Box>
            ) : (
              <Box>
                {(Object.keys(formik.errors) as Array<keyof typeof formik.errors>).map((key) => {
                  return (
                    formik.touched[key] && (
                      <Alert key={key} mb={4} status="error">
                        <AlertIcon />
                        {formik.errors[key]}
                      </Alert>
                    )
                  );
                })}
              </Box>
            )}
            <Flex gap={4} justify="flex-end" pb={4}>
              <Button
                colorScheme="teal"
                isDisabled={formik.isValidating || !formik.isValid}
                type="submit"
                variant="solid"
              >
                作成
              </Button>
            </Flex>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};
