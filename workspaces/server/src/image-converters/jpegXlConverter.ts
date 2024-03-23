import fs from 'node:fs/promises';

const initializePromise = Promise.all([
  fs.readFile(require.resolve('@jsquash/jxl/codec/enc/jxl_enc.wasm')).then((wasmBinary) => {
    return import('@jsquash/jxl/encode.js').then(({ init }) => init(undefined, { wasmBinary }));
  }),
  fs.readFile(require.resolve('@jsquash/jxl/codec/dec/jxl_dec.wasm')).then((wasmBinary) => {
    return import('@jsquash/jxl/decode.js').then(({ init }) => init(undefined, { wasmBinary }));
  }),
]);

export const jpegXlConverter = {
  async decode(data: Uint8Array): Promise<ImageData> {
    await initializePromise;

    const JPEGXL = await import('@jsquash/jxl');
    return JPEGXL.decode(data);
  },
  async encode(data: ImageData): Promise<Uint8Array> {
    await initializePromise;

    const JPEGXL = await import('@jsquash/jxl');
    return JPEGXL.encode(data, {
      effort: 0,
      quality: 100,
    }).then((data) => new Uint8Array(data));
  },
};
