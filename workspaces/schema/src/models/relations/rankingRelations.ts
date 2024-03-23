import { relations } from 'drizzle-orm';

import { book } from '../book';
import { ranking } from '../ranking';

export const rankingRelations = relations(ranking, ({ one }) => ({
  book: one(book, {
    fields: [ranking.bookId],
    references: [book.id],
  }),
}));
