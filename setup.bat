@echo off
echo.
echo ========================================
echo DeepFRI Desktop - Project Setup
echo ========================================
echo.

:: Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
npm --version
echo.

:: Create directory structure
echo [INFO] Creating project structure...
if not exist "src\core" mkdir src\core
if not exist "src\electron" mkdir src\electron
if not exist "src\utils" mkdir src\utils
if not exist "src\types" mkdir src\types
if not exist "src\renderer" mkdir src\renderer
if not exist "assets" mkdir assets
if not exist "output\tags" mkdir output\tags
echo [OK] Directories created
echo.

:: Check package.json
if not exist "package.json" (
    echo [ERROR] package.json not found
    echo Please ensure you have the package.json file in the root directory
    pause
    exit /b 1
)

:: Install dependencies
echo [INFO] Installing dependencies...
echo This may take a few minutes...
echo.
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

:: Build TypeScript
echo [INFO] Building TypeScript...
call npm run build

if %errorlevel% equ 0 (
    echo [OK] TypeScript compiled successfully
) else (
    echo [WARNING] TypeScript compilation had warnings
)
echo.

:: Final instructions
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Replace assets\icon.png with your app icon
echo 2. Review and update package.json with your details
echo 3. Run 'npm run dev' to start development
echo 4. Run 'npm run build:win' to build for Windows
echo.
echo For more information, see README.md
echo.
pause