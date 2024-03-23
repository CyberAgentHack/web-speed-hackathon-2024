import fs from 'node:fs/promises';

import Jimp from 'jimp';

import type { ReadImageFunction } from './ReadImageFunction';

export const readPng: ReadImageFunction = async (imagePath) => {
  const imageBinary = await fs.readFile(imagePath);
  const jimp = await Jimp.read(imageBinary);

  return {
    colorSpace: 'srgb',
    data: new Uint8ClampedArray(jimp.bitmap.data),
    height: jimp.getHeight(),
    width: jimp.getWidth(),
  };
};
