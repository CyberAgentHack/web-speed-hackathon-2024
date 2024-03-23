import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, episode, image, ranking } from '../../models';

const GetRankingListResponseBookSchema = createSelectSchema(book)
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
export const GetRankingListResponseSchema = createSelectSchema(ranking)
.pick({
  id: true,
  rank: true,
  })
  .extend({
    book: GetRankingListResponseBookSchema,
  })
  .array();

export type GetRankingListResponse = z.infer<typeof GetRankingListResponseSchema>;
export type GetRankingListResponseBook = z.infer<typeof GetRankingListResponseBookSchema>;
