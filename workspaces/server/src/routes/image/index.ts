import { createReadStream } from 'node:fs';
import type { ReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Image } from 'image-js';
import { z } from 'zod';

import { IMAGES_PATH } from '../../constants/paths';
import type { ConverterInterface } from '../../image-converters/ConverterInterface';
import { avifConverter } from '../../image-converters/avifConverter';
import { jpegConverter } from '../../image-converters/jpegConverter';
import { jpegXlConverter } from '../../image-converters/jpegXlConverter';
import { pngConverter } from '../../image-converters/pngConverter';
import { webpConverter } from '../../image-converters/webpConverter';

const createStreamBody = (stream: ReadStream) => {
  const body = new ReadableStream({
    cancel() {
      stream.destroy();
    },
    start(controller) {
      stream.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      stream.on('end', () => {
        controller.close();
      });
    },
  });

  return body;
};

const SUPPORTED_IMAGE_EXTENSIONS = ['jxl', 'avif', 'webp', 'png', 'jpeg', 'jpg'] as const;

type SupportedImageExtension = (typeof SUPPORTED_IMAGE_EXTENSIONS)[number];

function isSupportedImageFormat(ext: unknown): ext is SupportedImageExtension {
  return (SUPPORTED_IMAGE_EXTENSIONS as readonly unknown[]).includes(ext);
}

const IMAGE_MIME_TYPE: Record<SupportedImageExtension, string> = {
  ['avif']: 'image/avif',
  ['jpeg']: 'image/jpeg',
  ['jpg']: 'image/jpeg',
  ['jxl']: 'image/jxl',
  ['png']: 'image/png',
  ['webp']: 'image/webp',
};

const IMAGE_CONVERTER: Record<SupportedImageExtension, ConverterInterface> = {
  ['avif']: avifConverter,
  ['jpeg']: jpegConverter,
  ['jpg']: jpegConverter,
  ['jxl']: jpegXlConverter,
  ['png']: pngConverter,
  ['webp']: webpConverter,
};

const app = new Hono();

app.get(
  '/images/:imageFile',
  zValidator(
    'param',
    z.object({
      imageFile: z.string().regex(/^[a-f0-9-]+(?:\.\w*)?$/),
    }),
  ),
  zValidator(
    'query',
    z.object({
      format: z.string().optional(),
      height: z.coerce.number().optional(),
      width: z.coerce.number().optional(),
    }),
  ),
  async (c) => {
    const { globby } = await import('globby');

    const { ext: reqImgExt, name: reqImgId } = path.parse(c.req.valid('param').imageFile);

    const resImgFormat = c.req.valid('query').format ?? reqImgExt.slice(1);

    if (!isSupportedImageFormat(resImgFormat)) {
      throw new HTTPException(501, { message: `Image format: ${resImgFormat} is not supported.` });
    }

    const origFileGlob = [path.resolve(IMAGES_PATH, `${reqImgId}`), path.resolve(IMAGES_PATH, `${reqImgId}.*`)];
    const [origFilePath] = await globby(origFileGlob, { absolute: true, onlyFiles: true });
    if (origFilePath == null) {
      throw new HTTPException(404, { message: 'Not found.' });
    }

    const origImgFormat = path.extname(origFilePath).slice(1);
    if (!isSupportedImageFormat(origImgFormat)) {
      throw new HTTPException(500, { message: 'Failed to load image.' });
    }
    if (resImgFormat === origImgFormat && c.req.valid('query').width == null && c.req.valid('query').height == null) {
      // 画像変換せずにそのまま返す
      c.header('Content-Type', IMAGE_MIME_TYPE[resImgFormat]);
      return c.body(createStreamBody(createReadStream(origFilePath)));
    }

    const origBinary = await fs.readFile(origFilePath);
    const image = new Image(await IMAGE_CONVERTER[origImgFormat].decode(origBinary));

    const reqImageSize = c.req.valid('query');

    const scale = Math.max((reqImageSize.width ?? 0) / image.width, (reqImageSize.height ?? 0) / image.height) || 1;
    const manipulated = image.resize({
      height: Math.ceil(image.height * scale),
      preserveAspectRatio: true,
      width: Math.ceil(image.width * scale),
    });

    const resBinary = await IMAGE_CONVERTER[resImgFormat].encode({
      colorSpace: 'srgb',
      data: new Uint8ClampedArray(manipulated.data),
      height: manipulated.height,
      width: manipulated.width,
    });

    c.header('Content-Type', IMAGE_MIME_TYPE[resImgFormat]);
    return c.body(resBinary);
  },
);

export { app as imageApp };
