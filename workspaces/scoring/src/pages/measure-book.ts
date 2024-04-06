import { calculatePageScore, measurePage } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const BOOK_ID = 'af7583e6-e52e-4f28-86dd-04f0af9d4868';

const meta = {
  max: 100,
  name: '[App] 作品詳細を開く',
};

export const measureBook = async (baseUrl: string): Promise<MeasureResult> => {
  const url = new URL(`/books/${BOOK_ID}`, baseUrl);

  try {
    console.group('Measuring book details page');
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
