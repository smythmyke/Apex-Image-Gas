# Manual Stripe Setup Commands
# Run these commands one by one after logging in

Write-Host "========================================" -ForegroundColor Green
Write-Host "STRIPE MANUAL SETUP COMMANDS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "First, make sure you're logged in:" -ForegroundColor Cyan
Write-Host "  .\stripe.exe login" -ForegroundColor White
Write-Host ""
Write-Host "Then run these commands ONE BY ONE:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# 1. Create Single Purchase Product:" -ForegroundColor Yellow
Write-Host '.\stripe.exe products create --name="EOS 3.5 Gas Mixture - Single Purchase" --description="1 Liter 3.7% Ethane BAL Xenon"' -ForegroundColor White
Write-Host ""
Write-Host "# Copy the product ID (prod_xxxxx) and use it in the next command:" -ForegroundColor Yellow
Write-Host '.\stripe.exe prices create --product="prod_PASTE_ID_HERE" --unit-amount=999900 --currency=usd' -ForegroundColor White
Write-Host ""
Write-Host "# 2. Create Subscription Product:" -ForegroundColor Yellow
Write-Host '.\stripe.exe products create --name="EOS 3.5 Gas Mixture - Annual Subscription" --description="Annual supply"' -ForegroundColor White
Write-Host ""
Write-Host "# Copy the product ID and use it here:" -ForegroundColor Yellow
Write-Host '.\stripe.exe prices create --product="prod_PASTE_ID_HERE" --unit-amount=949900 --currency=usd --recurring="interval=year"' -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "After creating products, update functions\.env with:" -ForegroundColor Cyan
Write-Host "  STRIPE_PRICE_SINGLE=price_xxxxx" -ForegroundColor White
Write-Host "  STRIPE_PRICE_SUBSCRIPTION=price_xxxxx" -ForegroundColor White
Write-Host "  STRIPE_SECRET_KEY=sk_test_xxxxx (from Stripe Dashboard)" -ForegroundColor White
Write-Host ""
Write-Host "To get your secret key:" -ForegroundColor Cyan
Write-Host "  1. Go to https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
Write-Host "  2. Copy the 'Secret key'" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green