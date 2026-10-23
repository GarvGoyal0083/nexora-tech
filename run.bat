@echo off
cd /d "%~dp0"
echo ========================================================
echo   Launching Nexora Tech - Next-Gen E-Commerce Platform
echo ========================================================
echo.
echo Starting full-stack server on http://localhost:5000 ...
start http://localhost:5000
node backend/server.js
pause
