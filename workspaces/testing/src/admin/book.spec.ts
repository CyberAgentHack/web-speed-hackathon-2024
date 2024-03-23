import path from 'node:path';

import { expect, test } from '@playwright/test';

import { waitForAllImagesToLoad, waitForImageToLoad } from '../utils';

const BOOK_ID = '29eeee80-c22e-4af7-83dd-d4de883f3d57';
const BOOK_NAME = '夫婦様、デザートの時間です';
const BOOK_DESC =
  '金力についても同じ事であります。私の考によると、責任を解しない金力家は、世の中にあってならないものな';
const AUTHOR_ID = '9ead410b-f25e-456a-ba4c-60808c9de397';
const EPISODE_ID = '2915ff54-5ddb-4eb7-99a2-f415045622be';

test.describe('作品一覧', () => {
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
    const tableSection = page.getByRole('region', { name: '作品一覧' });
    tableSection.waitFor();
  });

  test.describe('作品一覧', () => {
    test('検索セクションが表示されていること', async ({ page }) => {
      // Then
      const searchSection = page.getByRole('region', { name: '検索セクション' });
      await expect(searchSection).toBeVisible();
      await expect(searchSection).toHaveScreenshot('vrt-search-section.png');
    });

    test('作品一覧が表示されていること', async ({ page }) => {
      // Then
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      const firstBodyRow = bodyRows.first();
      await expect(firstBodyRow).toBeVisible();
      await expect(firstBodyRow.getByRole('button', { name: '詳細' })).toBeVisible();
      await expect(firstBodyRow).toHaveScreenshot('vrt-book-list.png');
    });

    test('初期状態で、検索欄に入力すると、「作品 ID」で検索されて一致する作品が表示されること', async ({ page }) => {
      // When
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill(BOOK_ID);

      // Then
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows).toHaveCount(1);
      await expect(bodyRows).toContainText(BOOK_ID);
    });

    test('「作品名」が選択された状態で、漢字を検索欄に入力すると、一致する作品が表示されること', async ({ page }) => {
      // Given
      const radio = page.getByRole('radiogroup').getByText('作品名');
      await radio.click();

      // When
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill('日常');

      // Then
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows.first()).toContainText('日常');
    });

    test('「作品名」が選択された状態で、ひらがなを検索欄に入力すると、一致する作品が表示されること', async ({
      page,
    }) => {
      // Given
      const radio = page.getByRole('radiogroup').getByText('作品名');
      await radio.click();

      // When
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill('にちじょう');

      // Then
      const bodyRows = page.getByRole('table').locator('tbody > tr');
      await expect(bodyRows.first()).toContainText('日常');
    });

    test('「作品名」が選択された状態で、カタカナを検索欄に入力すると、一致する作品が表示されること', async ({
      page,
    }) => {
      // Given
      const radio = page.getByRole('radiogroup').getByText('作品名');
      await radio.click();

      // When
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill('ニチジョウ');

      // Then
      const bodyRows = page.getByRole('table').locator('tbody > tr');
      await expect(bodyRows.first()).toContainText('日常');
    });

    test('「作者 ID」が選択された状態で、作者 ID を検索欄に入力すると、一致する作品が表示されること', async ({
      page,
    }) => {
      // Given
      const radio = page.getByRole('radiogroup').getByText('作者 ID');
      await radio.click();

      // When
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill(AUTHOR_ID);

      // Then
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows.first()).toContainText(AUTHOR_ID);
    });

    test('「作者名」が選択された状態で、カタカナを検索欄に入力すると、一致する作品が表示されること', async ({
      page,
    }) => {
      // Given
      const radio = page.getByRole('radiogroup').getByText('作者名');
      await radio.click();

      // When
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill('ヒナタ');

      // Then
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows.first()).toContainText('ヒナタ');
    });

    test('「作者名」が選択された状態で、ひらがなを検索欄に入力すると、一致する作品が表示されること', async ({
      page,
    }) => {
      // Given
      const radio = page.getByRole('radiogroup').getByText('作者名');
      await radio.click();

      // When
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill('ひなた');

      // Then
      const bodyRows = page.getByRole('table').locator('tbody > tr');
      await expect(bodyRows.first()).toContainText('ヒナタ');
    });
  });

  test.describe('作品編集モーダル', () => {
    test.beforeEach(async ({ page }) => {
      // Given: 作品 ID で絞り込みが行われている状態
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill(BOOK_ID);
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      await bodyRows.first().waitFor();

      // Given: 作品詳細モーダルが表示されている状態
      await bodyRows.first().getByRole('button', { name: '詳細' }).click();
      await page.getByRole('dialog').waitFor();
    });

    test('作品編集モーダルが表示されていること', async ({ page }) => {
      // Then
      const details = page.getByRole('dialog').getByRole('region', { name: '作品詳細' });
      await waitForAllImagesToLoad(details, 1);
      await expect(details).toContainText(BOOK_NAME);
      await expect(details).toContainText(BOOK_DESC);
      await expect(details).toHaveScreenshot('vrt-book-detail-section.png');
    });

    test('作品のエピソード一覧が表示されていること', async ({ page }) => {
      // Then
      const table = page.getByRole('dialog').getByRole('table', { name: 'エピソード一覧' });
      const bodyRows = table.locator('tbody > tr');
      await expect(bodyRows.first()).toBeVisible();
      await expect(bodyRows.first()).toHaveScreenshot('vrt-episode-list.png');
    });

    test('編集ボタンをクリックして編集モードになっている状態で、作品のふりがなを変更して決定ボタンを押すと、ふりがなが変更されること', async ({
      page,
    }) => {
      // Given
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作品詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作品名（ふりがな）' }).fill('やがてあなたになる');
      await page.getByRole('dialog').getByRole('button', { name: '決定' }).click();

      // Then
      await expect(page.getByRole('dialog')).toContainText('やがてあなたになる');
    });

    test('編集ボタンをクリックして編集モードになっている状態で、作品のタイトルを変更して決定ボタンを押すと、タイトルが変更されること', async ({
      page,
    }) => {
      // Given
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作品詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      await page.getByRole('dialog').getByRole('textbox', { exact: true, name: '作品名' }).fill('やがてあなたになる');
      await page.getByRole('dialog').getByRole('button', { name: '決定' }).click();

      // Then
      await expect(page.getByRole('dialog')).toContainText('やがてあなたになる');
    });

    test('編集ボタンをクリックして編集モードになっている状態で、作品の概要を変更して決定ボタンを押すと、概要が変更されること', async ({
      page,
    }) => {
      // Given
      const replacement =
        '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。';
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作品詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '概要' }).fill(replacement);
      await page.getByRole('dialog').getByRole('button', { name: '決定' }).click();

      // Then
      await expect(page.getByRole('dialog')).toContainText(replacement);
    });

    test('編集ボタンをクリックして編集モードになっている状態で、作品の画像を変更して決定ボタンを押すと、画像が変更されること', async ({
      page,
    }) => {
      // Given
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作品詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作品の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.jpg'));
      await page.getByRole('dialog').getByRole('button', { name: '決定' }).click();

      // Then
      await waitForImageToLoad(page.getByRole('dialog').getByRole('img', { name: BOOK_NAME }));
    });

    test('編集ボタンをクリックして編集モードになっている状態で、作品名（ふりがな）、作品名、概要、画像に不正な値を入力すると、エラーメッセージが表示されること', async ({
      page,
    }) => {
      // Given
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作品詳細' })
        .getByRole('button', { name: '編集' })
        .click();

      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作品名（ふりがな）' }).fill('');
      await page.getByRole('dialog').getByRole('textbox', { exact: true, name: '作品名' }).fill('');
      await page.getByRole('dialog').getByRole('textbox', { name: '概要' }).fill('');
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作品の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.gif'));

      // Then
      await expect(page.getByRole('dialog').getByRole('alert')).toHaveText([
        '概要を入力してください',
        '対応していない画像形式です',
        '作品名のふりがなを入力してください',
        '作品名を入力してください',
      ]);

      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作品名（ふりがな）' }).fill('カタカナ');

      // Then
      await expect(page.getByRole('dialog').getByRole('alert')).toHaveText([
        '概要を入力してください',
        '対応していない画像形式です',
        '作品名のふりがなはひらがなで入力してください',
        '作品名を入力してください',
      ]);
    });

    test('削除ボタンをクリックすると、作品が削除されること', async ({ page }) => {
      // When
      await page
        .getByRole('dialog')
        .getByRole('region', { name: '作品詳細' })
        .getByRole('button', { name: '削除' })
        .click();

      // Then
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows).toHaveCount(0);
    });

    test('エピソードの編集ボタンを押すと、エピソード編集画面に遷移すること', async ({ page }) => {
      // When
      await page
        .getByRole('dialog')
        .getByRole('table', { name: 'エピソード一覧' })
        .getByRole('button', { name: '編集' })
        .first()
        .click();

      // Then
      await expect(page).toHaveURL(`/admin/books/${BOOK_ID}/episodes/${EPISODE_ID}`);
    });
  });

  test.describe('作品の追加', () => {
    test.beforeEach(async ({ page }) => {
      // Given: 作品の追加モーダルが表示されている状態
      await page.getByRole('button', { name: '作品を追加' }).click();
      await page.getByRole('dialog').waitFor();
    });

    test('必要な情報を入力して作成ボタンを押すと、作品が追加されて作品一覧に表示されること', async ({ page }) => {
      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作品名（ふりがな）' }).fill('やがてあなたになる');
      await page.getByRole('dialog').getByRole('textbox', { exact: true, name: '作品名' }).fill('やがてあなたになる');
      await page.getByRole('dialog').getByRole('combobox', { name: '作者' }).selectOption({ index: 1 });
      await page.getByRole('dialog').getByRole('combobox', { name: '更新曜日' }).selectOption({ index: 1 });
      await page
        .getByRole('dialog')
        .getByRole('textbox', { name: '概要' })
        .fill(
          '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。',
        );
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作品の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.jpg'));
      await page.getByRole('dialog').getByRole('button', { name: '作成' }).click();

      // Then
      const radio = page.getByRole('radiogroup').getByText('作品名');
      await radio.click();
      const searchbox = page.getByRole('textbox', { name: '条件を入力' });
      await searchbox.fill('やがてあなたになる');
      const bodyRows = page.getByRole('region', { name: '作品一覧' }).getByRole('table').locator('tbody > tr');
      await expect(bodyRows).toHaveCount(1);
      await expect(bodyRows).toContainText('やがてあなたになる');
    });

    test('作品名（ふりがな）、作品名、作者、更新曜日、概要、画像に不正な値を入力すると、エラーメッセージが表示されること', async ({
      page,
    }) => {
      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作品名（ふりがな）' }).fill('');
      await page.getByRole('dialog').getByRole('textbox', { exact: true, name: '作品名' }).fill('');
      await page.getByRole('dialog').getByRole('combobox', { name: '作者' }).focus();
      await page.getByRole('dialog').getByRole('combobox', { name: '作者' }).blur();
      await page.getByRole('dialog').getByRole('combobox', { name: '更新曜日' }).focus();
      await page.getByRole('dialog').getByRole('combobox', { name: '更新曜日' }).blur();
      await page.getByRole('dialog').getByRole('textbox', { name: '概要' }).fill('');
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('dialog').getByRole('button', { name: '作品の画像を選択' }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(path.join(__dirname, 'image.gif'));

      // Then
      await expect(page.getByRole('dialog').getByRole('alert')).toHaveText([
        '作者を選択してください',
        '概要を入力してください',
        '対応していない画像形式です',
        '作品名のふりがなを入力してください',
        '作品名を入力してください',
        '更新曜日を選択してください',
      ]);

      // When
      await page.getByRole('dialog').getByRole('textbox', { name: '作品名（ふりがな）' }).fill('カタカナ');

      // Then
      await expect(page.getByRole('dialog').getByRole('alert')).toHaveText([
        '作者を選択してください',
        '概要を入力してください',
        '対応していない画像形式です',
        '作品名のふりがなはひらがなで入力してください',
        '作品名を入力してください',
        '更新曜日を選択してください',
      ]);
    });
  });
});
