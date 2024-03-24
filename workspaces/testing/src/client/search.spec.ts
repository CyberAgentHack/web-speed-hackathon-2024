import { expect, test } from '@playwright/test';

import { waitForAllImagesToLoad } from '../utils';

test.describe('検索', () => {
  test.beforeEach(async ({ page }) => {
    // Given
    await page.goto('/search');
  });

  test('検索欄が表示されていること', async ({ page }) => {
    // Then
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await expect(textbox).toBeVisible();
  });

  test('検索結果が空で表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: '検索結果' });
    const list = section.getByRole('list');
    await expect(list).not.toBeVisible();
  });

  test('検索欄に「日常」を入力すると、一致する作品が表示されること', async ({ page }) => {
    // When
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await textbox.fill('日常');

    // Then
    const section = page.getByRole('region', { name: '検索結果' });
    const list = section.getByRole('list');
    await expect(list).toBeVisible();
    const items = list.getByRole('listitem');
    const firstItem = items.first();
    await firstItem.getByRole('img', { name: /日常/ }).waitFor();
    await expect(firstItem).toBeVisible();
    await expect(firstItem).toContainText('日常');
  });

  test('検索欄に「コノアドケナイ」を入力すると、一致する作品が表示されること', async ({ page }) => {
    // When
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await textbox.fill('コノアドケナイ');

    // Then
    const section = page.getByRole('region', { name: '検索結果' });
    const list = section.getByRole('list');
    await expect(list).toBeVisible();
    const items = list.getByRole('listitem');
    await expect(items.nth(0)).toBeVisible();
    await expect(items.nth(0)).toContainText('このあどけない');
  });

  test('検索欄に「いもうと」を入力すると、一致する作品が表示されること', async ({ page }) => {
    // When
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await textbox.fill('いもうと');

    // Then
    const section = page.getByRole('region', { name: '検索結果' });
    const list = section.getByRole('list');
    await expect(list).toBeVisible();
    const items = list.getByRole('listitem');
    await expect(items.nth(0)).toBeVisible();
    await expect(items.nth(0)).toContainText('妹');
  });

  test('検索欄に「ないよ」と入力すると、「関連作品は見つかりませんでした」と表示されること', async ({ page }) => {
    // When
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await textbox.fill('ないよ');

    // Then
    const section = page.getByRole('region', { name: '検索結果' });
    await expect(section).toContainText('関連作品は見つかりませんでした');
  });

  test('「会社」と入力されている状態で、「は」を入力すると、インクリメンタル検索が行われて一致する作品が表示されること', async ({
    page,
  }) => {
    // Given
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await textbox.fill('会社');
    await page.getByRole('region', { name: '検索結果' }).getByRole('listitem').nth(0).waitFor();
    const link1 = await page.getByRole('region', { name: '検索結果' }).getByRole('link').nth(0).getAttribute('href');

    // When
    await textbox.fill('会社は');

    // Then
    await page.getByRole('region', { name: '検索結果' }).getByRole('listitem').nth(0).waitFor();
    const link2 = await page.getByRole('region', { name: '検索結果' }).getByRole('link').nth(0).getAttribute('href');
    expect(link1).not.toEqual(link2);
  });

  test('検索欄に「日常」を入力すると、検索結果に作品のサムネイル、タイトルが表示されること', async ({ page }) => {
    // When
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await textbox.fill('日常');

    // Then
    const section = page.getByRole('region', { name: '検索結果' });
    const list = section.getByRole('list');
    const items = list.getByRole('listitem');
    await waitForAllImagesToLoad(items.nth(0), 2);
    await expect(items.nth(0)).toHaveScreenshot('vrt-search-result.png');
  });

  test('検索結果が表示されている状態で、作品をクリックすると、作品ページに遷移すること', async ({ page }) => {
    // Given
    const textbox = page.getByRole('textbox', { name: '作品名を入力' });
    await textbox.fill('日常');

    // When
    const section = page.getByRole('region', { name: '検索結果' });
    const list = section.getByRole('list');
    const items = list.getByRole('listitem');
    const link = items.nth(0).getByRole('link');
    await link.click();

    // Then
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+$/);
  });
});
