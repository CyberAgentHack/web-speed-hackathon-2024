import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';

import type { DeleteEpisodePageRequestParams } from '@wsh-2024/schema/src/api/episodePages/DeleteEpisodePageRequestParams';
import type { DeleteEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/DeleteEpisodePageResponse';
import type { GetEpisodePageListRequestQuery } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageListRequestQuery';
import type { GetEpisodePageListResponse } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageListResponse';
import type { GetEpisodePageRequestParams } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageRequestParams';
import type { GetEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/GetEpisodePageResponse';
import type { PatchEpisodePageRequestBody } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageRequestBody';
import type { PatchEpisodePageRequestParams } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageRequestParams';
import type { PatchEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/PatchEpisodePageResponse';
import type { PostEpisodePageRequestBody } from '@wsh-2024/schema/src/api/episodePages/PostEpisodePageRequestBody';
import type { PostEpisodePageResponse } from '@wsh-2024/schema/src/api/episodePages/PostEpisodePageResponse';
import { episodePage } from '@wsh-2024/schema/src/models';

import { getDatabase } from '../database/drizzle';

type EpisodePageRepositoryInterface = {
  create(options: { body: PostEpisodePageRequestBody }): Promise<Result<PostEpisodePageResponse, HTTPException>>;
  delete(options: {
    params: DeleteEpisodePageRequestParams;
  }): Promise<Result<DeleteEpisodePageResponse, HTTPException>>;
  read(options: { params: GetEpisodePageRequestParams }): Promise<Result<GetEpisodePageResponse, HTTPException>>;
  readAll(options: {
    query: GetEpisodePageListRequestQuery;
  }): Promise<Result<GetEpisodePageListResponse, HTTPException>>;
  update(options: {
    body: PatchEpisodePageRequestBody;
    params: PatchEpisodePageRequestParams;
  }): Promise<Result<PatchEpisodePageResponse, HTTPException>>;
};

class EpisodePageRepository implements EpisodePageRepositoryInterface {
  async read(options: { params: GetEpisodePageRequestParams }): Promise<Result<GetEpisodePageResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.episodePage.findFirst({
        columns: {
          id: true,
          page: true,
        },
        where(episodePage, { eq }) {
          return eq(episodePage.id, options.params.episodePageId);
        },
        with: {
          image: {
            columns: {
              alt: true,
              id: true,
            },
          },
        },
      });

      if (data == null) {
        throw new HTTPException(404, { message: `EpisodePage:${options.params.episodePageId} is not found` });
      }
      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(
        new HTTPException(500, { cause, message: `Failed to read episodePage:${options.params.episodePageId}.` }),
      );
    }
  }

  async readAll(options: {
    query: GetEpisodePageListRequestQuery;
  }): Promise<Result<GetEpisodePageListResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.episodePage.findMany({
        columns: {
          id: true,
          page: true,
        },
        limit: options.query.limit,
        offset: options.query.offset,
        orderBy(episodePage, { asc }) {
          return asc(episodePage.page);
        },
        where(episodePage, { eq }) {
          return eq(episodePage.episodeId, options.query.episodeId);
        },
        with: {
          image: {
            columns: {
              alt: true,
              id: true,
            },
          },
        },
      });

      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to read episodePage list.` }));
    }
  }

  async create(options: { body: PostEpisodePageRequestBody }): Promise<Result<PostEpisodePageResponse, HTTPException>> {
    try {
      const result = await getDatabase()
        .insert(episodePage)
        .values(options.body)
        .returning({ episodePageId: episodePage.id })
        .execute();

      if (result[0] == null) {
        throw new HTTPException(500, { message: 'Failed to create episodePage.' });
      }
      return this.read({
        params: {
          episodePageId: result[0].episodePageId,
        },
      });
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to create episodePage.` }));
    }
  }

  async update(options: {
    body: PatchEpisodePageRequestBody;
    params: PatchEpisodePageRequestParams;
  }): Promise<Result<PatchEpisodePageResponse, HTTPException>> {
    try {
      const result = await getDatabase()
        .update(episodePage)
        .set(options.body)
        .where(eq(episodePage.id, options.params.episodePageId))
        .returning({ episodePageId: episodePage.id })
        .execute();

      if (result[0] == null) {
        throw new HTTPException(500, { message: `Failed to update episodePage:${options.params.episodePageId}.` });
      }
      return this.read({
        params: {
          episodePageId: result[0].episodePageId,
        },
      });
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(
        new HTTPException(500, { cause, message: `Failed to update episodePage:${options.params.episodePageId}.` }),
      );
    }
  }

  async delete(options: {
    params: DeleteEpisodePageRequestParams;
  }): Promise<Result<DeleteEpisodePageResponse, HTTPException>> {
    try {
      await getDatabase().delete(episodePage).where(eq(episodePage.id, options.params.episodePageId)).execute();

      return ok({});
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(
        new HTTPException(500, { cause, message: `Failed to delete episodePage:${options.params.episodePageId}.` }),
      );
    }
  }
}

export const episodePageRepository = new EpisodePageRepository();
