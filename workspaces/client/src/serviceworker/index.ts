/// <reference types="@types/serviceworker" />

import { transformJpegXLToBmp } from './transformJpegXLToBmp';
import { zstdFetch as fetch } from './zstdFetch';

self.addEventListener('install', (ev: ExtendableEvent) => {
  ev.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (ev: ExtendableEvent) => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (ev: FetchEvent) => {
  ev.respondWith(
    onFetch(ev.request)
  );
});

async function onFetch(request: Request): Promise<Response> {
  const res = await fetch(request);

  if (res.headers.get('Content-Type') === 'image/jxl') {
    return transformJpegXLToBmp(res);
  } else {
    return res;
  }
}
