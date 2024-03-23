import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { release } from '../../models';

export const GetReleaseListResponseSchema = createSelectSchema(release)
  .pick({
    dayOfWeek: true,
    id: true,
  })
  .array();

export type GetReleaseListResponse = z.infer<typeof GetReleaseListResponseSchema>;
