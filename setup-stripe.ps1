# Stripe Setup Script for Apex Gas (PowerShell Version)
# This script creates products and prices in Stripe programmatically

Write-Host "Setting up Stripe products and prices..." -ForegroundColor Green

# Check if stripe CLI is installed
try {
    stripe --version | Out-Null
} catch {
    Write-Host "Stripe CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Login to Stripe (if not already logged in)
Write-Host "Checking Stripe authentication..." -ForegroundColor Yellow
try {
    stripe config --list | Out-Null
} catch {
    Write-Host "Please login to Stripe..." -ForegroundColor Yellow
    stripe login
}

# Create Product 1: Single Purchase
Write-Host "Creating single purchase product..." -ForegroundColor Cyan
$productSingleJson = stripe products create `
  --name="EOS 3.5 Gas Mixture - Single Purchase" `
  --description="1 Liter 3.7% Ethane BAL Xenon for EOS 3.5 X-Ray Machines" `
  --json

$productSingle = ($productSingleJson | ConvertFrom-Json).id
Write-Host "Product created: $productSingle" -ForegroundColor Green

# Create Price for Single Purchase
Write-Host "Creating price for single purchase..." -ForegroundColor Cyan
$priceSingleJson = stripe prices create `
  --product="$productSingle" `
  --unit-amount=999900 `
  --currency=usd `
  --json

$priceSingle = ($priceSingleJson | ConvertFrom-Json).id
Write-Host "Price created: $priceSingle" -ForegroundColor Green

# Create Product 2: Annual Subscription
Write-Host "Creating subscription product..." -ForegroundColor Cyan
$productSubJson = stripe products create `
  --name="EOS 3.5 Gas Mixture - Annual Subscription" `
  --description="Annual supply of 1 Liter 3.7% Ethane BAL Xenon" `
  --json

$productSub = ($productSubJson | ConvertFrom-Json).id
Write-Host "Product created: $productSub" -ForegroundColor Green

# Create Price for Subscription
Write-Host "Creating price for subscription..." -ForegroundColor Cyan
$priceSubJson = stripe prices create `
  --product="$productSub" `
  --unit-amount=949900 `
  --currency=usd `
  --recurring="interval=year" `
  --json

$priceSub = ($priceSubJson | ConvertFrom-Json).id
Write-Host "Price created: $priceSub" -ForegroundColor Green

# Create .env.local file with the IDs
Write-Host "Creating .env.local file..." -ForegroundColor Yellow
@"
# Stripe Configuration (Generated)
STRIPE_PRICE_SINGLE=$priceSingle
STRIPE_PRICE_SUBSCRIPTION=$priceSub
STRIPE_PRODUCT_SINGLE=$productSingle
STRIPE_PRODUCT_SUBSCRIPTION=$productSub
"@ | Out-File -FilePath ".env.local" -Encoding UTF8

# Also create Firebase Functions config
Write-Host "Creating Firebase Functions config..." -ForegroundColor Yellow
@"
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
STRIPE_PRICE_SINGLE=$priceSingle
STRIPE_PRICE_SUBSCRIPTION=$priceSub
"@ | Out-File -FilePath "functions\.env" -Encoding UTF8

Write-Host ""
Write-Host "==================== SETUP COMPLETE ====================" -ForegroundColor Green
Write-Host ""
Write-Host "Products and Prices created:" -ForegroundColor Cyan
Write-Host "  Single Purchase Product: $productSingle"
Write-Host "  Single Purchase Price: $priceSingle"
Write-Host "  Subscription Product: $productSub"
Write-Host "  Subscription Price: $priceSub"
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Add your Stripe Secret Key to functions\.env"
Write-Host "2. Set up webhook endpoint and add webhook secret to functions\.env"
Write-Host "3. Deploy Firebase Functions with: firebase deploy --only functions"
Write-Host ""
Write-Host "To set up webhook for local testing:" -ForegroundColor Cyan
Write-Host "  stripe listen --forward-to localhost:5001/apex-gas-9920e/us-central1/stripeWebhook"
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green