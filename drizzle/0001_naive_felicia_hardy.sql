CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`instructor` varchar(255) NOT NULL,
	`duration` varchar(50) NOT NULL,
	`format` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`files` json NOT NULL DEFAULT ('[]'),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
