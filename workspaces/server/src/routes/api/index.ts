import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { authApp } from './auth';
import { authorApp } from './authors';
import { bookApp } from './books';
import { episodePageApp } from './episodePages';
import { episodeApp } from './episodes';
import { featureApp } from './features';
import { imageApp } from './images';
import { internalApp } from './internal';
import { rankingApp } from './rankings';
import { releaseApp } from './releases';

const app = new OpenAPIHono();

app.doc31('/api/v1/specification', {
  info: {
    title: 'API Docs',
    version: '1.0.0',
  },
  openapi: '3.1.0',
});
app.get(
  '/api/v1',
  swaggerUI({
    url: '/api/v1/specification',
  }),
);

app.route('/', authorApp);
app.route('/', episodeApp);
app.route('/', bookApp);
app.route('/', episodePageApp);
app.route('/', imageApp);
app.route('/', featureApp);
app.route('/', releaseApp);
app.route('/', rankingApp);
app.route('/', authApp);

app.route('/', internalApp);

export { app as apiApp };
