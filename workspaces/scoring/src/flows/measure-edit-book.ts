import { calculateFlowScore, measureFlow } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const meta = {
  max: 50,
  name: '[Admin] 作品の情報を編集する',
};

export const measureEditBook = async (baseUrl: string): Promise<MeasureResult> => {
  await fetch(new URL('/api/v1/initialize', baseUrl));
  const url = new URL('/admin', baseUrl);

  try {
    console.group('Measuring edit book flow');
    const result = await measureFlow(url.href, async (page, flow) => {
      const emailTextBox = await page.waitForSelector('input[name="email"]');
      await emailTextBox!.type('administrator@example.com');
      const passwordTextBox = await page.waitForSelector('input[name="password"]');
      await passwordTextBox!.type('pa5sW0rd!');

      const button = await page.waitForSelector('button ::-p-text(ログイン)');
      await button!.focus();
      await button!.click();

      await flow.navigate(new URL('/admin/books', baseUrl).href);

      await flow.startTimespan();

      const detailsButton = await page.waitForSelector('button ::-p-text(詳細)');
      await detailsButton!.click();
      const editButton = await page.waitForSelector('section[aria-label="作品詳細"] button ::-p-text(編集)');
      await editButton!.click();

      const titleTextBox = await page.waitForSelector('input[name="nameRuby"]');
      await titleTextBox!.evaluate((element) => (element.value = ''));
      await titleTextBox!.type('やがてあなたになる');
      const submitButton = await page.waitForSelector('button ::-p-text(決定)');
      await submitButton!.click();

      await page.waitForSelector('section[aria-label="作品詳細"] ::-p-text(やがてあなたになる)');

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
