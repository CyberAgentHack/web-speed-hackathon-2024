import { relations } from 'drizzle-orm';

import { episode } from '../episode';
import { episodePage } from '../episodePage';
import { image } from '../image';

export const episodePageRelations = relations(episodePage, ({ one }) => ({
  episode: one(episode, {
    fields: [episodePage.episodeId],
    references: [episode.id],
  }),
  image: one(image, {
    fields: [episodePage.imageId],
    references: [image.id],
  }),
}));
