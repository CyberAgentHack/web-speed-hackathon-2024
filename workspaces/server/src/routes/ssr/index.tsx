import fs from 'node:fs/promises';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jsesc from 'jsesc';
import moment from 'moment-timezone';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { unstable_serialize } from 'swr';

import { featureApiClient } from '@wsh-2024/app/src/features/feature/apiClient/featureApiClient';
import { rankingApiClient } from '@wsh-2024/app/src/features/ranking/apiClient/rankingApiClient';
import { releaseApiClient } from '@wsh-2024/app/src/features/release/apiClient/releaseApiClient';
import { ClientApp } from '@wsh-2024/app/src/index';
import { getDayOfWeekStr } from '@wsh-2024/app/src/lib/date/getDayOfWeekStr';

import { INDEX_HTML_PATH } from '../../constants/paths';

const app = new Hono();

async function createInjectDataStr(): Promise<Record<string, unknown>> {
  const json: Record<string, unknown> = {};

  {
    const dayOfWeek = getDayOfWeekStr(moment());
    const releases = await releaseApiClient.fetch({ params: { dayOfWeek } });
    json[unstable_serialize(releaseApiClient.fetch$$key({ params: { dayOfWeek } }))] = releases;
  }

  {
    const features = await featureApiClient.fetchList({ query: {} });
    json[unstable_serialize(featureApiClient.fetchList$$key({ query: {} }))] = features;
  }

  {
    const ranking = await rankingApiClient.fetchList({ query: {} });
    json[unstable_serialize(rankingApiClient.fetchList$$key({ query: {} }))] = ranking;
  }

  return json;
}

async function createHTML({
  body,
  injectData,
  styleTags,
}: {
  body: string;
  injectData: Record<string, unknown>;
  styleTags: string;
}): Promise<string> {
  const htmlContent = await fs.readFile(INDEX_HTML_PATH, 'utf-8');

  const content = htmlContent
    .replaceAll('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replaceAll('<style id="tag"></style>', styleTags)
    .replaceAll(
      '<script id="inject-data" type="application/json"></script>',
      `<script id="inject-data" type="application/json">
        ${jsesc(injectData, {
          isScriptContext: true,
          json: true,
          minimal: true,
        })}
      </script>`,
    );

  return content;
}

app.get('*', async (c) => {
  const injectData = await createInjectDataStr();
  const sheet = new ServerStyleSheet();

  try {
    const body = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <StaticRouter location={c.req.path}>
          <ClientApp />
        </StaticRouter>,
      ),
    );

    const styleTags = sheet.getStyleTags();
    const html = await createHTML({ body, injectData, styleTags });

    return c.html(html);
  } catch (cause) {
    throw new HTTPException(500, { cause, message: 'SSR error.' });
  } finally {
    sheet.seal();
  }
});

export { app as ssrApp };
