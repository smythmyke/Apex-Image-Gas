# Stripe Setup Script for Apex Gas (Using Local stripe.exe)
# This script creates products and prices in Stripe programmatically

Write-Host "Setting up Stripe products and prices..." -ForegroundColor Green

# Check if stripe.exe exists in current directory
if (-not (Test-Path ".\stripe.exe")) {
    Write-Host "stripe.exe not found in current directory." -ForegroundColor Red
    Write-Host "Downloading Stripe CLI..." -ForegroundColor Yellow
    
    try {
        # Get the latest version URL
        $latestRelease = Invoke-RestMethod -Uri "https://api.github.com/repos/stripe/stripe-cli/releases/latest"
        $downloadUrl = $latestRelease.assets | Where-Object { $_.name -like "*windows_x86_64.zip" } | Select-Object -ExpandProperty browser_download_url
        
        if (-not $downloadUrl) {
            # Fallback to known working version
            $downloadUrl = "https://github.com/stripe/stripe-cli/releases/download/v1.29.0/stripe_1.29.0_windows_x86_64.zip"
        }
        
        Write-Host "Downloading from: $downloadUrl" -ForegroundColor Cyan
        Invoke-WebRequest -Uri $downloadUrl -OutFile "stripe.zip"
        Expand-Archive -Path stripe.zip -DestinationPath . -Force
        Remove-Item stripe.zip
        Write-Host "Stripe CLI downloaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download Stripe CLI. Please download manually from:" -ForegroundColor Red
        Write-Host "https://github.com/stripe/stripe-cli/releases/latest" -ForegroundColor Cyan
        exit 1
    }
}

# Login to Stripe
Write-Host "Checking Stripe authentication..." -ForegroundColor Yellow
$configCheck = .\stripe.exe config --list 2>&1
if ($configCheck -like "*No config*" -or $configCheck -like "*unknown*") {
    Write-Host "You need to login to Stripe first..." -ForegroundColor Yellow
    Write-Host "This will open a browser window to authenticate." -ForegroundColor Cyan
    .\stripe.exe login
    
    # Wait for user to complete login
    Write-Host "Press any key after you've completed the login in your browser..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Create Product 1: Single Purchase
Write-Host "Creating single purchase product..." -ForegroundColor Cyan
$productSingleResult = .\stripe.exe products create `
  --name="EOS 3.5 Gas Mixture - Single Purchase" `
  --description="1 Liter 3.7% Ethane BAL Xenon for EOS 3.5 X-Ray Machines" 2>&1

# Extract product ID from output
if ($productSingleResult -match "prod_\w+") {
    $productSingle = $matches[0]
    Write-Host "Product created: $productSingle" -ForegroundColor Green
} else {
    Write-Host "Error creating product. Output:" -ForegroundColor Red
    Write-Host $productSingleResult
    $productSingle = Read-Host "Please enter the product ID manually (or press Ctrl+C to exit)"
}

# Create Price for Single Purchase
Write-Host "Creating price for single purchase..." -ForegroundColor Cyan
$priceSingleJson = .\stripe.exe prices create `
  --product="$productSingle" `
  --unit-amount=999900 `
  --currency=usd `
  --json

$priceSingle = ($priceSingleJson | ConvertFrom-Json).id
Write-Host "Price created: $priceSingle" -ForegroundColor Green

# Create Product 2: Annual Subscription
Write-Host "Creating subscription product..." -ForegroundColor Cyan
$productSubJson = .\stripe.exe products create `
  --name="EOS 3.5 Gas Mixture - Annual Subscription" `
  --description="Annual supply of 1 Liter 3.7% Ethane BAL Xenon" `
  --json

$productSub = ($productSubJson | ConvertFrom-Json).id
Write-Host "Product created: $productSub" -ForegroundColor Green

# Create Price for Subscription
Write-Host "Creating price for subscription..." -ForegroundColor Cyan
$priceSubJson = .\stripe.exe prices create `
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
Write-Host "  .\stripe.exe listen --forward-to localhost:5001/apex-gas-9920e/us-central1/stripeWebhook"
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green