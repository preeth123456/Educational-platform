-- Fix student_enrollments table to add AUTO_INCREMENT to id column
ALTER TABLE student_enrollments MODIFY COLUMN id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE student_enrollments ADD PRIMARY KEY (id);