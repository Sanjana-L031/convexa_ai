@echo off
echo 🚀 Setting up Enhanced Convexa AI Platform...

echo.
echo 📦 Installing frontend dependencies...
call npm install --legacy-peer-deps

echo.
echo 🐍 Setting up Python backend with ML capabilities...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo 📊 Database Setup Instructions:
echo 1. Go to your Supabase dashboard: https://supabase.com/dashboard
echo 2. Open SQL Editor
echo 3. Copy and paste the contents of database_setup.sql
echo 4. Run the SQL commands to create tables and sample data
echo 5. Update backend/.env with your Supabase credentials

echo.
echo ✅ Setup complete! 
echo.
echo 🎯 To run the enhanced application:
echo   Frontend: npm run dev
echo   Backend:  cd backend ^&^& venv\Scripts\activate ^&^& python app_enhanced.py
echo.
echo 🌟 New Features:
echo   - Supabase database integration
echo   - ML-powered user segmentation  
echo   - Role-based authentication
echo   - Premium dashboard UI
echo   - Real user data management
echo.
echo 🔑 Default login: admin@convexa.ai / admin123
echo.
pause