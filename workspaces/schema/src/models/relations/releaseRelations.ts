import { relations } from 'drizzle-orm';

import { book } from '../book';
import { release } from '../release';

export const releaseRelations = relations(release, ({ many }) => ({
  books: many(book),
}));
