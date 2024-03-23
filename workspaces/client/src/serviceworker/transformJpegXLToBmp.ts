// @ts-expect-error - This is a workaround for the missing type definition
import jsquashWasmBinary from '@jsquash/jxl/codec/dec/jxl_dec.wasm';
import { init as jsquashInit } from '@jsquash/jxl/decode';
import 'jimp';

declare const Jimp: typeof import('jimp');

export async function transformJpegXLToBmp(response: Response): Promise<Response> {
  const { decode } = await jsquashInit(undefined, {
    locateFile: () => {},
    wasmBinary: jsquashWasmBinary,
  });

  const imageData = decode(await response.arrayBuffer())!;
  const bmpBinary = await new Jimp(imageData).getBufferAsync(Jimp.MIME_BMP);

  return new Response(bmpBinary, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'image/bmp',
    },
  });
}
