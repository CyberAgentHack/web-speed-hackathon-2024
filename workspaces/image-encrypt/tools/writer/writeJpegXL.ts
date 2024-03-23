import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import encode, { init as jsquashInit } from '@jsquash/jxl/encode.js';

import type { WriteImageFunction } from './WriteImageFunction';

const require = createRequire(import.meta.url);
const initializePromise = fs.readFile(require.resolve('@jsquash/jxl/codec/enc/jxl_enc.wasm')).then((wasmBinary) => {
  return jsquashInit(undefined, { wasmBinary });
});

export const writeJpegXL: WriteImageFunction = async ({ filepath, imageData }) => {
  await initializePromise;

  const imageBinary = new Uint8Array(
    await encode(imageData, {
      effort: 0,
      quality: 100,
    }),
  );

  await fs.mkdir(path.dirname(filepath), { recursive: true }).catch(() => {});
  await fs.writeFile(filepath, imageBinary);
};
