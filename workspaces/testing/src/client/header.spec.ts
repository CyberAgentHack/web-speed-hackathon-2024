import { expect, test } from '@playwright/test';

const BOOK_ID = '6e5175b6-7724-4872-9d99-c3cd372a8860';
const EPISODE_ID = '3f919940-2392-4434-9095-a338868cf567';
const AUTHOR_ID = 'b0887a9d-3913-42f3-a574-e9c51579a669';

const pages = [
  { name: '作者ページ', path: `/authors/${AUTHOR_ID}` },
  { name: '作品ページ', path: `/books/${BOOK_ID}` },
  { name: 'エピソードページ', path: `/books/${BOOK_ID}/episodes/${EPISODE_ID}` },
  { name: '検索ページ', path: '/search' },
];

for (const { name, path } of pages) {
  test.describe(`${name} のヘッダー`, () => {
    test.beforeEach(async ({ page }) => {
      // Given
      await page.goto(path);
    });

    test('トップへ戻るボタンが表示されていること', async ({ page }) => {
      // Then
      const header = page.getByRole('banner');
      const button = header.getByRole('link', { name: 'トップへ戻る' });
      await expect(button).toBeVisible();
      await expect(header).toHaveScreenshot(`${name}-header.png`);
    });

    test('トップへ戻るボタンを押すと、トップページに遷移すること', async ({ page }) => {
      // When
      const header = page.getByRole('banner');
      const button = header.getByRole('link', { name: 'トップへ戻る' });
      await button.click();

      // Then
      await expect(page).toHaveURL('/');
    });
  });
}
