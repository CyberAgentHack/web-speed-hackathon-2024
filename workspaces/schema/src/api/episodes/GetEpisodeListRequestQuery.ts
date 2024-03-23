import { z } from 'zod';

export const GetEpisodeListRequestQuerySchema = z.object({
  bookId: z.string(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type GetEpisodeListRequestQuery = z.infer<typeof GetEpisodeListRequestQuerySchema>;
