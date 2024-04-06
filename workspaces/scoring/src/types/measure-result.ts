export type MeasureSuccess = {
  max: number;
  name: string;
  score: number;
  type: 'success';
};

export type MeasureFailure = {
  max: number;
  name: string;
  reason: string;
  type: 'failure';
};

export type MeasureResult = MeasureSuccess | MeasureFailure;
