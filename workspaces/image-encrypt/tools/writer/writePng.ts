import fs from 'node:fs/promises';
import path from 'node:path';

import Jimp from 'jimp';

import type { WriteImageFunction } from './WriteImageFunction';

export const writePng: WriteImageFunction = async ({ filepath, imageData }) => {
  const imageBinary = await new Jimp(imageData).getBufferAsync(Jimp.MIME_PNG);

  await fs.mkdir(path.dirname(filepath), { recursive: true }).catch(() => {});
  await fs.writeFile(filepath, imageBinary);
};
