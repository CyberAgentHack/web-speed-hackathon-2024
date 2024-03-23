CREATE INDEX `created_at_idx` ON `book` (`created_at`);--> statement-breakpoint
CREATE INDEX `book_id_chapter_idx` ON `episode` (`book_id`,`chapter`);--> statement-breakpoint
CREATE UNIQUE INDEX `rank_idx` ON `ranking` (`rank`);
