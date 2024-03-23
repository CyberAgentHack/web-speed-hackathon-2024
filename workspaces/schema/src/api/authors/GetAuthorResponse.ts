import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, episode, image } from '../../models';

const GetAuthorResponseSchemaBook = createSelectSchema(book)
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
});
export const GetAuthorResponseSchema = createSelectSchema(author)
  .pick({
    description: true,
    id: true,
    name: true,
  })
  .extend({
    books: GetAuthorResponseSchemaBook
      .array(),
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  });

export type GetAuthorResponse = z.infer<typeof GetAuthorResponseSchema>;
export type GetAuthorResponseBook = z.infer<typeof GetAuthorResponseSchemaBook>;
