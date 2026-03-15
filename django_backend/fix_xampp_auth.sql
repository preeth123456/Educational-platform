-- Run this in phpMyAdmin SQL tab
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
ALTER USER 'root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;