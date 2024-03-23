import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { image } from '../../models';

export const PostImageResponseSchema = createSelectSchema(image).pick({
  alt: true,
  id: true,
});

export type PostImageResponse = z.infer<typeof PostImageResponseSchema>;
