import { fileTypeFromBuffer } from 'file-type';
import { Magika } from 'magika';

const SUPPORTED_MAGIKA_LABEL_LIST = ['bmp', 'jpeg', 'png', 'webp'];
const SUPPORTED_MIME_TYPE_LIST = ['image/bmp', 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jxl'];

const magika = new Magika();

const initMagikaPromise = magika.load({
  configURL: '/assets/magika/config.json',
  modelURL: '/assets/magika/model.json',
});

export async function isSupportedImage(image: File): Promise<boolean> {
  await initMagikaPromise;
  const prediction = await magika.identifyBytes(new Uint8Array(await image.arrayBuffer()));

  if (SUPPORTED_MAGIKA_LABEL_LIST.includes(prediction.label)) {
    return true;
  }

  const fileType = await fileTypeFromBuffer(await image.arrayBuffer());
  if (SUPPORTED_MIME_TYPE_LIST.includes(fileType?.mime ?? '')) {
    return true;
  }

  return false;
}
