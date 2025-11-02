# Deploy to Vercel - PowerShell Script
# Run this script to deploy your Habit Tracker app

Write-Host "🚀 Habit Tracker - Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if in correct directory
$currentDir = Get-Location
if ($currentDir.Path -notlike "*habit*") {
    Write-Host "⚠️  Please run this script from the habit directory" -ForegroundColor Yellow
    Write-Host "Navigating to habit directory..." -ForegroundColor Yellow
    Set-Location "C:\Users\Dell\Downloads\habit"
}

Write-Host "`n📋 Step 1: Checking Git status..." -ForegroundColor Green
git status

Write-Host "`n📦 Step 2: Would you like to commit changes? (Y/N)" -ForegroundColor Green
$commit = Read-Host
if ($commit -eq "Y" -or $commit -eq "y") {
    Write-Host "Enter commit message:" -ForegroundColor Yellow
    $message = Read-Host
    git add .
    git commit -m "$message"
    git push origin main
    Write-Host "✅ Changes committed and pushed!" -ForegroundColor Green
}

Write-Host "`n🌐 Step 3: Deploy Frontend or Backend? (F/B/Both)" -ForegroundColor Green
$choice = Read-Host

if ($choice -eq "F" -or $choice -eq "f" -or $choice -eq "Both" -or $choice -eq "both") {
    Write-Host "`n🎨 Deploying Frontend..." -ForegroundColor Cyan
    Set-Location "habit-tracker"
    
    Write-Host "Choose deployment type:" -ForegroundColor Yellow
    Write-Host "1. Preview (test deployment)" -ForegroundColor Yellow
    Write-Host "2. Production (live deployment)" -ForegroundColor Yellow
    $deployType = Read-Host
    
    if ($deployType -eq "1") {
        vercel
    } else {
        vercel --prod
    }
    
    Set-Location ..
}

if ($choice -eq "B" -or $choice -eq "b" -or $choice -eq "Both" -or $choice -eq "both") {
    Write-Host "`n⚙️  Deploying Backend..." -ForegroundColor Cyan
    Set-Location "habit-backend"
    
    Write-Host "Choose deployment type:" -ForegroundColor Yellow
    Write-Host "1. Preview (test deployment)" -ForegroundColor Yellow
    Write-Host "2. Production (live deployment)" -ForegroundColor Yellow
    $deployType = Read-Host
    
    if ($deployType -eq "1") {
        vercel
    } else {
        vercel --prod
    }
    
    Set-Location ..
}

Write-Host "`n✅ Deployment Complete!" -ForegroundColor Green
Write-Host "Check your Vercel dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Copy your backend URL from Vercel" -ForegroundColor White
Write-Host "2. Add it as REACT_APP_API_URL in frontend environment variables" -ForegroundColor White
Write-Host "3. Redeploy frontend if needed" -ForegroundColor White
Write-Host "`n🎉 Happy Deploying!" -ForegroundColor Magenta
