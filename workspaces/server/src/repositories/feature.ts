import { HTTPException } from 'hono/http-exception';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';

import type { GetFeatureListRequestQuery } from '@wsh-2024/schema/src/api/features/GetFeatureListRequestQuery';
import type { GetFeatureListResponse } from '@wsh-2024/schema/src/api/features/GetFeatureListResponse';

import { getDatabase } from '../database/drizzle';

type FeatureRepositoryInterface = {
  readAll(options: { query: GetFeatureListRequestQuery }): Promise<Result<GetFeatureListResponse, HTTPException>>;
};

class FeatureRepository implements FeatureRepositoryInterface {
  async readAll(options: {
    query: GetFeatureListRequestQuery;
  }): Promise<Result<GetFeatureListResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.feature.findMany({
        columns: {
          id: true,
        },
        limit: options.query.limit,
        offset: options.query.offset,
        orderBy(feature, { asc }) {
          return asc(feature.createdAt);
        },
        with: {
          book: {
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

      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to read feature list.` }));
    }
  }
}

export const featureRepository = new FeatureRepository();
