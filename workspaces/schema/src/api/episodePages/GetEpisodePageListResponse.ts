import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episodePage, image } from '../../models';

export const GetEpisodePageListResponseSchema = createSelectSchema(episodePage)
  .pick({
    id: true,
    page: true,
  })
  .extend({
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  })
  .array();

export type GetEpisodePageListResponse = z.infer<typeof GetEpisodePageListResponseSchema>;
