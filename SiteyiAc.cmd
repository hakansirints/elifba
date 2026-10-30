@echo off
setlocal
cd /d "%~dp0"
title Elif-Ba
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js bulunamadi. Once Node.js kurup bu dosyayi yeniden acin.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Bagimliliklar eksik. Bu klasorde once npm install komutunu calistirin.
  pause
  exit /b 1
)
echo Elif-Ba aciliyor. Siteyi kullanirken bu pencereyi acik tutun.
echo Kapatmak icin Ctrl+C tuslarina basin.
node "node_modules\vite\bin\vite.js" --host 127.0.0.1 --open
if errorlevel 1 pause
