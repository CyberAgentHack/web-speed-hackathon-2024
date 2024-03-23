DROP INDEX IF EXISTS `created_at_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `book_id_chapter_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `rank_idx`;--> statement-breakpoint
CREATE INDEX `book_created_at_idx` ON `book` (`created_at`);--> statement-breakpoint
CREATE INDEX `episode_book_id_chapter_idx` ON `episode` (`book_id`,`chapter`);--> statement-breakpoint
CREATE INDEX `feature_created_at_idx` ON `feature` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `ranking_rank_idx` ON `ranking` (`rank`);