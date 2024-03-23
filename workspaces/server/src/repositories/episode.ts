import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';

import type { DeleteEpisodeRequestParams } from '@wsh-2024/schema/src/api/episodes/DeleteEpisodeRequestParams';
import type { DeleteEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/DeleteEpisodeResponse';
import type { GetEpisodeListRequestQuery } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListRequestQuery';
import type { GetEpisodeListResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListResponse';
import type { GetEpisodeRequestParams } from '@wsh-2024/schema/src/api/episodes/GetEpisodeRequestParams';
import type { GetEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeResponse';
import type { PatchEpisodeRequestBody } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeRequestBody';
import type { PatchEpisodeRequestParams } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeRequestParams';
import type { PatchEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/PatchEpisodeResponse';
import type { PostEpisodeRequestBody } from '@wsh-2024/schema/src/api/episodes/PostEpisodeRequestBody';
import type { PostEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/PostEpisodeResponse';
import { episode, episodePage } from '@wsh-2024/schema/src/models';

import { getDatabase } from '../database/drizzle';

type EpisodeRepositoryInterface = {
  create(options: { body: PostEpisodeRequestBody }): Promise<Result<PostEpisodeResponse, HTTPException>>;
  delete(options: { params: DeleteEpisodeRequestParams }): Promise<Result<DeleteEpisodeResponse, HTTPException>>;
  read(options: { params: GetEpisodeRequestParams }): Promise<Result<GetEpisodeResponse, HTTPException>>;
  readAll(options: { query: GetEpisodeListRequestQuery }): Promise<Result<GetEpisodeListResponse, HTTPException>>;
  update(options: {
    body: PatchEpisodeRequestBody;
    params: PatchEpisodeRequestParams;
  }): Promise<Result<PatchEpisodeResponse, HTTPException>>;
};

class EpisodeRepository implements EpisodeRepositoryInterface {
  async read(options: { params: GetEpisodeRequestParams }): Promise<Result<GetEpisodeResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.episode.findFirst({
        columns: {
          chapter: true,
          description: true,
          id: true,
          name: true,
          nameRuby: true,
        },
        where(episode, { eq }) {
          return eq(episode.id, options.params.episodeId);
        },
        with: {
          book: {
            columns: {
              description: true,
              id: true,
              name: true,
              nameRuby: true,
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
          image: {
            columns: {
              alt: true,
              id: true,
            },
          },
          pages: {
            columns: {
              id: true,
              page: true,
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
        },
      });

      if (data == null) {
        throw new HTTPException(404, { message: `Episode:${options.params.episodeId} is not found` });
      }
      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to read episode:${options.params.episodeId}.` }));
    }
  }

  async readAll(options: {
    query: GetEpisodeListRequestQuery;
  }): Promise<Result<GetEpisodeListResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.episode.findMany({
        columns: {
          chapter: true,
          description: true,
          id: true,
          name: true,
          nameRuby: true,
        },
        limit: options.query.limit,
        offset: options.query.offset,
        orderBy(episode, { asc }) {
          return asc(episode.chapter);
        },
        where(episode, { eq }) {
          return eq(episode.bookId, options.query.bookId);
        },
        with: {
          book: {
            columns: {
              description: true,
              id: true,
              name: true,
              nameRuby: true,
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
          image: {
            columns: {
              alt: true,
              id: true,
            },
          },
          pages: {
            columns: {
              id: true,
              page: true,
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
        },
      });

      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to read episode list.` }));
    }
  }

  async create(options: { body: PostEpisodeRequestBody }): Promise<Result<PostEpisodeResponse, HTTPException>> {
    try {
      const result = await getDatabase()
        .insert(episode)
        .values(options.body)
        .returning({ episodeId: episode.id })
        .execute();

      if (result[0] == null) {
        throw new HTTPException(500, { message: 'Failed to create episode.' });
      }
      return this.read({
        params: {
          episodeId: result[0].episodeId,
        },
      });
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to create episode.` }));
    }
  }

  async update(options: {
    body: PatchEpisodeRequestBody;
    params: PatchEpisodeRequestParams;
  }): Promise<Result<PatchEpisodeResponse, HTTPException>> {
    try {
      const result = await getDatabase()
        .update(episode)
        .set(options.body)
        .where(eq(episode.id, options.params.episodeId))
        .returning({ episodeId: episode.id })
        .execute();

      if (result[0] == null) {
        throw new HTTPException(500, { message: `Failed to update episode:${options.params.episodeId}.` });
      }
      return this.read({
        params: {
          episodeId: result[0].episodeId,
        },
      });
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to update episode:${options.params.episodeId}.` }));
    }
  }

  async delete(options: { params: DeleteEpisodeRequestParams }): Promise<Result<DeleteEpisodeResponse, HTTPException>> {
    try {
      await getDatabase().transaction(async (tx) => {
        await tx.delete(episode).where(eq(episode.id, options.params.episodeId)).execute();
        await tx.delete(episodePage).where(eq(episodePage.episodeId, options.params.episodeId)).execute();
      });

      return ok({});
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to delete episode:${options.params.episodeId}.` }));
    }
  }
}

export const episodeRepository = new EpisodeRepository();
