@echo off
REM ShadoW Server Startup - Windows Batch Script
REM This script starts the Express server with helpful messages

color 0A
title ShadoW Server - Starting...

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║      ShadoW Server Startup Helper (Windows)            ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist ".env" (
    echo ❌ ERROR: .env file not found!
    echo.
    echo 📝 Please create a .env file with:
    echo.
    echo PORT=3000
    echo MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shadow_saas
    echo JWT_SECRET=supersecretkey12345678901234567890
    echo.
    echo 📌 Copy .env.example to .env as a template
    echo.
    pause
    exit /b 1
)

echo ✅ .env file found
echo.
echo 📋 Prerequisites Check:
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️  Dependencies not installed!
    echo Installing npm packages...
    echo.
    call npm install
    if errorlevel 1 (
        echo ❌ NPM install failed!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
) else (
    echo ✅ Dependencies installed
    echo.
)

echo ╔════════════════════════════════════════════════════════╗
echo ║      Starting ShadoW Express Server...                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Start the server
node server.js

REM If server exits
echo.
echo 🛑 Server stopped or encountered an error
echo.
pause
