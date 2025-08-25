# Fix Subscription Price Script

Write-Host "Creating subscription price with correct syntax..." -ForegroundColor Cyan

# Create recurring price for subscription
$priceResult = .\stripe.exe prices create `
  --product="prod_SvAADbFpB7clVz" `
  --unit-amount=949900 `
  --currency=usd `
  -d "recurring[interval]=year" 2>&1 | Out-String

Write-Host $priceResult -ForegroundColor DarkGray

# Extract price ID
if ($priceResult -match '"id":\s*"(price_[a-zA-Z0-9]+)"') {
    $subscriptionPriceId = $matches[1]
    Write-Host "[OK] Subscription price created: $subscriptionPriceId" -ForegroundColor Green
    
    # Update the config files
    Write-Host "Updating configuration files..." -ForegroundColor Yellow
    
    # Read current stripe-config.js
    $configPath = "src\stripe-config.js"
    $configContent = Get-Content $configPath -Raw
    
    # Update the subscription price ID
    $configContent = $configContent -replace "ANNUAL_SUBSCRIPTION: 'price_[^']*'", "ANNUAL_SUBSCRIPTION: '$subscriptionPriceId'"
    $configContent = $configContent -replace "priceId: 'price_1RzJq5D2Q6x28Ei7b8pfapyU'(.*)SUBSCRIPTION", "priceId: '$subscriptionPriceId'`$1SUBSCRIPTION"
    
    # Save updated config
    $configContent | Out-File -FilePath $configPath -Encoding UTF8
    Write-Host "[OK] Updated src/stripe-config.js" -ForegroundColor Green
    
    # Update functions\.env
    $envPath = "functions\.env"
    $envContent = Get-Content $envPath -Raw
    $envContent = $envContent -replace "STRIPE_PRICE_SUBSCRIPTION=.*", "STRIPE_PRICE_SUBSCRIPTION=$subscriptionPriceId"
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "[OK] Updated functions\.env" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "==================== FIXED ====================" -ForegroundColor Green
    Write-Host "Subscription Price ID: $subscriptionPriceId" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Now you need to:" -ForegroundColor Yellow
    Write-Host "1. Get your API keys from: https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
    Write-Host "2. Add them to functions\.env" -ForegroundColor White
    Write-Host "================================================" -ForegroundColor Green
    
} else {
    Write-Host "Could not create subscription price. Please try manually:" -ForegroundColor Red
    Write-Host '.\stripe.exe prices create --product="prod_SvAADbFpB7clVz" --unit-amount=949900 --currency=usd -d "recurring[interval]=year"' -ForegroundColor Yellow
}