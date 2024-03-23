import { relations } from 'drizzle-orm';

import { book } from '../book';
import { feature } from '../feature';

export const featureRelations = relations(feature, ({ one }) => ({
  book: one(book, {
    fields: [feature.bookId],
    references: [book.id],
  }),
}));
