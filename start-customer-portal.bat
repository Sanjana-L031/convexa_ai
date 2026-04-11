@echo off
echo ========================================
echo   Convexa AI - Customer Portal Setup
echo ========================================
echo.

echo [1/3] Installing Customer Portal Dependencies...
cd customer-portal
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo [2/3] Starting Backend Server (if not running)...
cd ../backend
start "Convexa AI Backend" cmd /k "python app.py"
cd ../customer-portal

echo [3/3] Starting Customer Portal...
start "Convexa AI Customer Portal" cmd /k "npm run dev"

echo.
echo ========================================
echo   Customer Portal Started Successfully!
echo ========================================
echo.
echo Admin Dashboard: http://localhost:5173
echo Customer Portal: http://localhost:5174
echo Backend API:     http://localhost:5000
echo.
echo Customer Demo Login:
echo Email:    rahul@example.com
echo Password: demo123
echo.
echo Press any key to continue...
pause > nul