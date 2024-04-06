import { calculatePageScore, measurePage } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const BOOK_ID = '670abeed-7c82-4d7a-a997-cd86c362b9b8';
const EPISODE_ID = 'fe2c26de-6bf7-4564-a4dc-d0b88cba8b22';

const meta = {
  max: 100,
  name: '[App] エピソード詳細を開く',
};

export const measureEpisode = async (baseUrl: string): Promise<MeasureResult> => {
  const url = new URL(`/books/${BOOK_ID}/episodes/${EPISODE_ID}`, baseUrl);

  try {
    console.group('Measuring episode details page');
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
