import { calculateFlowScore, measureFlow } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const meta = {
  max: 50,
  name: '[App] 利用規約を開く',
};

export const measureOpenTerms = async (baseUrl: string): Promise<MeasureResult> => {
  const url = new URL('/', baseUrl);

  try {
    console.group('Measuring open terms flow');
    const result = await measureFlow(url.href, async (page, flow) => {
      await flow.startTimespan();

      const button = await page.waitForSelector('button ::-p-text(利用規約)');
      await button!.click();
      await page.waitForSelector('section[role="dialog"] h2 ::-p-text(利用規約)');

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
