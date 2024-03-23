import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';

export async function waitForImageToLoad(imageLocator: Locator): Promise<void> {
  await imageLocator.scrollIntoViewIfNeeded();
  await expect(imageLocator).toBeVisible();
  await expect(async () => {
    expect(
      await (
        await imageLocator.evaluateHandle((element, prop) => {
          if (!(element instanceof HTMLImageElement)) {
            throw new Error('Element is not an image');
          }
          return element[prop as keyof typeof element];
        }, 'naturalWidth')
      ).jsonValue(),
    ).toBeGreaterThan(0);
  }).toPass();
}

export async function waitForAllImagesToLoad(locator: Locator, expectedNumberOfImages: number = 1): Promise<void> {
  const images = locator.locator('img');

  await expect(async () => {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
    await expect(images.count()).resolves.toBeGreaterThanOrEqual(expectedNumberOfImages);
  }).toPass();

  const count = await images.count();
  for (let i = 0; i < count; i++) {
    await waitForImageToLoad(images.nth(i));
  }
}
