import { CanvasKitPromise } from './CanvasKitPromise';

export async function createCanvasContext({
  height,
  width,
}: {
  height: number;
  width: number;
}): Promise<CanvasRenderingContext2D> {
  const CanvasKit = await CanvasKitPromise;

  const canvas = CanvasKit.MakeCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (ctx == null) {
    throw new Error('Failed to create canvas context');
  }

  return ctx;
}
