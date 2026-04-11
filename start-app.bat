@echo off
echo ========================================
echo    Convexa AI - Starting Application
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd backend
start "Convexa AI Backend" cmd /k "python app.py"
cd ..

echo [2/3] Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend...
start "Convexa AI Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Application Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Login Credentials:
echo Email:    admin@convexa.ai
echo Password: admin123
echo.
echo Press any key to continue...
pause > nul