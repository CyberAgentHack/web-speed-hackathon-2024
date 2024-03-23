/* eslint-disable sort/object-properties */
import { randomUUID } from 'node:crypto';

import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const release = sqliteTable('release', {
  // primary key
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // columns
  dayOfWeek: text('day_of_week').notNull(),

  // metadata
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
