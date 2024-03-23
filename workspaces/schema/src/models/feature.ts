/* eslint-disable sort/object-properties */
import { randomUUID } from 'node:crypto';

import {index, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const feature = sqliteTable('feature', {
  // primary key
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // relations
  bookId: text('book_id').notNull(),

  // metadata
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
},(table) => {
  return {
    createdAt: index("feature_created_at_idx").on(table.createdAt),
  };
});
