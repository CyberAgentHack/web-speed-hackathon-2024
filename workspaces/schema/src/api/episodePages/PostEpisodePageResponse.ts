import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episodePage, image } from '../../models';

export const PostEpisodePageResponseSchema = createSelectSchema(episodePage)
  .pick({
    id: true,
    page: true,
  })
  .extend({
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  });

export type PostEpisodePageResponse = z.infer<typeof PostEpisodePageResponseSchema>;
