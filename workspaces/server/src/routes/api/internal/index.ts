import { OpenAPIHono } from '@hono/zod-openapi';

import { initializeApp } from './initialize';

const app = new OpenAPIHono();

app.route('/', initializeApp);

export { app as internalApp };
