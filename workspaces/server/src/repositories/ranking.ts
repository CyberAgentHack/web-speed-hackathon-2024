import { HTTPException } from 'hono/http-exception';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';

import type { GetRankingListRequestQuery } from '@wsh-2024/schema/src/api/rankings/GetRankingListRequestQuery';
import type { GetRankingListResponse } from '@wsh-2024/schema/src/api/rankings/GetRankingListResponse';

import { getDatabase } from '../database/drizzle';

type RankingRepositoryInterface = {
  readAll(options: { query: GetRankingListRequestQuery }): Promise<Result<GetRankingListResponse, HTTPException>>;
};

class RankingRepository implements RankingRepositoryInterface {
  async readAll(options: {
    query: GetRankingListRequestQuery;
  }): Promise<Result<GetRankingListResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.ranking.findMany({
        columns: {
          id: true,
          rank: true,
        },
        limit: options.query.limit,
        offset: options.query.offset,
        orderBy(ranking, { asc }) {
          return asc(ranking.rank);
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
      return err(new HTTPException(500, { cause, message: `Failed to read ranking list.` }));
    }
  }
}

export const rankingRepository = new RankingRepository();
