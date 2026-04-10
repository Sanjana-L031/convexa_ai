@echo off
echo 🚀 Starting Convexa AI Platform...

echo Starting backend server...
start cmd /k "cd backend && venv\Scripts\activate && python app.py"

timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause > nul