export type ConverterInterface = {
  decode(data: Uint8Array): Promise<ImageData>;
  encode(data: ImageData): Promise<Uint8Array>;
};
