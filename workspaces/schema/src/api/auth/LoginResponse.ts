import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { image, user } from '../../models';

export const LoginResponseSchema = createSelectSchema(user)
  .pick({
    description: true,
    id: true,
    name: true,
  })
  .extend({
    image: createSelectSchema(image).pick({
      alt: true,
      id: true,
    }),
  });

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
