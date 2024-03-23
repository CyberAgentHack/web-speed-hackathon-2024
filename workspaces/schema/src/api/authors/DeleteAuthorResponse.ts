import { z } from 'zod';

export const DeleteAuthorResponseSchema = z.object({});

export type DeleteAuthorResponse = z.infer<typeof DeleteAuthorResponseSchema>;
