import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, episode, image } from '../../models';

export const GetBookDetailResponseSchema = createSelectSchema(book)
  .pick({
    description: true,
    id: true,
    name: true,
    nameRuby: true,
  })
  .extend({
    author: createSelectSchema(author)
      .pick({
        description: true,
        id: true,
        name: true,
      })
      .extend({
        image: createSelectSchema(image).pick({
          alt: true,
          id: true,
        }),
      }),
    episodes: createSelectSchema(episode)
      .pick({
        id: true,
        name: true,
        description: true,
        chapter: true,
      })
      .extend({
        image: createSelectSchema(image).pick({
          alt: true,
          id: true,
        })
      })
      .array(),
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  });

export type GetBookDetailResponse = z.infer<typeof GetBookDetailResponseSchema>;
