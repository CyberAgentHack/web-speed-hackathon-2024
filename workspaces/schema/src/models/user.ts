/* eslint-disable sort/object-properties */
import { randomUUID } from 'node:crypto';

import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  // primary key
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // columns
  description: text('description').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),

  // relations
  imageId: text('image_id').notNull(),

  // metadata
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
