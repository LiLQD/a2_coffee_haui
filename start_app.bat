@echo off
setlocal
chcp 65001 >nul

echo ==================================================
echo      A2 Coffee Haui - Automatic Installer
echo ==================================================

REM --- 1. Check for Node.js ---
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM --- 2. Backend Setup ---
echo.
echo [1/4] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)

REM Check for .env file
if not exist .env (
    echo Creating .env file from defaults...
    echo DB_HOST=localhost> .env
    echo DB_USER=root>> .env
    echo DB_PASS=>> .env
    echo DB_NAME=a2_snack>> .env
    echo PORT=3000>> .env
    echo JWT_SECRET=secret_key_change_me>> .env
    echo [WARN] Created default .env file. Please check database credentials if connection fails.
)

REM --- Import Database ---
echo.
echo [INFO] Checking Database...
set DB_NAME=a2_snack
set DB_USER=root
set DB_PASS=
set SQL_FILE=a2_coffee_haui.sql

if exist "%SQL_FILE%" (
    echo Found SQL dump file: %SQL_FILE%
    echo Would you like to import/reset the database? (y/n)
    set /p IMPORT_CHOICE="Choice [n]: "
    
    if /i "%IMPORT_CHOICE%"=="y" (
        echo.
        echo Please enter MySQL config (Press Enter for defaults):
        set /p DB_USER_INPUT="User [root]: "
        if not "%DB_USER_INPUT%"=="" set DB_USER=%DB_USER_INPUT%
        
        set /p DB_PASS_INPUT="Password [empty]: "
        if not "%DB_PASS_INPUT%"=="" set DB_PASS=%DB_PASS_INPUT%

        echo Creating database if not exists...
        if "%DB_PASS%"=="" (
            mysql -u %DB_USER% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            echo Importing data...
            mysql -u %DB_USER% %DB_NAME% < %SQL_FILE%
        ) else (
            mysql -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            echo Importing data...
            mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% < %SQL_FILE%
        )
        
        if %errorlevel% neq 0 (
            echo [ERROR] Database import failed. Continuing anyway...
        ) else (
            echo [SUCCESS] Database imported successfully.
        )
    )
) else (
    echo [INFO] No SQL dump file found. Skipping import.
)

cd ..

REM --- 3. Frontend Setup ---
echo.
echo [2/4] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

echo.
echo [3/4] Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed.
    pause
    exit /b 1
)
cd ..

REM --- 4. Start Server ---
echo.
echo [4/4] Starting Application...
echo.
echo Application is running at: http://localhost:3000
echo (Press Ctrl+C to stop)
echo ==================================================

cd backend
call npm start
