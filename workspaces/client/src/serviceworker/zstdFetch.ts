import * as fzstd from 'fzstd';

export async function zstdFetch(request: Request): Promise<Response> {
  const originalResponse = await fetch(request, {
    headers: new Headers([...request.headers.entries(), ['X-Accept-Encoding', 'zstd']]),
  });

  const accept = originalResponse.headers.get('X-Content-Encoding');

  switch (accept) {
    case 'zstd': {
      const decompresser = new fzstd.Decompress();

      const transform = new TransformStream<Uint8Array, Uint8Array>({
        start(controller) {
          decompresser.ondata = (chunk) => {
            controller.enqueue(chunk);
          };
        },
        transform(chunk) {
          decompresser.push(chunk);
        },
      });

      const transformedResponse = new Response(originalResponse.body?.pipeThrough(transform), originalResponse);
      transformedResponse.headers.delete('X-Content-Encoding');
      return transformedResponse;
    }
    default: {
      return originalResponse;
    }
  }
}
