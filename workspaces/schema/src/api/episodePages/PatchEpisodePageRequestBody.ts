import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episodePage } from '../../models';

export const PatchEpisodePageRequestBodySchema = createInsertSchema(episodePage)
  .pick({
    episodeId: true,
    id: true,
    imageId: true,
    page: true,
  })
  .partial();

export type PatchEpisodePageRequestBody = z.infer<typeof PatchEpisodePageRequestBodySchema>;
