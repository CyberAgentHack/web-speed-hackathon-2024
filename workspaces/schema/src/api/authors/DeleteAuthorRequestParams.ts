import { z } from 'zod';

export const DeleteAuthorRequestParamsSchema = z.object({
  authorId: z.string(),
});

export type DeleteAuthorRequestParams = z.infer<typeof DeleteAuthorRequestParamsSchema>;
