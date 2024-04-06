import { calculateFlowScore, measureFlow } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const meta = {
  max: 50,
  name: '[App] 作品を検索する',
};

export const measureSearchBook = async (baseUrl: string): Promise<MeasureResult> => {
  const url = new URL('/search', baseUrl);

  try {
    console.group('Measuring search book flow');
    const result = await measureFlow(url.href, async (page, flow) => {
      await flow.startTimespan();

      const searchBox = await page.waitForSelector('input[placeholder="作品名を入力"]');
      await searchBox!.type('日常');
      await searchBox!.press('Enter');
      await page.waitForSelector('a[href="/books/6a94cefd-e7dd-42a9-8c25-c2ff1a58950b"]');

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
