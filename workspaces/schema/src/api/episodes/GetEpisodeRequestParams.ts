import { z } from 'zod';

export const GetEpisodeRequestParamsSchema = z.object({
  episodeId: z.string(),
});

export type GetEpisodeRequestParams = z.infer<typeof GetEpisodeRequestParamsSchema>;
