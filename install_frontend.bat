@echo off
echo Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo npm install failed, trying with --legacy-peer-deps
    npm install --legacy-peer-deps
)
if %errorlevel% neq 0 (
    echo npm install failed, trying with --force
    npm install --force
)
echo Frontend installation complete!
pause