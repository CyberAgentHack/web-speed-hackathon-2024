import { z } from 'zod';

export const DeleteBookRequestParamsSchema = z.object({
  bookId: z.string(),
});

export type DeleteBookRequestParams = z.infer<typeof DeleteBookRequestParamsSchema>;
