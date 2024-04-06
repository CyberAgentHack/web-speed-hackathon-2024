import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { calculateFlowScore, measureFlow } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOOK_ID = '29eeee80-c22e-4af7-83dd-d4de883f3d57';

const meta = {
  max: 50,
  name: '[Admin] 作品に新しいエピソードを追加する',
};

export const measureAddEpisode = async (baseUrl: string): Promise<MeasureResult> => {
  await fetch(new URL('/api/v1/initialize', baseUrl));
  const url = new URL('/admin', baseUrl);

  try {
    console.group('Measuring add episode flow');
    const result = await measureFlow(url.href, async (page, flow) => {
      const emailTextBox = await page.waitForSelector('input[name="email"]');
      await emailTextBox!.type('administrator@example.com');
      const passwordTextBox = await page.waitForSelector('input[name="password"]');
      await passwordTextBox!.type('pa5sW0rd!');

      const button = await page.waitForSelector('button ::-p-text(ログイン)');
      await button!.focus();
      await button!.click();

      await flow.navigate(new URL(`/admin/books/${BOOK_ID}/episodes/new`, baseUrl).href);

      await flow.startTimespan();

      const nameTextBox = await page.waitForSelector('input[name="name"]');
      await nameTextBox!.type('私は夜空に届かない');
      const nameRubyTextBox = await page.waitForSelector('input[name="nameRuby"]');
      await nameRubyTextBox!.type('わたしはよぞらにとどかない');
      const descriptionTextArea = await page.waitForSelector('textarea[name="description"]');
      await descriptionTextArea!.type(
        '図書館は、基本的人権のひとつとして知る自由をもつ国民に、資料と施設を提供することをもっとも重要な任務とする。',
      );
      const chapterTextBox = await page.waitForSelector('input[name="chapter"]');
      await chapterTextBox!.type('1');
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('button[aria-label="サムネイルの画像を選択"]'),
      ]);
      await fileChooser.accept([path.join(__dirname, '../assets/image.jpg')]);
      const submitButton = await page.waitForSelector('button ::-p-text(作成)');
      await submitButton!.click();

      await page.waitForSelector('h1 ::-p-text(エピソード編集)');

      await flow.endTimespan();
    });
    console.log('Result:', result);

    return {
      ...meta,
      score: calculateFlowScore(result),
      type: 'success',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      ...meta,
      reason: String(error),
      type: 'failure',
    };
  } finally {
    console.groupEnd();
  }
};
