import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, feature, image } from '../../models';

export const GetFeatureListResponseSchema = createSelectSchema(feature)
  .pick({
    id: true,
  })
  .extend({
    book: createSelectSchema(book)
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
        image: createSelectSchema(image).pick({
          alt: true,
          id: true,
        }),
      }),
  })
  .array();

export type GetFeatureListResponse = z.infer<typeof GetFeatureListResponseSchema>;
