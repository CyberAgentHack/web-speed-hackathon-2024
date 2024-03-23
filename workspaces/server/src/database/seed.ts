import fs from 'node:fs/promises';

import { DATABASE_PATH, DATABASE_SEED_PATH } from '../constants/paths';

import { initializeDatabase } from './drizzle';

export const seeding = async () => {
  await fs.copyFile(DATABASE_SEED_PATH, DATABASE_PATH);
  initializeDatabase();
  console.log('Finished seeding');
};
