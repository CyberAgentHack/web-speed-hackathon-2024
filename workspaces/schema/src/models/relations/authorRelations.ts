import { relations } from 'drizzle-orm';

import { author } from '../author';
import { book } from '../book';
import { image } from '../image';

export const authorRelations = relations(author, ({ many, one }) => ({
  books: many(book),
  image: one(image, {
    fields: [author.imageId],
    references: [image.id],
  }),
}));
