import { HTTPException } from 'hono/http-exception';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';

import type { GetReleaseListResponse } from '@wsh-2024/schema/src/api/releases/GetReleaseListResponse';
import type { GetReleaseRequestParams } from '@wsh-2024/schema/src/api/releases/GetReleaseRequestParams';
import type { GetReleaseResponse } from '@wsh-2024/schema/src/api/releases/GetReleaseResponse';

import { getDatabase } from '../database/drizzle';

type ReleaseRepositoryInterface = {
  read(options: { params: GetReleaseRequestParams }): Promise<Result<GetReleaseResponse, HTTPException>>;
  readAll(): Promise<Result<GetReleaseListResponse, HTTPException>>;
};

class ReleaseRepository implements ReleaseRepositoryInterface {
  async readAll(): Promise<Result<GetReleaseListResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.release.findMany({
        columns: {
          dayOfWeek: true,
          id: true,
        },
      });

      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to read releases.` }));
    }
  }

  async read(options: { params: GetReleaseRequestParams }): Promise<Result<GetReleaseResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.release.findFirst({
        columns: {
          dayOfWeek: true,
          id: true,
        },
        where(release, { eq }) {
          return eq(release.dayOfWeek, options.params.dayOfWeek);
        },
        with: {
          books: {
            columns: {
              description: true,
              id: true,
              name: true,
            },
            with: {
              author: {
                columns: {
                  description: true,
                  id: true,
                  name: true,
                },
                with: {
                  image: {
                    columns: {
                      alt: true,
                      id: true,
                    },
                  },
                },
              },
              episodes: {
                columns: {
                  chapter: true,
                  description: true,
                  id: true,
                  name: true,
                },
              },
              image: {
                columns: {
                  alt: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      if (data == null) {
        throw new HTTPException(404, { message: `Release:${options.params.dayOfWeek} is not found` });
      }
      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to read release:${options.params.dayOfWeek}.` }));
    }
  }
}

export const releaseRepository = new ReleaseRepository();
