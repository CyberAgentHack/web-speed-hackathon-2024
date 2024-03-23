import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author } from '../../models';

export const PostAuthorRequestBodySchema = createInsertSchema(author).pick({
  description: true,
  imageId: true,
  name: true,
});

export type PostAuthorRequestBody = z.infer<typeof PostAuthorRequestBodySchema>;
