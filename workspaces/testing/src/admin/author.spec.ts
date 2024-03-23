import path from 'node:path';

import { expect, test } from '@playwright/test';

import { waitForAllImagesToLoad, waitForImageToLoad } from '../utils';

const AUTHOR_ID = '2ab0aca5-7dc2-4543-ac98-e23fdaca0739';
const AUTHOR_NAME = 'サトウ リコ';
const AUTHOR_NAME_HIRAGANA = 'さとう りこ';
const AUTHOR_DESC =
  'それを説明するためには、それまでの私というものを一応お話ししなければならん事になります。そのお話がす';

test.describe('作者一覧', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('/api/v1/initialize');

    // Given: ログインしている状態
    await page.goto('/admin');
    const emailTextbox = page.getByRole('textbox', { name: 'メールアドレス' });
    await emailTextbox.fill('administrator@example.com');
    const passwordTextbox = page.getByRole('textbox', { name: 'パスワード' });
    await passwordTextbox.fill('pa5sW0rd!');
    const button = page.getByRole('button', { name: 'ログイン' });
    await button.click();
    const form = page.getByRole('form', { name: 'ログアウト' });
    await expect(form).toBeVisible();

    // Given: 作者一覧画面に遷移している状態
    await page.getByRole('navigation').getByRole('link', { name: '作者一覧' }).click();
  });

  test.describe('作者一覧', () => {
    test('検索セクションが表示されていること', async ({ page }) => {
      // Then
      const searchSection = page.getByRole('region', { name: '検索セクション' });
      await expect(searchSection).toBeVisible();
      await expect(searchSection).toHaveScreenshot('vrt-search-section.png');
    });

    test('作者一覧が表示されていること', async ({ page }) => {
      // Then
      const bodyRows = page.getByRole('region', { name: '作者一覧' }).getByRole('table').locator('tbody > tr');
      const firstBodyRow = bodyRows.first();
      await expect(firstBodyRow).toBeVisible();
      await expect(firstBodyRow.getByRole('button', { name: '詳細' })).toBeVisible();
      await expect(firstBodyRow).toHaveScreenshot('vrt-author-list.png');
    });

    test('初期状態で、検索欄に入力すると、「作者 ID」で検索されて一致する作者が表示されること', async ({ page }) => {
      // When
      const textbox = page.getByRole('textbox', { name: '条件を入力' });
      await textbox.fill(AUTHOR_ID);

      // Then
      const authorListSection = page.getByRole('region', { name: '作者一覧' });
      const table = authorListSection.getByRole('table');
      const items = table.getByRole('row');
      await expect(items.nth(0)).toBeVisible();
    });

    for (const name of [AUTHOR_NAME, AUTHOR_NAME_HIRAGANA]) {
      test(`「作者名」が選択された状態で、「${name}」と検索欄に入力すると、一致する作者が表示されること`, async ({
        page,
      }) => {
        // Given
        const radio = page.getByRole('radiogroup').getByText('作者名');
        await radio.click();

        // When
        const textbox = page.getByRole('textbox', { name: '条件を入力' });
        await textbox.fill(name);

        // Then
        const authorListSection = page.getByRole('region', { name: '作者一覧' });
        const table = authorListSection.getByRole('table');
        const items = table.getByRole('row');
        await expect(items.nth(0)).toBeVisible();
      });
    }
  });

  test.describe('作者編集モーダル', () => {
    test.beforeEach(async ({ page }) => {
      // Given: 作者 ID で絞り込みが行われている状態
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill(AUTHOR_ID);

      // Given: 作者詳細モーダルを開いている状態
      const bodyRows = page.getByRole('region', { name: '作者一覧' }).getByRole('table').locator('tbody > tr');
      await bodyRows.first().waitFor();
      await bodyRows.first().getByRole('button', { name: '詳細' }).click();
      await page.getByRole('dialog').waitFor();
    });

    test('作者編集モーダルが表示されていること', async ({ page }) => {
      // Then
      const authorDetailSection = page.getByRole('dialog').getByRole('region', { name: '作者詳細' });
      await waitForAllImagesToLoad(authorDetailSection, 1);
      await expect(authorDetailSection).toContainText(AUTHOR_NAME);
      await expect(authorDetailSection).toContainText(AUTHOR_DESC);
      await expect(authorDetailSection).toHaveScreenshot('vrt-author-detail-section.png');
    });

    test('作者の作品一覧が表示されていること', async ({ page }) => {
      // Then
      const table = page.getByRole('dialog').getByRole('table', { name: '作品一覧' });
      const bodyRows = table.locator('tbody > tr');
      await expect(bodyRows.first()).toBeVisible();
      await expect(bodyRows.first()).toHaveScreenshot('vrt-book-list.png');
    });

    test('編集ボタンをクリックして編集モードになっている状態で、作者名を変更して決定ボタンを押すと、作者名が変更されること', async ({
      page,
    }) => {
      // Given
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作者詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作者名' }).fill('テスト リコ');
      await page.getByRole('dialog').getByRole('button', { name: '決定' }).click();

      // Then
      await expect(page.getByRole('dialog')).toContainText('テスト リコ');
    });

    test('編集ボタンをクリックして編集モードになっている状態で、プロフィールを変更して決定ボタンを押すと、プロフィールが変更されること', async ({
      page,
    }) => {
      // Given
      const replacement =
        '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。';
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作者詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // WHen
      await page.getByRole('dialog').getByRole('textbox', { name: 'プロフィール' }).fill(replacement);
      await page.getByRole('dialog').getByRole('button', { name: '決定' }).click();

      // Then
      await expect(page.getByRole('dialog')).toContainText(replacement);
    });

    test('編集ボタンをクリックして編集モードになっている状態で、画像を変更して決定ボタンを押すと、画像が変更されること', async ({
      page,
    }) => {
      // Given
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作者詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作者の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.jpg'));
      await page.getByRole('dialog').getByRole('button', { name: '決定' }).click();

      // Then
      await waitForImageToLoad(page.getByRole('dialog').getByRole('img', { name: AUTHOR_NAME }));
    });

    test('編集ボタンをクリックして編集モードになっている状態で、作者名、プロフィール、画像に不正な値を入力すると、エラーメッセージが表示されること', async ({
      page,
    }) => {
      // Given
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作者詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作者名' }).fill('');
      await page.getByRole('dialog').getByRole('textbox', { name: 'プロフィール' }).fill('');
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作者の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.gif'));

      // Then
      await expect(page.getByRole('dialog').getByRole('alert')).toHaveText([
        'プロフィールを入力してください',
        '対応していない画像形式です',
        '作者名を入力してください',
      ]);
    });

    test('削除ボタンをクリックすると、作者が削除されること', async ({ page }) => {
      // When
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作者詳細' })
        .getByRole('button', { name: '削除' })
        .click();

      // Then
      const bodyRows = page.getByRole('region', { name: '作者一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows).toHaveCount(0);
    });
  });

  test.describe('作者の追加', () => {
    test.beforeEach(async ({ page }) => {
      // Given: 作者の追加モーダルが表示されている状態
      await page.getByRole('button', { name: '作者を追加' }).click();
      await page.getByRole('dialog').waitFor();
    });

    test('必要な情報を入力して作成ボタンを押すと、作者が追加されて作者一覧に表示されること', async ({ page }) => {
      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作者名' }).fill('テスト リコ');
      await page
        .getByRole('dialog')
        .getByRole('textbox', { name: 'プロフィール' })
        .fill(
          '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。',
        );
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作者の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.jpg'));

      // When
      await page.getByRole('dialog').getByRole('button', { name: '作成' }).click();

      // Then
      const radio = page.getByRole('radiogroup').getByText('作者名');
      await radio.click();
      const textbox = page.getByRole('textbox', { name: '条件を入力' });
      await textbox.fill('テスト リコ');
      const bodyRows = page.getByRole('region', { name: '作者一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows).toHaveCount(1);
      await expect(bodyRows).toContainText('テスト リコ');
    });

    test('作者名、プロフィール、画像に不正な値を入力すると、エラーメッセージが表示されること', async ({ page }) => {
      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作者名' }).fill('');
      await page.getByRole('dialog').getByRole('textbox', { name: 'プロフィール' }).fill('');
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作者の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.gif'));

      // Then
      await expect(page.getByRole('dialog').getByRole('alert')).toHaveText([
        'プロフィールを入力してください',
        '対応していない画像形式です',
        '作者名を入力してください',
      ]);
    });
  });
});
