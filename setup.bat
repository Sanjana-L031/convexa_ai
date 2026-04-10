@echo off
echo 🚀 Setting up Convexa AI Platform...

echo.
echo 📦 Installing frontend dependencies...
call npm install

echo.
echo 🐍 Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo ✅ Setup complete! 
echo.
echo 🎯 To run the application:
echo   Frontend: npm run dev
echo   Backend:  cd backend && venv\Scripts\activate && python app.py
echo.
echo 🌟 Visit http://localhost:5173 to see your AI marketing platform!
pause