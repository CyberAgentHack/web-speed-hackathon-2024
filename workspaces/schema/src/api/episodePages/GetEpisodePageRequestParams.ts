import { z } from 'zod';

export const GetEpisodePageRequestParamsSchema = z.object({
  episodePageId: z.string(),
});

export type GetEpisodePageRequestParams = z.infer<typeof GetEpisodePageRequestParamsSchema>;
