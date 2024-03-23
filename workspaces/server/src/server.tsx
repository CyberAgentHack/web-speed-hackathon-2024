import { serve } from '@hono/node-server';

import { seeding } from './database/seed';
import { app } from './routes';

async function main() {
  await seeding();

  serve({ fetch: app.fetch, port: Number(process.env['PORT']) || 8000 }, (info) => {
    console.log(`listening on ${info.address}:${info.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
