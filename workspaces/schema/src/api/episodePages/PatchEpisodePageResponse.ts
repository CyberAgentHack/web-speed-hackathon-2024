import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episodePage, image } from '../../models';

export const PatchEpisodePageResponseSchema = createSelectSchema(episodePage)
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

export type PatchEpisodePageResponse = z.infer<typeof PatchEpisodePageResponseSchema>;
