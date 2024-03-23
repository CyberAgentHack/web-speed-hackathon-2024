import fs from 'node:fs/promises';
import { createRequire } from 'node:module';

import decode, { init as jsquashInit } from '@jsquash/jxl/decode.js';

import type { ReadImageFunction } from './ReadImageFunction';

const require = createRequire(import.meta.url);
const initializePromise = fs.readFile(require.resolve('@jsquash/jxl/codec/dec/jxl_dec.wasm')).then((wasmBinary) => {
  return jsquashInit(undefined, { wasmBinary });
});

export const readJpegXL: ReadImageFunction = async (imagePath) => {
  await initializePromise;

  const imageBinary = await fs.readFile(imagePath);
  const imageData = await decode(imageBinary);

  return {
    colorSpace: 'srgb',
    data: imageData.data,
    height: imageData.height,
    width: imageData.width,
  };
};
