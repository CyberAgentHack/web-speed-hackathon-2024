import { z } from 'zod';

export const GetFeatureListRequestQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type GetFeatureListRequestQuery = z.infer<typeof GetFeatureListRequestQuerySchema>;
