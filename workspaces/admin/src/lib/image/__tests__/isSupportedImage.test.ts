import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { isSupportedImage } from '../isSupportedImage';

describe('isSupportedImage', () => {
  it('returns true if the image is supported', async () => {
    // Given
    const imagePath = path.resolve(__dirname, '../__mock__/image.jpg');
    const imageBuffer = await readFile(imagePath);
    const file = new File([imageBuffer], 'filename', { type: 'image/jpeg' });

    // When
    const actual = await isSupportedImage(file);

    // Then
    expect(actual).toBe(true);
  });

  it('returns false if the image is not supported', async () => {
    // Given
    const imagePath = path.resolve(__dirname, '../__mock__/image.gif');
    const imageBuffer = await readFile(imagePath);
    const file = new File([imageBuffer], 'filename', { type: 'image/gif' });

    // When
    const actual = await isSupportedImage(file);

    // Then
    expect(actual).toBe(false);
  });
});
