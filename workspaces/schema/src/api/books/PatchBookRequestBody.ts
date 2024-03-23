import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { book } from '../../models';

export const PatchBookRequestBodySchema = createInsertSchema(book)
  .pick({
    authorId: true,
    description: true,
    imageId: true,
    name: true,
    nameRuby: true,
    releaseId: true,
  })
  .partial();

export type PatchBookRequestBody = z.infer<typeof PatchBookRequestBodySchema>;
