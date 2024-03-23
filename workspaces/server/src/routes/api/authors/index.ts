import { OpenAPIHono } from '@hono/zod-openapi';

import { deleteAuthorApp } from './deleteAuthor';
import { getAuthorApp } from './getAuthor';
import { getAuthorListApp } from './getAuthorList';
import { patchAuthorApp } from './patchAuthor';
import { postAuthorApp } from './postAuthor';

const app = new OpenAPIHono();

app.route('/', getAuthorApp);
app.route('/', getAuthorListApp);
app.route('/', postAuthorApp);
app.route('/', patchAuthorApp);
app.route('/', deleteAuthorApp);

export { app as authorApp };
