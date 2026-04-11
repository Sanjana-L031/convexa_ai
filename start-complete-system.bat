@echo off
echo ========================================
echo    Convexa AI - Complete System
echo ========================================
echo.

echo [1/4] Starting Backend Server...
cd backend
start "Convexa AI Backend" cmd /k "python app.py"
cd ..

echo [2/4] Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo [3/4] Starting Admin Dashboard...
start "Convexa AI Admin" cmd /k "npm run dev"

echo [4/4] Starting Customer Portal...
cd customer-portal
call npm install > nul 2>&1
start "Convexa AI Customer Portal" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo    Complete System Started!
echo ========================================
echo.
echo ADMIN DASHBOARD:
echo URL:      http://localhost:5173
echo Login:    admin@convexa.ai
echo Password: admin123
echo.
echo CUSTOMER PORTAL:
echo URL:      http://localhost:5174
echo Login:    rahul@example.com (High Value Customer)
echo Login:    priya@example.com (Abandoned Cart Customer)
echo Password: demo123
echo.
echo BACKEND API:
echo URL:      http://localhost:5000
echo.
echo Press any key to continue...
pause > nul