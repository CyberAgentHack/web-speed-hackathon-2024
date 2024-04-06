import { calculateFlowScore, measureFlow } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const BOOK_ID = '670abeed-7c82-4d7a-a997-cd86c362b9b8';
const EPISODE_ID = 'fe2c26de-6bf7-4564-a4dc-d0b88cba8b22';

const meta = {
  max: 50,
  name: '[App] 漫画をスクロールして読む',
};

export const measureReadBook = async (baseUrl: string): Promise<MeasureResult> => {
  const url = new URL(`/books/${BOOK_ID}/episodes/${EPISODE_ID}`, baseUrl);

  try {
    console.group('Measuring read book flow');
    const result = await measureFlow(url.href, async (page, flow) => {
      await flow.startTimespan();

      const viewer = await page.waitForSelector('section[aria-label="漫画ビューアー"]');
      const box = await viewer!.boundingBox();
      const start = { x: box!.x + 10, y: box!.y + 100 };
      const deltaX = box!.width - 100;
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(start.x + deltaX, 0, { steps: 3 });
      await page.mouse.up();

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
