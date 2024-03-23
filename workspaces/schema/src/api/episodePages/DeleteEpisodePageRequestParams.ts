import { z } from 'zod';

export const DeleteEpisodePageRequestParamsSchema = z.object({
  episodePageId: z.string(),
});

export type DeleteEpisodePageRequestParams = z.infer<typeof DeleteEpisodePageRequestParamsSchema>;
