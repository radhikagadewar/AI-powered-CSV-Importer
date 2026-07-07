@echo off
REM AI-Powered CSV Importer Startup Script for Windows

echo.
echo ========================================
echo AI-Powered CSV Importer
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo WARNING: Backend .env file not found!
    echo Creating from .env.example...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo IMPORTANT: Please edit backend\.env and add your OPENAI_API_KEY
    echo Then run this script again.
    pause
    exit /b 1
)

REM Check if OPENAI_API_KEY is set
findstr /C:"OPENAI_API_KEY=sk-" "backend\.env" >nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: OPENAI_API_KEY not configured in backend\.env
    echo Please add your OpenAI API key and run this script again.
    pause
    exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
if not exist "node_modules" (
    call npm install
) else (
    echo Dependencies already installed, skipping...
)
cd ..
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    call npm install
) else (
    echo Dependencies already installed, skipping...
)
cd ..
echo.

REM Create frontend .env.local if not exists
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:3001 > "frontend\.env.local"
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend
start "CSV Importer Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
start "CSV Importer Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Close those windows to stop the servers.
echo.
pause
