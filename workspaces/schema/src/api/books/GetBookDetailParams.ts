import { z } from 'zod';

export const GetBookDetailParamsSchema = z.object({
  bookId: z.string(),
});

export type GetBookDetailParams = z.infer<typeof GetBookDetailParamsSchema>;
