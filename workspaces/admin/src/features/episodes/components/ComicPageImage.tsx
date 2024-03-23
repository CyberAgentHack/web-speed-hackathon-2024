import { Image as ChakraImage } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { decrypt } from '@wsh-2024/image-encrypt/src/decrypt';

import { getImageUrl } from '../../../lib/image/getImageUrl';

type Props = {
  pageImageId: string;
};

export const ComicPageImage: React.FC<Props> = ({ pageImageId }) => {
  const { data: blob } = useQuery({
    queryFn: async ({ queryKey: [, { pageImageId }] }) => {
      const image = new Image();
      image.src = getImageUrl({
        format: 'jxl',
        imageId: pageImageId,
      });
      await image.decode();

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d')!;

      decrypt({
        exportCanvasContext: ctx,
        sourceImage: image,
        sourceImageInfo: {
          height: image.naturalHeight,
          width: image.naturalWidth,
        },
      });

      return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    },
    queryKey: ['ComicPageImage', { pageImageId }] as const,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const [blobUrl, updateBlobUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (blob == null) return;
    const blobUrl = URL.createObjectURL(blob);
    updateBlobUrl(blobUrl);
    return () => URL.revokeObjectURL(blobUrl);
  }, [blob]);

  return (
    <ChakraImage alt={blobUrl != null ? pageImageId : ''} height={304} objectFit="cover" src={blobUrl} width={216} />
  );
};
