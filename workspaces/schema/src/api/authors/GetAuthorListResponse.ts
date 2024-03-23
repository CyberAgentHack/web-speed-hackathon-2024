import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, episode, image } from '../../models';

export const GetAuthorListResponseSchema = createSelectSchema(author)
  .pick({
    description: true,
    id: true,
    name: true,
  })
  .extend({
    books: createSelectSchema(book)
      .pick({
        description: true,
        id: true,
        name: true,
      })
      .extend({
        episodes: createSelectSchema(episode)
          .pick({
            chapter: true,
            description: true,
            id: true,
            name: true,
          })
          .array(),
        image: createSelectSchema(image).pick({
          alt: true,
          id: true,
        }),
      })
      .array(),
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  })
  .array();

export type GetAuthorListResponse = z.infer<typeof GetAuthorListResponseSchema>;
