@echo off
echo ========================================
echo Starting FoodChain AI Servers
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && node server.js"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
