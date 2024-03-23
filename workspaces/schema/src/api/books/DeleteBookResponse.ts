import { z } from 'zod';

export const DeleteBookResponseSchema = z.object({});

export type DeleteBookResponse = z.infer<typeof DeleteBookResponseSchema>;
