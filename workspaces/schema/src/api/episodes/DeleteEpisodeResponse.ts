import { z } from 'zod';

export const DeleteEpisodeResponseSchema = z.object({});

export type DeleteEpisodeResponse = z.infer<typeof DeleteEpisodeResponseSchema>;
