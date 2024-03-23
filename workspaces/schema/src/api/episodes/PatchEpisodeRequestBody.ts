import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episode } from '../../models';

export const PatchEpisodeRequestBodySchema = createInsertSchema(episode)
  .pick({
    bookId: true,
    chapter: true,
    description: true,
    imageId: true,
    name: true,
    nameRuby: true,
  })
  .partial();

export type PatchEpisodeRequestBody = z.infer<typeof PatchEpisodeRequestBodySchema>;
