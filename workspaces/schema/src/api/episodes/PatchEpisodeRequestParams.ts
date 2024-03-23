import { z } from 'zod';

export const PatchEpisodeRequestParamsSchema = z.object({
  episodeId: z.string(),
});

export type PatchEpisodeRequestParams = z.infer<typeof PatchEpisodeRequestParamsSchema>;
