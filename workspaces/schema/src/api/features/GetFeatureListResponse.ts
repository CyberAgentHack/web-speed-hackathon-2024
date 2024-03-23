import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, episode, feature, image } from '../../models';

const GetFeatureListResponseBookSchema = createSelectSchema(book)
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
});
export const GetFeatureListResponseSchema = createSelectSchema(feature)
.pick({
  id: true,
})
  .extend({
    book: GetFeatureListResponseBookSchema,
  })
  .array();

export type GetFeatureListResponse = z.infer<typeof GetFeatureListResponseSchema>;
export type GetFeatureListResponseBook = z.infer<typeof GetFeatureListResponseBookSchema>;
