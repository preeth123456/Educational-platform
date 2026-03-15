-- Add class and board filtering fields to courses table
USE eduyata_db;

ALTER TABLE courses 
ADD COLUMN class_level VARCHAR(20) DEFAULT '',
ADD COLUMN board VARCHAR(50) DEFAULT '';