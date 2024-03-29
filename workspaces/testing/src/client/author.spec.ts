import { expect, test } from '@playwright/test';

import { waitForAllImagesToLoad } from '../utils';

const AUTHOR_ID = '2ab0aca5-7dc2-4543-ac98-e23fdaca0739';
const AUTHOR_NAME = 'サトウ リコ';
const AUTHOR_DESC =
  'それを説明するためには、それまでの私というものを一応お話ししなければならん事になります。そのお話がす';
const BOOK_TITLE = '幼馴染様、デザートの時間です';

test.describe('作者', () => {
  test.beforeEach(async ({ page }) => {
    // Given
    await page.goto(`/authors/${AUTHOR_ID}`);
  });

  test('作者情報にカバー画像、名前、説明が表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: '作者情報' });
    await waitForAllImagesToLoad(section, 1);
    await expect(section).toContainText(AUTHOR_NAME);
    await expect(section).toContainText(AUTHOR_DESC);
    await expect(section).toHaveScreenshot('vrt-author-info.png');
  });

  test('作品一覧が表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: '作品一覧' });
    await expect(section).toBeVisible();
  });

  test('作品一覧の作品にサムネイル、タイトルが表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: '作品一覧' });
    const firstBook = section.getByRole('listitem').first();
    await waitForAllImagesToLoad(firstBook, 2);
    await expect(firstBook).toContainText(BOOK_TITLE);
    await expect(firstBook).toHaveScreenshot('vrt-book.png');
  });

  test('作品一覧の作品をクリックすると、作品ページに遷移すること', async ({ page }) => {
    // When
    const section = page.getByRole('region', { name: '作品一覧' });
    const firstBook = section.getByRole('listitem').first();
    await firstBook.getByRole('link').click();

    // Then
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+$/);
  });
});
