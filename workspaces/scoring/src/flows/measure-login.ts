import { calculateFlowScore, measureFlow } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const meta = {
  max: 50,
  name: '[Admin] ログインする',
};

export const measureLogin = async (baseUrl: string): Promise<MeasureResult> => {
  await fetch(new URL('/api/v1/initialize', baseUrl));
  const url = new URL('/admin', baseUrl);

  try {
    console.group('Measuring login flow');
    const result = await measureFlow(url.href, async (page, flow) => {
      await flow.startTimespan();

      const emailTextBox = await page.waitForSelector('input[name="email"]');
      await emailTextBox!.type('administrator@example.com');
      const passwordTextBox = await page.waitForSelector('input[name="password"]');
      await passwordTextBox!.type('pa5sW0rd!');

      const button = await page.waitForSelector('button ::-p-text(ログイン)');
      await button!.focus();
      await button!.click();

      await page.waitForSelector('form h1 ::-p-text(ログアウト)');

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
