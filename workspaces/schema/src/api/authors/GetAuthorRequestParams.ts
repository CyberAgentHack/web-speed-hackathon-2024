import { z } from 'zod';

export const GetAuthorRequestParamsSchema = z.object({
  authorId: z.string(),
});

export type GetAuthorRequestParams = z.infer<typeof GetAuthorRequestParamsSchema>;
