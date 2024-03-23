import { z } from 'zod';

export const GetBookRequestParamsSchema = z.object({
  bookId: z.string(),
});

export type GetBookRequestParams = z.infer<typeof GetBookRequestParamsSchema>;
