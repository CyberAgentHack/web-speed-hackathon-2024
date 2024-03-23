import { relations } from 'drizzle-orm';

import { author } from '../author';
import { book } from '../book';
import { episode } from '../episode';
import { image } from '../image';
import { release } from '../release';

export const bookRelations = relations(book, ({ many, one }) => ({
  author: one(author, {
    fields: [book.authorId],
    references: [author.id],
  }),
  episodes: many(episode),
  image: one(image, {
    fields: [book.imageId],
    references: [image.id],
  }),
  release: one(release, {
    fields: [book.releaseId],
    references: [release.id],
  }),
}));
