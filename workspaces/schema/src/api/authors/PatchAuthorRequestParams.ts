import { z } from 'zod';

export const PatchAuthorRequestParamsSchema = z.object({
  authorId: z.string(),
});

export type PatchAuthorRequestParams = z.infer<typeof PatchAuthorRequestParamsSchema>;
