-- Run this in phpMyAdmin or MySQL command line
CREATE USER 'django_user'@'localhost' IDENTIFIED BY 'django_pass';
GRANT ALL PRIVILEGES ON eduyata_db.* TO 'django_user'@'localhost';
FLUSH PRIVILEGES;