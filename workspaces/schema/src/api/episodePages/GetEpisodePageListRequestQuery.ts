import { z } from 'zod';

export const GetEpisodePageListRequestQuerySchema = z.object({
  episodeId: z.string(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export type GetEpisodePageListRequestQuery = z.infer<typeof GetEpisodePageListRequestQuerySchema>;
