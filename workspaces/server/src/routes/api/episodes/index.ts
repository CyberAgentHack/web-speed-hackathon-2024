import { OpenAPIHono } from '@hono/zod-openapi';

import { deleteEpisodeApp } from './deleteEpisode';
import { getEpisodeApp } from './getEpisode';
import { getEpisodeListApp } from './getEpisodeList';
import { patchEpisodeApp } from './patchEpisode';
import { postEpisodeApp } from './postEpisode';

const app = new OpenAPIHono();

app.route('/', getEpisodeApp);
app.route('/', getEpisodeListApp);
app.route('/', postEpisodeApp);
app.route('/', patchEpisodeApp);
app.route('/', deleteEpisodeApp);

export { app as episodeApp };
