import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image as ChakraImage,
  Input,
  Stack,
  StackItem,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';

import { encrypt } from '@wsh-2024/image-encrypt/src/encrypt';
import type { GetBookResponse } from '@wsh-2024/schema/src/api/books/GetBookResponse';
import type { GetEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeResponse';

import { getImageUrl } from '../../../lib/image/getImageUrl';
import { isSupportedImage } from '../../../lib/image/isSupportedImage';
import { useCreateEpisode } from '../hooks/useCreateEpisode';
import { useCreateEpisodePage } from '../hooks/useCreateEpisodePage';
import { useDeleteEpisode } from '../hooks/useDeleteEpisode';
import { useDeleteEpisodePage } from '../hooks/useDeleteEpisodePage';
import { useUpdateEpisode } from '../hooks/useUpdateEpisode';

import { ComicPageImage } from './ComicPageImage';

type Props = {
  book: GetBookResponse;
  episode?: GetEpisodeResponse;
};

export const EpisodeDetailEditor: React.FC<Props> = ({ book, episode }) => {
  const navigate = useNavigate();

  const { mutate: createEpisode } = useCreateEpisode();
  const { mutate: updateEpisode } = useUpdateEpisode();
  const { mutate: deleteEpisode } = useDeleteEpisode();
  const { mutate: createEpisodePage } = useCreateEpisodePage();
  const { mutate: deleteEpisodePage } = useDeleteEpisodePage();

  const formik = useFormik({
    initialValues: {
      chapter: episode?.chapter,
      description: episode?.description,
      image: undefined as File | undefined,
      name: episode?.name,
      nameRuby: episode?.nameRuby,
    },
    onSubmit(values) {
      if (episode == null) {
        return createEpisode(
          {
            bookId: book.id,
            chapter: values.chapter!,
            description: values.description!,
            image: values.image!,
            name: values.name!,
            nameRuby: values.nameRuby!,
          },
          {
            onSuccess(episode) {
              navigate({
                params: { bookId: book.id, episodeId: episode.id },
                to: '/admin/books/$bookId/episodes/$episodeId',
              });
            },
          },
        );
      } else {
        return updateEpisode({
          bookId: book.id,
          chapter: values.chapter,
          description: values.description,
          episodeId: episode.id,
          image: values.image,
          name: values.name,
          nameRuby: values.nameRuby,
        });
      }
    },
    validationSchema: yup.object().shape({
      chapter: yup.number().required('章を入力してください'),
      description: yup.string().required('あらすじを入力してください'),
      image: yup
        .mixed((image): image is File => image instanceof File)
        .optional()
        .test('is-supported-image', '対応していない画像形式です', async (image) => {
          return image == null || (await isSupportedImage(image));
        }),
      name: yup.string().required('エピソード名を入力してください'),
      nameRuby: yup
        .string()
        .required('エピソード名（ふりがな）を入力してください')
        .matches(/^[\p{Script_Extensions=Hiragana}]+$/u, 'ふりがなはひらがなで入力してください'),
    }),
  });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailUrl, updateThumbnailUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (formik.values.image == null) return;
    const url = URL.createObjectURL(formik.values.image);
    updateThumbnailUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formik.values.image]);

  const handleRequestToDeleteEpisode = () => {
    if (episode == null) return;
    deleteEpisode(
      {
        bookId: book.id,
        episodeId: episode.id,
      },
      {
        onSuccess() {
          navigate({
            to: '/admin/books',
          });
        },
      },
    );
  };

  const createPageInputRef = useRef<HTMLInputElement>(null);
  const handleRequestToUploadFile = async (file: File | undefined) => {
    if (file == null || episode == null) return;

    const blobUrl = URL.createObjectURL(file);

    try {
      const image = new Image();
      image.src = blobUrl;
      await image.decode();

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d')!;

      encrypt({
        exportCanvasContext: ctx,
        sourceImage: image,
        sourceImageInfo: {
          height: image.naturalHeight,
          width: image.naturalWidth,
        },
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob == null) return;

      createEpisodePage({
        episodeId: episode.id,
        image: new File([blob], 'encrypted.png', { type: 'image/png' }),
        page: (episode.pages.at(-1)?.page ?? 0) + 1,
      });
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  };

  const handleRequestToDeletePage = (episodePageId: string) => {
    if (episode == null) return;
    deleteEpisodePage({
      episodeId: episode.id,
      episodePageId,
    });
  };

  return (
    <Stack as="section" pb={16} spacing={6}>
      <StackItem>
        <Heading as="h1" fontWeight="bold" size="lg">
          {episode == null ? 'エピソード作成' : 'エピソード編集'}
        </Heading>
      </StackItem>

      <StackItem>
        <HStack
          aria-label="ページ一覧"
          as="ul"
          bg={episode == null ? 'gray.300' : undefined}
          cursor={episode == null ? 'not-allowed' : undefined}
          gap={6}
          overflowX="scroll"
          px={4}
          py={8}
        >
          {episode != null &&
            episode.pages.map((page) => (
              <StackItem key={page.id} as="li" flexGrow={0} flexShrink={0} position="relative">
                <CloseButton
                  aria-label="ページを削除"
                  bg="white"
                  boxShadow="md"
                  onClick={() => handleRequestToDeletePage(page.id)}
                  position="absolute"
                  right={-4}
                  rounded="full"
                  top={-4}
                />
                <Box as="button" display="block">
                  <ComicPageImage pageImageId={page.image.id} />
                </Box>
              </StackItem>
            ))}

          <Flex align="center" as="li" height={264} justify="center">
            <FormControl>
              <Input
                ref={createPageInputRef}
                hidden
                onChange={(ev) => {
                  handleRequestToUploadFile(ev.target.files?.[0]);
                }}
                type="file"
              />
              <IconButton
                aria-label="ページを追加"
                icon={<AddIcon />}
                isDisabled={episode == null}
                onClick={() => {
                  createPageInputRef.current?.click();
                }}
              />
            </FormControl>
          </Flex>
        </HStack>
      </StackItem>

      <StackItem aria-label="エピソード情報" as="form" onSubmit={formik.handleSubmit}>
        <Flex direction="row" gap={4} justify="space-between">
          <Flex align="center" flexGrow={0} flexShrink={0} justify="center" p={16}>
            <FormControl isInvalid={!formik.isValidating && formik.touched.image && formik.errors.image != null}>
              <FormLabel fontSize="lg" fontWeight="bold">
                サムネイル
              </FormLabel>
              <Input
                ref={thumbnailInputRef}
                hidden
                name="image"
                onChange={(ev) => {
                  formik.setFieldValue('image', ev.target.files?.[0], true);
                }}
                type="file"
              />
              <Box
                data-group
                aria-label="サムネイルの画像を選択"
                as="button"
                borderRadius={16}
                height={200}
                onClick={() => {
                  formik.setFieldTouched('image', true, false);
                  thumbnailInputRef.current?.click();
                }}
                overflow="hidden"
                position="relative"
                shadow="md"
                type="button"
                width={200}
              >
                <ChakraImage
                  _groupFocusVisible={{ opacity: 0.75 }}
                  _groupHover={{ opacity: 0.75 }}
                  alt={episode?.image.id}
                  height={200}
                  src={
                    thumbnailUrl ??
                    (episode != null
                      ? getImageUrl({ format: 'jpg', height: 200, imageId: episode.image.id, width: 200 })
                      : undefined)
                  }
                  width={200}
                />
                <Center
                  _groupFocusVisible={{ visibility: 'visible' }}
                  _groupHover={{ visibility: 'visible' }}
                  bg="blackAlpha.600"
                  inset={0}
                  position="absolute"
                  visibility="hidden"
                >
                  <AddIcon color="white" height={16} width={16} />
                </Center>
              </Box>
              <FormErrorMessage fontWeight="bold" role="alert">
                {formik.errors.image}
              </FormErrorMessage>
            </FormControl>
          </Flex>

          <Stack flexGrow={1} flexShrink={1} spacing={4}>
            <FormControl isInvalid={!formik.isValidating && formik.touched.name && formik.errors.name != null}>
              <FormLabel fontWeight="bold">エピソード名</FormLabel>
              <Input
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.name}
              />
              <FormErrorMessage fontWeight="bold" role="alert">
                {formik.errors.name}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!formik.isValidating && formik.touched.nameRuby && formik.errors.nameRuby != null}>
              <FormLabel fontWeight="bold">エピソード名（ふりがな）</FormLabel>
              <Input
                name="nameRuby"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameRuby}
              />
              <FormErrorMessage fontWeight="bold" role="alert">
                {formik.errors.nameRuby}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!formik.isValidating && formik.touched.description && formik.errors.description != null}
            >
              <FormLabel fontWeight="bold">あらすじ</FormLabel>
              <Textarea
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              <FormErrorMessage fontWeight="bold" role="alert">
                {formik.errors.description}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!formik.isValidating && formik.touched.chapter && formik.errors.chapter != null}>
              <FormLabel fontWeight="bold">エピソードの章</FormLabel>
              <Input
                name="chapter"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.chapter}
              />
              <FormErrorMessage fontWeight="bold" role="alert">
                {formik.errors.chapter}
              </FormErrorMessage>
            </FormControl>
            <Box>
              <Text fontWeight="bold">エピソードが含まれる作品 ID</Text>
              <Text color="gray.600">{book.id}</Text>
            </Box>
            <Box display="flex" gap={4} justifyContent="flex-end">
              <Button
                colorScheme="teal"
                isDisabled={formik.isValidating || !formik.isValid || formik.isSubmitting}
                type="submit"
                variant="solid"
              >
                {episode == null ? '作成' : '更新'}
              </Button>
              {episode != null && (
                <Button onClick={handleRequestToDeleteEpisode} type="button">
                  削除
                </Button>
              )}
            </Box>
          </Stack>
        </Flex>
      </StackItem>
    </Stack>
  );
};
