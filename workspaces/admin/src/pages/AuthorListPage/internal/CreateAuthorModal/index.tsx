import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  StackItem,
  Textarea,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';

import { useCreateAuthor } from '../../../../features/authors/hooks/useCreateAuthor';
import { isSupportedImage } from '../../../../lib/image/isSupportedImage';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateAuthorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: createAuthor } = useCreateAuthor();

  const formik = useFormik({
    initialValues: {
      description: '',
      image: undefined as File | undefined,
      name: '',
    },
    onSubmit(values) {
      createAuthor(
        {
          description: values.description,
          image: values.image!,
          name: values.name,
        },
        {
          onSuccess() {
            onClose();
          },
        },
      );
    },
    validationSchema: yup.object().shape({
      description: yup.string().required('プロフィールを入力してください'),
      image: yup
        .mixed((image): image is File => image instanceof File)
        .required('画像を選択してください')
        .test('is-supported-image', '対応していない画像形式です', async (image) => {
          return image == null || (await isSupportedImage(image));
        }),
      name: yup
        .string()
        .required('作者名を入力してください')
        .matches(/^[\p{Script_Extensions=Katakana}\s]+$/u, '作者名はカタカナで入力してください'),
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
        <Box aria-label="作者追加" as="section">
          <Box as="form" onSubmit={formik.handleSubmit} p={4}>
            <Flex align="center" pb={2}>
              <Box position="relative">
                <Avatar size="xl" src={avatorUrl} />

                <FormControl
                  alignItems="center"
                  bg="rgba(0, 0, 0, 0.5)"
                  borderRadius="50%"
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
                    name="image"
                    onChange={(ev) => {
                      void formik.setFieldValue('image', ev.target.files?.[0], true);
                    }}
                    type="file"
                  />
                  <IconButton
                    _focus={{ background: 'none' }}
                    _hover={{ background: 'none' }}
                    aria-label="作者の画像を選択"
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
                    aria-label="作者名"
                    bgColor="white"
                    borderColor="gray.300"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="作者名"
                    value={formik.values.name}
                  />
                </StackItem>
                <StackItem>
                  <Textarea
                    aria-label="プロフィール"
                    bgColor="white"
                    borderColor="gray.300"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    placeholder="プロフィール"
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
            <Flex gap={4} justify="flex-end">
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
