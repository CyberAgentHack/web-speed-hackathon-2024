import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author } from '../../models';

export const PatchAuthorRequestBodySchema = createInsertSchema(author)
  .pick({
    description: true,
    imageId: true,
    name: true,
  })
  .partial();

export type PatchAuthorRequestBody = z.infer<typeof PatchAuthorRequestBodySchema>;
