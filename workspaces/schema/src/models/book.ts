/* eslint-disable sort/object-properties */
import { randomUUID } from 'node:crypto';

import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const book = sqliteTable('book', {
  // primary key
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // columns
  description: text('description').notNull(),
  name: text('name').notNull(),
  nameRuby: text('name_ruby').notNull(),

  // relations
  imageId: text('image_id').notNull(),
  authorId: text('author_id').notNull(),
  releaseId: text('release_id').notNull(),

  // metadata
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
