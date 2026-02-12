@echo off
echo Installing frontend dependencies...
cd frontend
echo Current directory: %CD%
echo Running npm install...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo npm install failed, trying with --force
    npm install --force
)
if %errorlevel% neq 0 (
    echo npm install failed, trying without any flags
    npm install --no-optional
)
echo Frontend installation complete!
pause