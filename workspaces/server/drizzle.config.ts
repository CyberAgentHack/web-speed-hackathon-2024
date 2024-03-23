
import type { Config } from 'drizzle-kit';

import {DATABASE_PATH} from "./src/constants/paths";

export default {
  dbCredentials: {
    url: DATABASE_PATH
  },
  driver: 'better-sqlite',
  out: './drizzle', schema: '../schema/src/models',
} satisfies Config;
