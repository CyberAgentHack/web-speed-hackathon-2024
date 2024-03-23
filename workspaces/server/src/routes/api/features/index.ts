import { OpenAPIHono } from '@hono/zod-openapi';

import { getFeatureListApp } from './getFeatureList';

const app = new OpenAPIHono();

app.route('/', getFeatureListApp);

export { app as featureApp };
