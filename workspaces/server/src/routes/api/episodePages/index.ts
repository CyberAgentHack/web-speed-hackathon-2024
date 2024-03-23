import { OpenAPIHono } from '@hono/zod-openapi';

import { deleteEpisodePageApp } from './deleteEpisodePage';
import { getEpisodePageApp } from './getEpisodePage';
import { getEpisodePageListApp } from './getEpisodePageList';
import { patchEpisodePageApp } from './patchEpisodePage';
import { postEpisodePageApp } from './postEpisodePage';

const app = new OpenAPIHono();

app.route('/', getEpisodePageApp);
app.route('/', getEpisodePageListApp);
app.route('/', postEpisodePageApp);
app.route('/', patchEpisodePageApp);
app.route('/', deleteEpisodePageApp);

export { app as episodePageApp };
