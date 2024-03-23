import { z } from 'zod';

export const GetReleaseRequestParamsSchema = z.object({
  dayOfWeek: z.string(),
});

export type GetReleaseRequestParams = z.infer<typeof GetReleaseRequestParamsSchema>;
