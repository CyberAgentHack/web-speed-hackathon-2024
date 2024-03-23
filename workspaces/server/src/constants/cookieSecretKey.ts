import { randomBytes } from 'node:crypto';

export const COOKIE_SECRET_KEY = randomBytes(16).toString('hex');
