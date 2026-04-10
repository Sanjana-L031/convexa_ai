@echo off
echo 🚀 Starting Enhanced Convexa AI Platform...

echo Starting enhanced backend server with ML and Supabase...
start cmd /k "cd backend && venv\Scripts\activate && python app_enhanced.py"

timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo 🔑 Login: admin@convexa.ai / admin123
echo.
echo 🌟 Enhanced Features:
echo   - Premium Dashboard UI
echo   - ML User Segmentation
echo   - Supabase Integration
echo   - Role-based Authentication
echo   - Real-time Analytics
echo.
echo Press any key to exit...
pause > nul