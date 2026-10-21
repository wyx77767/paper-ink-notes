@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "NODE_DIR=%LOCALAPPDATA%\node-portable\node-v24.22.1-win-x64"
if exist "%NODE_DIR%\node.exe" set "PATH=%NODE_DIR%;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
  echo 未找到 Node.js，请先安装 Node.js LTS 后重试。
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo 正在安装依赖，请稍候...
  call npm.cmd install
)

call npm.cmd run dev -- --open
pause
