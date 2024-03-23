type Params = {
  format: 'avif' | 'webp' | 'png' | 'jpg' | 'jxl';
  height?: number;
  imageId: string;
  width?: number;
};

export function getImageUrl({ format, height, imageId, width }: Params): string {
  const url = new URL(`/images/${imageId}`, location.href);

  url.searchParams.set('format', format);
  if (width != null) {
    url.searchParams.set('width', `${width}`);
  }
  if (height != null) {
    url.searchParams.set('height', `${height}`);
  }

  return url.href;
}
