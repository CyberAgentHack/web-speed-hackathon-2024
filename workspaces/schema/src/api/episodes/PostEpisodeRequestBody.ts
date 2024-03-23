import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episode } from '../../models';

export const PostEpisodeRequestBodySchema = createInsertSchema(episode).pick({
  bookId: true,
  chapter: true,
  description: true,
  imageId: true,
  name: true,
  nameRuby: true,
});

export type PostEpisodeRequestBody = z.infer<typeof PostEpisodeRequestBodySchema>;
