import { OpenAPIHono } from '@hono/zod-openapi';

import { deleteBookApp } from './deleteBook';
import { getBookApp } from './getBook';
import { getBookListApp } from './getBookList';
import { patchBookApp } from './patchBook';
import { postBookApp } from './postBook';
import { getBookDetailApp } from './getBookDetail';

const app = new OpenAPIHono();

app.route('/', getBookApp);
app.route('/', getBookListApp);
app.route('/', postBookApp);
app.route('/', patchBookApp);
app.route('/', deleteBookApp);
app.route('/', getBookDetailApp);

export { app as bookApp };
