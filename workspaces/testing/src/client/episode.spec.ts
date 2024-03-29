import { devices, expect, test } from '@playwright/test';

import { waitForAllImagesToLoad } from '../utils';

const BOOK_ID = '670abeed-7c82-4d7a-a997-cd86c362b9b8';
const EPISODE_ID = 'fe2c26de-6bf7-4564-a4dc-d0b88cba8b22';

test.describe('エピソード', () => {
  test.beforeEach(async ({ page }) => {
    // Given
    await page.goto(`/books/${BOOK_ID}/episodes/${EPISODE_ID}`);
  });

  test.describe('漫画ビューアー', () => {
    test.describe('スマートフォン縦画面', () => {
      test.beforeEach(async ({ page }) => {
        // Given
        const viewer = page.getByRole('region', { name: '漫画ビューアー' });
        await viewer.waitFor();
      });

      test('漫画ビューアーに1ページ目のみが表示されていること', async ({ page }) => {
        // Then
        const viewer = page.getByRole('region', { name: '漫画ビューアー' });
        const pages = viewer.getByRole('img');
        await expect(pages.nth(0)).toBeInViewport({ ratio: 0.5 });
        await expect(pages.nth(1)).not.toBeInViewport({ ratio: 0.5 });
        await expect(viewer).toHaveScreenshot('vrt-viewer-initial-smartphone.png');
      });

      test('漫画ビューアーを右にスワイプすると、次のページが表示されること', async ({ page }) => {
        // Given
        const viewer = page.getByRole('region', { name: '漫画ビューアー' });
        await expect(viewer.getByRole('img').nth(0)).toBeInViewport({ ratio: 0.5 });
        await expect(viewer.getByRole('img').nth(1)).not.toBeInViewport({ ratio: 0.5 });

        // When
        const box = await viewer.boundingBox();
        const start = { x: box!.x + 10, y: box!.y + 100 };
        const deltaX = box!.width - 100;
        await page.mouse.move(start.x, start.y);
        await page.mouse.down();
        await page.mouse.move(start.x + deltaX, 0, { steps: 3 });
        await page.mouse.up();

        // Then
        await expect(viewer.getByRole('img').nth(0)).not.toBeInViewport({ ratio: 0.5 });
        await expect(viewer.getByRole('img').nth(1)).toBeInViewport({ ratio: 0.5 });
        await expect(viewer).toHaveScreenshot('vrt-viewer-swiped-smartphone.png');
      });
    });

    test.describe('タブレット', () => {
      test.beforeEach(async ({ page }) => {
        // Given
        await page.setViewportSize(devices['Galaxy Tab S4'].viewport);
        const viewer = page.getByRole('region', { name: '漫画ビューアー' });
        await viewer.waitFor();
      });

      test('漫画ビューアーに1ページ目のみが表示されていること', async ({ page }) => {
        // When
        const viewer = page.getByRole('region', { name: '漫画ビューアー' });
        const pages = viewer.getByRole('img');
        await expect(pages.nth(0)).toBeInViewport({ ratio: 0.5 });
        await expect(pages.nth(1)).not.toBeInViewport({ ratio: 0.5 });
        await expect(viewer).toHaveScreenshot('vrt-viewer-initial-tablet.png');
      });

      test('漫画ビューアーを右にスワイプすると、次のページが表示されること', async ({ page }) => {
        // Given
        const viewer = page.getByRole('region', { name: '漫画ビューアー' });
        await expect(viewer.getByRole('img').nth(0)).toBeInViewport({ ratio: 0.5 });
        await expect(viewer.getByRole('img').nth(1)).not.toBeInViewport({ ratio: 0.5 });

        // When
        const box = await viewer.boundingBox();
        const start = { x: box!.x + 10, y: box!.y + 100 };
        const deltaX = box!.width - 100;
        await page.mouse.move(start.x, start.y);
        await page.mouse.down();
        await page.mouse.move(start.x + deltaX, 0, { steps: 3 });
        await page.mouse.up();

        // Then
        await expect(viewer.getByRole('img').nth(0)).not.toBeInViewport({ ratio: 0.5 });
        await expect(viewer.getByRole('img').nth(1)).toBeInViewport({ ratio: 0.5 });
        await expect(viewer.getByRole('img').nth(2)).toBeInViewport({ ratio: 0.5 });
        await expect(viewer).toHaveScreenshot('vrt-viewer-swiped-tablet.png');
      });
    });
  });

  test('エピソード一覧が表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: 'エピソード一覧' });
    await expect(section).toBeVisible();
    const firstEpisode = section.getByRole('listitem').first();
    await waitForAllImagesToLoad(firstEpisode, 2);
    await expect(firstEpisode).toContainText('第1話');
    await expect(firstEpisode).toHaveScreenshot('vrt-episode.png');
  });

  test('エピソード一覧のエピソードをクリックすると、エピソードページに遷移すること', async ({ page }) => {
    // When
    const section = page.getByRole('region', { name: 'エピソード一覧' });
    const firstEpisode = section.getByRole('listitem').first();
    await firstEpisode.getByRole('link').click();

    // Then
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+\/episodes\/[a-z0-9-]+$/);
  });
});
