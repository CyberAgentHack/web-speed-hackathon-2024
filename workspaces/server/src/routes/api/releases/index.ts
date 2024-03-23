import { OpenAPIHono } from '@hono/zod-openapi';

import { getReleaseApp } from './getRelease';
import { getReleaseListApp } from './getReleaseList';

const app = new OpenAPIHono();

app.route('/', getReleaseApp);
app.route('/', getReleaseListApp);

export { app as releaseApp };
