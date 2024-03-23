import { z } from 'zod';

export const DeleteEpisodeRequestParamsSchema = z.object({
  episodeId: z.string(),
});

export type DeleteEpisodeRequestParams = z.infer<typeof DeleteEpisodeRequestParamsSchema>;
