import { z } from 'zod';

export const LogoutResponseSchema = z.object({});

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
