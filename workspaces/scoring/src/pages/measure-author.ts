import { calculatePageScore, measurePage } from '../helpers';
import type { MeasureResult } from '../types/measure-result';

const AUTHOR_ID = '2ab0aca5-7dc2-4543-ac98-e23fdaca0739';

const meta = {
  max: 100,
  name: '[App] 作者詳細を開く',
};

export const measureAuthor = async (baseUrl: string): Promise<MeasureResult> => {
  const url = new URL(`/authors/${AUTHOR_ID}`, baseUrl);

  try {
    console.group('Measuring author details page');
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
