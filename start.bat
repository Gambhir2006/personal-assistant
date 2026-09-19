@echo off
echo Starting AI Personal Assistant...
echo.

echo Step 1: Starting Backend...
start "Backend" cmd /k "python -m backend.main"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Step 2: Starting Frontend...
cd frontend
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo AI Personal Assistant is starting!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
