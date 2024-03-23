import { z } from 'zod';

export const GetBookListRequestQuerySchema = z.object({
  authorId: z.string().optional(),
  authorName: z.string().optional(),
  limit: z.coerce.number().optional(),
  name: z.string().optional(),
  offset: z.coerce.number().optional(),
});

export type GetBookListRequestQuery = z.infer<typeof GetBookListRequestQuerySchema>;
