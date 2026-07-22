@echo off
echo ==========================================
echo Starting SurakshaNet AI Platform...
echo ==========================================
echo.
echo We detected that your local environment is missing Node.js or MongoDB.
echo No worries! We will use Docker to run the entire platform.
echo.

:: Check if docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first!
    pause
    exit /b
)

echo Building and starting containers (MongoDB, FastAPI Backend, Next.js Frontend)...
echo This might take a few minutes the first time to download the images.
echo.

docker compose up --build -d

echo.
echo ==========================================
echo Platform is starting up!
echo Please wait about 30 seconds for all services to initialize.
echo.
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo ==========================================
echo.
echo To view the live logs, run: docker compose logs -f
echo To stop the platform, run: docker compose down
echo.
pause
