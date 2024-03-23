import { z } from 'zod';

export const PatchEpisodePageRequestParamsSchema = z.object({
  episodePageId: z.string(),
});

export type PatchEpisodePageRequestParams = z.infer<typeof PatchEpisodePageRequestParamsSchema>;
