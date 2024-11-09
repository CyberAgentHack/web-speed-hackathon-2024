import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { err, ok } from 'neverthrow';
import type { Result } from 'neverthrow';

import type { DeleteBookRequestParams } from '@wsh-2024/schema/src/api/books/DeleteBookRequestParams';
import type { DeleteBookResponse } from '@wsh-2024/schema/src/api/books/DeleteBookResponse';
import type { GetBookListRequestQuery } from '@wsh-2024/schema/src/api/books/GetBookListRequestQuery';
import type { GetBookListResponse } from '@wsh-2024/schema/src/api/books/GetBookListResponse';
import type { GetBookRequestParams } from '@wsh-2024/schema/src/api/books/GetBookRequestParams';
import type { GetBookResponse } from '@wsh-2024/schema/src/api/books/GetBookResponse';
import type { PatchBookRequestBody } from '@wsh-2024/schema/src/api/books/PatchBookRequestBody';
import type { PatchBookRequestParams } from '@wsh-2024/schema/src/api/books/PatchBookRequestParams';
import type { PatchBookResponse } from '@wsh-2024/schema/src/api/books/PatchBookResponse';
import type { PostBookRequestBody } from '@wsh-2024/schema/src/api/books/PostBookRequestBody';
import type { PostBookResponse } from '@wsh-2024/schema/src/api/books/PostBookResponse';
import { author, book, episode, episodePage, feature, ranking } from '@wsh-2024/schema/src/models';

import { getDatabase } from '../database/drizzle';

type BookRepositoryInterface = {
  create(options: { body: PostBookRequestBody }): Promise<Result<PostBookResponse, HTTPException>>;
  delete(options: { params: DeleteBookRequestParams }): Promise<Result<DeleteBookResponse, HTTPException>>;
  read(options: { params: GetBookRequestParams }): Promise<Result<GetBookResponse, HTTPException>>;
  readAll(options: { query: GetBookListRequestQuery }): Promise<Result<GetBookListResponse, HTTPException>>;
  update(options: {
    body: PatchBookRequestBody;
    params: PatchBookRequestParams;
  }): Promise<Result<PatchBookResponse, HTTPException>>;
};

class BookRepository implements BookRepositoryInterface {
  async read(options: { params: GetBookRequestParams }): Promise<Result<GetBookResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.book.findFirst({
        columns: {
          description: true,
          id: true,
          name: true,
          nameRuby: true,
        },
        where(book, { eq }) {
          return eq(book.id, options.params.bookId);
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
              id: true,
            },
          },
          image: {
            columns: {
              alt: true,
              id: true,
            },
          },
        },
      });

      if (data == null) {
        throw new HTTPException(404, { message: `Book:${options.params.bookId} is not found` });
      }
      return ok(data);
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to read book:${options.params.bookId}.` }));
    }
  }

  async readAll(options: { query: GetBookListRequestQuery }): Promise<Result<GetBookListResponse, HTTPException>> {
    try {
      const data = await getDatabase().query.book.findMany({
        columns: {
          description: true,
          id: true,
          name: true,
          nameRuby: true,
        },
        limit: options.query.limit,
        offset: options.query.offset,
        orderBy(book, { asc }) {
          return asc(book.createdAt);
        },
        where(book, { eq, like }) {
          if (options.query.authorId != null) {
            return eq(book.authorId, options.query.authorId);
          }
          if (options.query.authorName != null) {
            return like(author.name, `%${options.query.authorName}%`);
          }
          if (options.query.name != null) {
            return like(book.name, `%${options.query.name}%`);
          }
          return;
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
              id: true,
            },
          },
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
      return err(new HTTPException(500, { cause, message: `Failed to read book list.` }));
    }
  }

  async create(options: { body: PostBookRequestBody }): Promise<Result<PostBookResponse, HTTPException>> {
    try {
      const result = await getDatabase().insert(book).values(options.body).returning({ bookId: book.id }).execute();

      if (result[0] == null) {
        throw new HTTPException(500, { message: 'Failed to create book.' });
      }
      return this.read({
        params: {
          bookId: result[0].bookId,
        },
      });
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to create book.` }));
    }
  }

  async update(options: {
    body: PatchBookRequestBody;
    params: PatchBookRequestParams;
  }): Promise<Result<PatchBookResponse, HTTPException>> {
    try {
      const result = await getDatabase()
        .update(book)
        .set(options.body)
        .where(eq(book.id, options.params.bookId))
        .returning({ bookId: book.id })
        .execute();

      if (result[0] == null) {
        throw new HTTPException(500, { message: `Failed to update book:${options.params.bookId}.` });
      }
      return this.read({
        params: {
          bookId: result[0].bookId,
        },
      });
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to update book:${options.params.bookId}.` }));
    }
  }

  async delete(options: { params: DeleteBookRequestParams }): Promise<Result<DeleteBookResponse, HTTPException>> {
    try {
      getDatabase().transaction(async (tx) => {
        await tx.delete(book).where(eq(book.id, options.params.bookId)).execute();
        await tx.delete(feature).where(eq(feature.bookId, options.params.bookId)).execute();
        await tx.delete(ranking).where(eq(ranking.bookId, options.params.bookId)).execute();
        const deleteEpisodeRes = await tx
          .delete(episode)
          .where(eq(episode.bookId, options.params.bookId))
          .returning({
            episodeId: episode.id,
          })
          .execute();
        for (const episode of deleteEpisodeRes) {
          await tx.delete(episodePage).where(eq(episodePage.episodeId, episode.episodeId)).execute();
        }
      });

      return ok({});
    } catch (cause) {
      if (cause instanceof HTTPException) {
        return err(cause);
      }
      return err(new HTTPException(500, { cause, message: `Failed to delete book:${options.params.bookId}.` }));
    }
  }
}

export const bookRepository = new BookRepository();
