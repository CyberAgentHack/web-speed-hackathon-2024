import { OpenAPIHono } from '@hono/zod-openapi';

import { getRankingListApp } from './getRankingList';

const app = new OpenAPIHono();

app.route('/', getRankingListApp);

export { app as rankingApp };
