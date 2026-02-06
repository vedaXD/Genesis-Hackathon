@echo off
echo ========================================
echo  AROGYA SATHI - Startup Script
echo  AI Sustainability Storytelling Platform
echo ========================================
echo.

REM Check if backend venv exists
if not exist "backend\venv\" (
    echo [ERROR] Backend virtual environment not found!
    echo Please run: cd backend ^&^& python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
    pause
    exit /b 1
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules\" (
    echo [ERROR] Frontend dependencies not installed!
    echo Please run: cd frontend ^&^& npm install
    pause
    exit /b 1
)

echo [INFO] Starting Backend API Server...
start "AROGYA SATHI Backend" cmd /k "cd backend && python api_server.py"

echo [INFO] Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo [INFO] Starting Frontend Dev Server...
start "AROGYA SATHI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window
echo (Backend and Frontend will keep running)
echo ========================================
pause >nul
