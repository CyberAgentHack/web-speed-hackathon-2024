import { writeFile } from 'node:fs/promises';

import { defineCommand, runMain } from 'citty';

import { measureAddEpisode } from './flows/measure-add-episode';
import { measureEditBook } from './flows/measure-edit-book';
import { measureLogin } from './flows/measure-login';
import { measureOpenTerms } from './flows/measure-open-terms';
import { measureReadBook } from './flows/measure-read-book';
import { measureSearchBook } from './flows/measure-search-book';
import { measureAuthor } from './pages/measure-author';
import { measureBook } from './pages/measure-book';
import { measureEpisode } from './pages/measure-episode';
import { measureHome } from './pages/measure-home';

const main = defineCommand({
  args: {
    out: {
      required: true,
      type: 'string',
    },
    url: {
      required: true,
      type: 'string',
    },
  },
  run: async ({ args }) => {
    const results = [
      await measureHome(args.url),
      await measureAuthor(args.url),
      await measureBook(args.url),
      await measureEpisode(args.url),
      await measureSearchBook(args.url),
      await measureReadBook(args.url),
      await measureOpenTerms(args.url),
      await measureLogin(args.url),
      await measureEditBook(args.url),
      await measureAddEpisode(args.url),
    ];

    const max = results.reduce((previous, result) => previous + (result.max || 0), 0);
    const total = results.reduce((previous, result) => {
      return previous + ((result.type === 'success' && result.score) || 0);
    }, 0);

    await writeFile(args.out, JSON.stringify({ max, results, total }));
  },
});

void runMain(main);
