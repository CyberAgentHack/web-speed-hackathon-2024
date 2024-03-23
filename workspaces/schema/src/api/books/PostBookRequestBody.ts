import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { book } from '../../models';

export const PostBookRequestBodySchema = createInsertSchema(book).pick({
  authorId: true,
  description: true,
  imageId: true,
  name: true,
  nameRuby: true,
  releaseId: true,
});

export type PostBookRequestBody = z.infer<typeof PostBookRequestBodySchema>;
