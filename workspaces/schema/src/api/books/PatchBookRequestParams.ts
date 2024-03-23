import { z } from 'zod';

export const PatchBookRequestParamsSchema = z.object({
  bookId: z.string(),
});

export type PatchBookRequestParams = z.infer<typeof PatchBookRequestParamsSchema>;
