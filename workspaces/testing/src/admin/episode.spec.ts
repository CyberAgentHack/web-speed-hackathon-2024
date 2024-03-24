import path from 'node:path';

import { expect, test } from '@playwright/test';

import { waitForImageToLoad } from '../utils';

const BOOK_ID = '29eeee80-c22e-4af7-83dd-d4de883f3d57';
const EPISODE_ID = '2915ff54-5ddb-4eb7-99a2-f415045622be';

test.describe('エピソード', () => {
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

    // Given: 作品一覧画面に遷移している状態
    await page.getByRole('navigation').getByRole('link', { name: '作品一覧' }).click();
    const table = page.getByRole('region', { name: '作品一覧' }).getByRole('table');
    table.waitFor();

    // Given: 作品詳細モーダルが表示されている状態
    const searchbox = page.getByRole('textbox', { name: '条件を入力' });
    await searchbox.fill(BOOK_ID);
    const bodyRows = table.locator('tbody > tr');
    await bodyRows.first().waitFor();
    await bodyRows.first().getByRole('button', { name: '詳細' }).click();
    await page.getByRole('dialog').waitFor();
  });

  test.describe('エピソードの追加', () => {
    test.beforeEach(async ({ page }) => {
      // Given
      await page.getByRole('dialog').getByRole('button', { name: 'エピソードを追加' }).click();
    });

    test('必要な情報を入力して作成ボタンを押すと、エピソード編集画面に遷移して入力したデータが表示されること', async ({
      page,
    }) => {
      // When
      await page.getByRole('textbox', { exact: true, name: 'エピソード名' }).fill('私は夜空に届かない');
      await page.getByRole('textbox', { name: 'エピソード名（ふりがな）' }).fill('わたしはよぞらにとどかない');
      await page
        .getByRole('textbox', { name: 'あらすじ' })
        .fill(
          '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。',
        );
      await page.getByRole('spinbutton', { name: 'エピソードの章' }).fill('1');
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: 'サムネイルの画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.jpg'));
      await page.getByRole('button', { name: '作成' }).click();

      // Then
      await expect(page).toHaveURL(/\/admin\/books\/[a-z0-9-]+\/episodes\/[a-z0-9-]+$/);
      const bookId = page.url().match(/\/books\/([a-z0-9-]+)\//)![1];
      await expect(page.getByRole('textbox', { exact: true, name: 'エピソード名' })).toHaveValue('私は夜空に届かない');
      await expect(page.getByRole('textbox', { name: 'エピソード名（ふりがな）' })).toHaveValue(
        'わたしはよぞらにとどかない',
      );
      await expect(page.getByRole('textbox', { name: 'あらすじ' })).toHaveValue(
        '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。',
      );
      await expect(page.getByRole('spinbutton', { name: 'エピソードの章' })).toHaveValue('1');
      await expect(page.getByRole('form', { name: 'エピソード情報' })).toContainText(bookId!);
    });

    test('エピソード名、エピソード名（ふりがな）、あらすじ、章、サムネイル画像に不正な値を入力すると、エラーメッセージが表示されること', async ({
      page,
    }) => {
      // When
      await page.getByRole('textbox', { exact: true, name: 'エピソード名' }).fill('');
      await page.getByRole('textbox', { name: 'エピソード名（ふりがな）' }).fill('');
      await page.getByRole('textbox', { name: 'あらすじ' }).fill('');
      await page.getByRole('spinbutton', { name: 'エピソードの章' }).fill('');
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: 'サムネイルの画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.gif'));

      // Then
      await expect(page.getByRole('form', { name: 'エピソード情報' }).getByRole('alert')).toHaveText([
        '対応していない画像形式です',
        'エピソード名を入力してください',
        'エピソード名（ふりがな）を入力してください',
        'あらすじを入力してください',
        '章を入力してください',
      ]);

      // When
      await page.getByRole('textbox', { name: 'エピソード名（ふりがな）' }).fill('カタカナ');

      // Then
      await expect(page.getByRole('form', { name: 'エピソード情報' }).getByRole('alert')).toHaveText([
        '対応していない画像形式です',
        'エピソード名を入力してください',
        'ふりがなはひらがなで入力してください',
        'あらすじを入力してください',
        '章を入力してください',
      ]);
    });
  });

  test.describe('エピソードの編集', () => {
    test.beforeEach(async ({ page }) => {
      // Given: エピソード詳細画面に遷移している状態
      await page
        .getByRole('dialog')
        .getByRole('table', { name: 'エピソード一覧' })
        .getByRole('button', { name: '編集' })
        .first()
        .click();
      await page
        .getByRole('list', { name: 'ページ一覧' })
        .getByRole('listitem')
        .filter({ has: page.getByRole('img') })
        .first()
        .waitFor();
    });

    test.describe('ページの編集', () => {
      test.beforeEach(async ({ page }) => {
        // Given
        const pages = page.getByRole('list', { name: 'ページ一覧' }).getByRole('listitem');
        for (let i = 0; i < 5; i++) {
          await waitForImageToLoad(pages.nth(i).getByRole('img'));
        }
      });

      test('ページ画像がデコードされて表示されること', async ({ page }) => {
        // Then
        await expect(page.getByRole('list', { name: 'ページ一覧' })).toHaveScreenshot('vrt-page-list.png');
      });

      test('×ボタンをクリックすると、ページが削除されること', async ({ page }) => {
        // When
        const firstPage = page.getByRole('list', { name: 'ページ一覧' }).getByRole('listitem').first();
        const firstPageId = await firstPage.getByRole('img').getAttribute('alt');
        const deleteButton = firstPage.getByRole('button', { name: 'ページを削除' });
        await deleteButton.click();

        // Then
        await expect(page.getByRole('img', { name: firstPageId! })).not.toBeVisible();
      });

      test('+ボタンをクリックして画像ファイルを選択すると、ページが追加されること', async ({ page }) => {
        // Given
        const pages = page
          .getByRole('list', { name: 'ページ一覧' })
          .getByRole('listitem')
          .filter({ has: page.getByRole('img') });
        await pages.last().getByRole('img').waitFor();
        const lastPageId = await pages.last().getByRole('img').getAttribute('alt');

        // When
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'ページを追加' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, 'image.jpg'));

        // Then
        await waitForImageToLoad(pages.last().getByRole('img'));
        await expect(pages.last().getByRole('img')).not.toHaveAttribute('alt', lastPageId!);
      });
    });

    test.describe('エピソード情報の編集', () => {
      test('エピソード情報がフォームとして表示されること', async ({ page }) => {
        // Then
        const bookId = page.url().match(/\/books\/([a-z0-9-]+)\//)![1];
        await expect(page.getByRole('form', { name: 'エピソード情報' })).toContainText(bookId!);
        await expect(page.getByRole('form', { name: 'エピソード情報' })).toHaveScreenshot('vrt-episode-details.png');
      });

      test('サムネイルを変更して更新ボタンを押すと、サムネイルが変更されること', async ({ page }) => {
        // Given
        const button = page.getByRole('button', { name: 'サムネイルの画像を選択' });
        const prevImageId = await button.getByRole('img').getAttribute('alt');

        // When
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'サムネイルの画像を選択' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, 'image.jpg'));
        await page.getByRole('button', { name: '更新' }).click();

        // Then
        await expect(button.getByRole('img')).not.toHaveAttribute('alt', prevImageId!);
      });

      test('エピソード名を変更して更新ボタンを押すと、エピソード名が変更されること', async ({ page }) => {
        // When
        const titleTextbox = page.getByRole('textbox', { exact: true, name: 'エピソード名' });
        await titleTextbox.fill('私は夜空に届かない');
        await page.getByRole('button', { name: '更新' }).click();

        // Then
        await page.getByRole('button', { name: '更新' }).waitFor();
        await expect(page.getByRole('textbox', { exact: true, name: 'エピソード名' })).toHaveValue(
          '私は夜空に届かない',
        );
      });

      test('エピソード名（ふりがな）を変更して更新ボタンを押すと、ふりがなが変更されること', async ({ page }) => {
        // When
        const titleTextbox = page.getByRole('textbox', { name: 'エピソード名（ふりがな）' });
        await titleTextbox.fill('わたしはよぞらにとどかない');
        await page.getByRole('button', { name: '更新' }).click();

        // Then
        await page.getByRole('button', { name: '更新' }).waitFor();
        await expect(page.getByRole('textbox', { name: 'エピソード名（ふりがな）' })).toHaveValue(
          'わたしはよぞらにとどかない',
        );
      });

      test('あらすじを変更して更新ボタンを押すと、あらすじが変更されること', async ({ page }) => {
        // When
        const replacement =
          '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。';
        const titleTextbox = page.getByRole('textbox', { name: 'あらすじ' });
        await titleTextbox.fill(replacement);
        await page.getByRole('button', { name: '更新' }).click();

        // Then
        await page.getByRole('button', { name: '更新' }).waitFor();
        await expect(page.getByRole('textbox', { name: 'あらすじ' })).toHaveValue(replacement);
      });

      test('エピソードの章を変更して更新ボタンを押すと、章が変更されること', async ({ page }) => {
        // WHen
        const titleTextbox = page.getByRole('spinbutton', { name: 'エピソードの章' });
        await titleTextbox.fill('2');
        await page.getByRole('button', { name: '更新' }).click();

        // Then
        await page.getByRole('button', { name: '更新' }).waitFor();
        await expect(page.getByRole('spinbutton', { name: 'エピソードの章' })).toHaveValue('2');
      });

      test('エピソード名、エピソード名（ふりがな）、あらすじ、章、サムネイル画像に不正な値を入力すると、エラーメッセージが表示されること', async ({
        page,
      }) => {
        // When
        await page.getByRole('textbox', { exact: true, name: 'エピソード名' }).fill('');
        await page.getByRole('textbox', { name: 'エピソード名（ふりがな）' }).fill('');
        await page.getByRole('textbox', { name: 'あらすじ' }).fill('');
        await page.getByRole('spinbutton', { name: 'エピソードの章' }).fill('');
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'サムネイルの画像を選択' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, 'image.gif'));

        // Then
        await expect(page.getByRole('form', { name: 'エピソード情報' }).getByRole('alert')).toHaveText([
          '対応していない画像形式です',
          'エピソード名を入力してください',
          'エピソード名（ふりがな）を入力してください',
          'あらすじを入力してください',
          '章を入力してください',
        ]);

        // When
        await page.getByRole('textbox', { name: 'エピソード名（ふりがな）' }).fill('カタカナ');

        // Then
        await expect(page.getByRole('form', { name: 'エピソード情報' }).getByRole('alert')).toHaveText([
          '対応していない画像形式です',
          'エピソード名を入力してください',
          'ふりがなはひらがなで入力してください',
          'あらすじを入力してください',
          '章を入力してください',
        ]);
      });

      test('削除ボタンを押すと、作品一覧ページに遷移して当該エピソードが消えていること', async ({ page }) => {
        // When
        const deleteButton = page.getByRole('button', { exact: true, name: '削除' });
        await deleteButton.click();

        // Then: 作品一覧ページに遷移する
        await expect(page).toHaveURL('/admin/books');

        // Then: 当該エピソードが消えている
        const table = page.getByRole('region', { name: '作品一覧' }).getByRole('table');
        table.waitFor();
        const searchbox = page.getByRole('textbox', { name: '条件を入力' });
        await searchbox.fill(BOOK_ID);
        const bodyRows = table.locator('tbody > tr');
        await bodyRows.first().waitFor();
        await bodyRows.first().getByRole('button', { name: '詳細' }).click();
        await page.getByRole('dialog').waitFor();
        await page
          .getByRole('dialog')
          .getByRole('table', { name: 'エピソード一覧' })
          .getByRole('button', { name: '編集' })
          .first()
          .waitFor();
        await expect(page.getByRole('dialog').getByRole('table', { name: 'エピソード一覧' })).not.toContainText(
          EPISODE_ID,
        );
      });
    });
  });
});
