import { webcrypto } from 'node:crypto';

import { expect, test } from '@playwright/test';

const BOOK_ID = '6e5175b6-7724-4872-9d99-c3cd372a8860';
const EPISODE_ID = '3f919940-2392-4434-9095-a338868cf567';
const AUTHOR_ID = 'b0887a9d-3913-42f3-a574-e9c51579a669';
const pages = [
  { name: 'トップページ', path: '/' },
  { name: '作者ページ', path: `/authors/${AUTHOR_ID}` },
  { name: '作品ページ', path: `/books/${BOOK_ID}` },
  { name: 'エピソードページ', path: `/books/${BOOK_ID}/episodes/${EPISODE_ID}` },
  { name: '検索ページ', path: '/search' },
];

const contentHashes = [
  { hash: 'd67c2589fdea065db18f3bc340589463b1f541347d6ddbcdf4ce7288dd80e3be', name: '利用規約' },
  { hash: '946811508410e8eaa7cd74883b2437944128542dace0f7634d1b84e256acdddb', name: 'お問い合わせ' },
  { hash: '4eccdd5d6257687cb09cabc02ea8aa5f443ee04920d352f3f1462a440ddee110', name: 'Q&A' },
  { hash: '16949e4f41dfe8991942a004d131b230ed2377fe1d10630e383eef71c701cbfa', name: '運営会社' },
  { hash: '987e1784b4ae1653b377071c782ea90f256c352da27efea458f4c2a2f65b0203', name: 'Cyber TOONとは' },
];

async function getSHA256Hash(str: string | null): Promise<string | null> {
  if (str == null) {
    return null;
  }

  const buffer = new TextEncoder().encode(str);
  const hash = await webcrypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

for (const { name, path } of pages) {
  test.describe(`${name} のフッター`, () => {
    test.beforeEach(async ({ page }) => {
      // Given
      await page.goto(path);
    });

    test('サービスロゴとメニューの各項目が表示されていること', async ({ page }) => {
      // Then
      const footer = page.getByRole('contentinfo');
      const logo = footer.getByRole('img', { name: 'Cyber TOON' });
      await expect(logo).toBeVisible();

      // XXX: トップページは画像読み込みによる高さの変動が不安定なため、スクリーンショットを取得しない
      if (path !== '/') {
        await expect(footer).toHaveScreenshot(`${name}-footer.png`);
      }
    });

    for (const { hash, name } of contentHashes) {
      test(`${name}をクリックすると、モーダルで内容が表示されること`, async ({ page }) => {
        // When
        const footer = page.getByRole('contentinfo');
        await footer.getByRole('button', { name }).click();

        // Then
        const modal = page.getByRole('dialog', { name });
        await expect(modal).toBeVisible();
        await expect(modal.getByRole('paragraph')).toContainText(/(青空文庫|クリエイティブ・コモンズ)/);
        const content = await modal.getByRole('paragraph').textContent();
        expect(getSHA256Hash(content)).resolves.toBe(hash);
      });
    }
  });
}
