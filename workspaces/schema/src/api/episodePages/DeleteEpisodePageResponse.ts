import { z } from 'zod';

export const DeleteEpisodePageResponseSchema = z.object({});

export type DeleteEpisodePageResponse = z.infer<typeof DeleteEpisodePageResponseSchema>;
