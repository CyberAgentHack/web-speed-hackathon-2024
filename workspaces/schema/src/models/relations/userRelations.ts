import { relations } from 'drizzle-orm';

import { image } from '../image';
import { user } from '../user';

export const userRelations = relations(user, ({ one }) => ({
  image: one(image, {
    fields: [user.imageId],
    references: [image.id],
  }),
}));
