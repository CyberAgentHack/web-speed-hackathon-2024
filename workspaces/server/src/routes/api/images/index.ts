import { OpenAPIHono } from '@hono/zod-openapi';

import { postImageApp } from './postImage';

const app = new OpenAPIHono();

app.route('/', postImageApp);

export { app as imageApp };
