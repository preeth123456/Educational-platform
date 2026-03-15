Write-Host "Starting Django server on port 8001..." -ForegroundColor Green
Set-Location "c:\xampp\htdocs\eduyata\Eduyata-collaboration\django_backend"
Start-Process python -ArgumentList "manage.py", "runserver", "127.0.0.1:8001" -WindowStyle Minimized
Write-Host "Django server started in background on http://127.0.0.1:8001" -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")