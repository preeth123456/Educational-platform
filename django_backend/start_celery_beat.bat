@echo off
echo Starting Celery Beat Scheduler for Data Retention Tasks...
cd /d "%~dp0"
celery -A aiedupro beat --loglevel=info