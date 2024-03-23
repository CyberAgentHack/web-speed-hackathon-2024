import { z } from 'zod';

export const GetRankingListRequestQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type GetRankingListRequestQuery = z.infer<typeof GetRankingListRequestQuerySchema>;
