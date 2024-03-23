import { expect, test } from '@playwright/test';

test.describe('認証', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('/api/v1/initialize');
  });

  test.describe('非ログイン', () => {
    const pages = [
      { name: '作者一覧', path: '/admin/authors' },
      { name: '作品一覧', path: '/admin/books' },
    ];

    for (const { name, path } of pages) {
      test(`「${name}」へアクセスしたとき、ログイン画面へリダイレクトされること`, async ({ page }) => {
        // When
        await page.goto(path);

        // Then
        await expect(page).toHaveURL('/admin');
      });
    }
  });

  test.describe('ログイン', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin');
    });

    test('正しいメールアドレスとパスワードが入力されている状態で、ログインボタンをクリックしたとき、ログアウトフォームが表示されること', async ({
      page,
    }) => {
      // Given
      const emailTextbox = page.getByRole('textbox', { name: 'メールアドレス' });
      await emailTextbox.fill('administrator@example.com');
      const passwordTextbox = page.getByRole('textbox', { name: 'パスワード' });
      await passwordTextbox.fill('pa5sW0rd!');

      // When
      const button = page.getByRole('button', { name: 'ログイン' });
      await button.click();

      // Then
      const form = page.getByRole('form', { name: 'ログアウト' });
      await expect(form).toBeVisible();
      await expect(form).toHaveScreenshot('vrt-logout-form.png');
    });

    test('不正なメールアドレスを入力したとき、エラーメッセージが表示されること', async ({ page }) => {
      // When
      const form = page.getByRole('form', { name: 'ログイン' });
      const textbox = form.getByRole('textbox', { name: 'メールアドレス' });
      await textbox.focus();
      await textbox.fill('');
      await textbox.blur();

      // Then
      await expect(form.getByRole('alert')).toHaveText('メールアドレスを入力してください');

      // When
      await textbox.focus();
      await textbox.fill('invalid');
      await textbox.blur();

      // Then
      await expect(form.getByRole('alert')).toHaveText('メールアドレスには @ を含めてください');
    });

    test('不正なパスワードを入力したとき、エラーメッセージが表示されること', async ({ page }) => {
      // When
      const form = page.getByRole('form', { name: 'ログイン' });
      const textbox = form.getByRole('textbox', { name: 'パスワード' });
      await textbox.focus();
      await textbox.fill('');
      await textbox.blur();

      // Then
      await expect(form.getByRole('alert')).toHaveText('パスワードを入力してください');

      // When
      await textbox.focus();
      await textbox.fill('invalid');
      await textbox.blur();

      // Then
      await expect(form.getByRole('alert')).toHaveText('パスワードには記号を含めてください');
    });

    test('間違ったメールアドレスとパスワードが入力されている状態で、ログインボタンをクリックすると、ログアウトフォームが表示されないこと', async ({
      page,
    }) => {
      // Given
      const emailTextbox = page.getByRole('textbox', { name: 'メールアドレス' });
      await emailTextbox.fill('wrong@example.com');
      const passwordTextbox = page.getByRole('textbox', { name: 'パスワード' });
      await passwordTextbox.fill('wrong');

      // When
      const button = page.getByRole('button', { name: 'ログイン' });
      await button.click();

      // Then
      const form = page.getByRole('form', { name: 'ログアウト' });
      await expect(form).not.toBeVisible();
    });
  });

  test.describe('ログアウト', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin');
    });

    test('ログイン状態で、ログアウトボタンをクリックすると、ログインフォームが表示されること', async ({ page }) => {
      // Given
      const emailTextbox = page.getByRole('textbox', { name: 'メールアドレス' });
      await emailTextbox.fill('administrator@example.com');
      const passwordTextbox = page.getByRole('textbox', { name: 'パスワード' });
      await passwordTextbox.fill('pa5sW0rd!');
      const loginButton = page.getByRole('button', { name: 'ログイン' });
      await loginButton.click();

      // When
      const logoutButton = page.getByRole('button', { name: 'ログアウト' });
      await logoutButton.click();

      // Then
      const form = page.getByRole('form', { name: 'ログイン' });
      await expect(form).toBeVisible();
      await expect(form).toHaveScreenshot('vrt-login-form.png');
    });
  });
});
