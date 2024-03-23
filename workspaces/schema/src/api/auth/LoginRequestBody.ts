import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { user } from '../../models';

export const LoginRequestBodySchema = createInsertSchema(user)
  .pick({
    email: true,
    password: true,
  })
  .required();

export type LoginRequestBody = z.infer<typeof LoginRequestBodySchema>;
