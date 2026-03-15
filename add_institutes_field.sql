-- Add institutes field to educators table
USE eduyata_db;
ALTER TABLE educators ADD COLUMN institutes JSON DEFAULT '[]';

-- Verify the column was added
DESCRIBE educators;