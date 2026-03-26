-- Migration number: 0002 	 2026-03-26T22:27:51.000Z

-- Create table for storing reminders
CREATE TABLE reminders (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    text TEXT NOT NULL,
    remind_at INTEGER NOT NULL,
    username TEXT NOT NULL,
    set_at INTEGER NOT NULL,
    dm_id TEXT NOT NULL,
    sent INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_reminders_remind_at ON reminders(remind_at);
CREATE INDEX idx_reminders_author_id ON reminders(author_id);
