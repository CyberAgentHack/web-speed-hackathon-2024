import { CanvasKitPromise } from './CanvasKitPromise';

export async function createImageFromImageData(imageData: ImageData): Promise<CanvasImageSource> {
  const CanvasKit = await CanvasKitPromise;

  const image = CanvasKit.MakeImage(
    {
      alphaType: CanvasKit.AlphaType.Unpremul,
      colorSpace: CanvasKit.ColorSpace.SRGB,
      colorType: CanvasKit.ColorType.RGBA_8888,
      height: imageData.height,
      width: imageData.width,
    },
    imageData.data,
    imageData.width * 4,
  );

  if (image == null) {
    throw new Error('Failed to create image from image data');
  }

  return image as unknown as CanvasImageSource;
}
