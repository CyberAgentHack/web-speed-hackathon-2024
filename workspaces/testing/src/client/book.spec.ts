import { expect, test } from '@playwright/test';

import { waitForAllImagesToLoad } from '../utils';

const BOOK_ID = 'af7583e6-e52e-4f28-86dd-04f0af9d4868';
const BOOK_TITLE = '異世界教え子';
const BOOK_DESC =
  '金力についても同じ事であります。私の考によると、責任を解しない金力家は、世の中にあってならないものな';
const BOOK_AUTHOR = 'サトウ アヤハ';

test.describe('作品', () => {
  test.beforeEach(async ({ page }) => {
    // Given
    await page.goto(`/books/${BOOK_ID}`);
  });

  test('作品情報にカバー画像、タイトル、説明、作者が表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: '作品情報' });
    await waitForAllImagesToLoad(section, 2);
    await expect(section).toContainText(BOOK_TITLE);
    await expect(section).toContainText(BOOK_DESC);
    await expect(section).toContainText(BOOK_AUTHOR);
    await expect(section).toHaveScreenshot('vrt-book-details.png');
  });

  test('作品情報の作者をクリックすると、作者ページに遷移すること', async ({ page }) => {
    // When
    const section = page.getByRole('region', { name: '作品情報' });
    const link = section.getByRole('link', { name: BOOK_AUTHOR });
    await link.click();

    // Then
    await expect(page).toHaveURL(/\/authors\/[a-z0-9-]+$/);
  });

  test('エピソード一覧が表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: 'エピソード一覧' });
    await expect(section).toBeVisible();
  });

  test('エピソード一覧のエピソードにサムネイル、タイトルが表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: 'エピソード一覧' });
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

  test('作品がお気に入りに入っていない状態で、お気に入りボタンを押すと、お気に入りに追加されること', async ({
    page,
  }) => {
    // When
    await page.getByRole('button', { name: 'お気に入りに追加する' }).click();

    // Then
    await expect(page.getByRole('button', { name: 'お気に入りを解除する' })).toBeVisible();
  });

  test('作品がお気に入りに入っている状態で、ページを表示すると、お気に入りボタンが活性化されていること', async ({
    page,
  }) => {
    // Given
    await page.getByRole('button', { name: 'お気に入りに追加する' }).click();
    await expect(page.getByRole('button', { name: 'お気に入りを解除する' })).toBeVisible();

    // When
    await page.reload();

    // Then
    await expect(page.getByRole('button', { name: 'お気に入りを解除する' })).toBeVisible();
  });

  test('作品がお気に入りに入っている状態で、お気に入りボタンを押すと、お気に入りから削除されること', async ({
    page,
  }) => {
    // Given
    await page.getByRole('button', { name: 'お気に入りに追加する' }).click();
    await expect(page.getByRole('button', { name: 'お気に入りを解除する' })).toBeVisible();

    // When
    await page.getByRole('button', { name: 'お気に入りを解除する' }).click();

    // Then
    await expect(page.getByRole('button', { name: 'お気に入りに追加する' })).toBeVisible();
  });

  test('最新話を読むボタンを押すと、最新話のエピソードページに遷移すること', async ({ page }) => {
    // When
    const button = page.getByRole('link', { name: '最新話を読む' });
    await button.click();

    // Then
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+\/episodes\/[a-z0-9-]+$/);
  });
});
