import { relations } from 'drizzle-orm';

import { book } from '../book';
import { episode } from '../episode';
import { episodePage } from '../episodePage';
import { image } from '../image';

export const episodeRelations = relations(episode, ({ many, one }) => ({
  book: one(book, {
    fields: [episode.bookId],
    references: [book.id],
  }),
  image: one(image, {
    fields: [episode.imageId],
    references: [image.id],
  }),
  pages: many(episodePage),
}));
