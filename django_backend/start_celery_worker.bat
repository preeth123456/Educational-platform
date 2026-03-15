@echo off
echo Starting Celery Worker for Data Retention Tasks...
cd /d "%~dp0"
celery -A aiedupro worker --loglevel=info --pool=solo