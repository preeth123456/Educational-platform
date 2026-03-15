-- Add reminder tracking columns to schedules table
ALTER TABLE schedules
ADD COLUMN reminder_1_day_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN reminder_1_hour_sent BOOLEAN DEFAULT FALSE;