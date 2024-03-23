import { OpenAPIHono } from '@hono/zod-openapi';

import { loginApp } from './login';
import { logoutApp } from './logout';
import { userApp } from './user';

const app = new OpenAPIHono();

app.route('/', loginApp);
app.route('/', logoutApp);
app.route('/', userApp);

export { app as authApp };
