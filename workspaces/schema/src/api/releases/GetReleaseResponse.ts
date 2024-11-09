import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, episode, image, release } from '../../models';

export const GetReleaseResponseSchema = createSelectSchema(release)
  .pick({
    dayOfWeek: true,
    id: true,
  })
  .extend({
    books: createSelectSchema(book)
      .pick({
        description: true,
        id: true,
        name: true,
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
  });

export type GetReleaseResponse = z.infer<typeof GetReleaseResponseSchema>;
