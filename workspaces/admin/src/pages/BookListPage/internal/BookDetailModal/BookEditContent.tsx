import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  Stack,
  StackItem,
  Textarea,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';

import type { GetBookResponse } from '@wsh-2024/schema/src/api/books/GetBookResponse';

import { useUpdateBook } from '../../../../features/books/hooks/useUpdateBook';
import { isSupportedImage } from '../../../../lib/image/isSupportedImage';

type BookEditContentProps = {
  book: GetBookResponse;
  onEditComplete: () => void;
};

export const BookEditContent: React.FC<BookEditContentProps> = ({ book, onEditComplete }) => {
  const { mutate: updateBook } = useUpdateBook();

  const formik = useFormik({
    initialValues: {
      description: book.description,
      id: book.id,
      image: undefined as File | undefined,
      name: book.name,
      nameRuby: book.nameRuby,
    },
    onSubmit(values) {
      updateBook(
        {
          bookId: values.id,
          description: values.description,
          image: values.image,
          name: values.name,
          nameRuby: values.nameRuby,
        },
        {
          onSuccess() {
            onEditComplete();
          },
        },
      );
    },
    validationSchema: yup.object().shape({
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
    <Box aria-label="作品編集" as="section">
      <Box as="form" onSubmit={formik.handleSubmit}>
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
          <Button colorScheme="teal" isDisabled={formik.isValidating || !formik.isValid} type="submit" variant="solid">
            決定
          </Button>
          <Button onClick={() => onEditComplete()}>キャンセル</Button>
        </Flex>
      </Box>
    </Box>
  );
};
