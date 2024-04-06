import { calculatePageScore, measurePage } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const meta = {
  max: 100,
  name: '[App] ホームを開く',
};

export const measureHome = async (baseUrl: string): Promise<MeasureResult> => {
  const url = new URL('/', baseUrl);

  try {
    console.group('Measuring home page');
    const result = await measurePage(url.href);
    console.log('Result:', result);

    return {
      ...meta,
      score: calculatePageScore(result),
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
