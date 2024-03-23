import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episodePage } from '../../models';

export const PostEpisodePageRequestBodySchema = createInsertSchema(episodePage).pick({
  episodeId: true,
  id: true,
  imageId: true,
  page: true,
});

export type PostEpisodePageRequestBody = z.infer<typeof PostEpisodePageRequestBodySchema>;
