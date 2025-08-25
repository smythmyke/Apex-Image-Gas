# Stripe Setup Script for Apex Gas (Fixed Version)
# This script creates products and prices in Stripe

Write-Host "Setting up Stripe products and prices..." -ForegroundColor Green

# Check if stripe.exe exists
if (-not (Test-Path ".\stripe.exe")) {
    Write-Host "stripe.exe not found. Please ensure it's in the current directory." -ForegroundColor Red
    exit 1
}

# Check authentication
Write-Host "Checking Stripe authentication..." -ForegroundColor Yellow
$configCheck = .\stripe.exe config --list 2>&1
if ($configCheck -like "*No config*" -or $configCheck -like "*unknown*") {
    Write-Host "Please login to Stripe first using: .\stripe.exe login" -ForegroundColor Red
    exit 1
}

Write-Host "Authenticated successfully!" -ForegroundColor Green
Write-Host ""

# Create Product 1: Single Purchase
Write-Host "Creating single purchase product..." -ForegroundColor Cyan
Write-Host "Command: .\stripe.exe products create --name='EOS 3.5 Gas Mixture - Single Purchase'" -ForegroundColor Gray

$productSingleResult = .\stripe.exe products create `
  --name="EOS 3.5 Gas Mixture - Single Purchase" `
  --description="1 Liter 3.7% Ethane BAL Xenon for EOS 3.5 X-Ray Machines" 2>&1 | Out-String

Write-Host $productSingleResult -ForegroundColor DarkGray

if ($productSingleResult -match "(prod_[a-zA-Z0-9]+)") {
    $productSingle = $matches[1]
    Write-Host "[OK] Product created: $productSingle" -ForegroundColor Green
} else {
    Write-Host "Could not extract product ID from output" -ForegroundColor Red
    $productSingle = Read-Host "Please enter the product ID shown above (prod_xxxxx)"
}

Write-Host ""

# Create Price for Single Purchase
Write-Host 'Creating price for single purchase ($9,999)...' -ForegroundColor Cyan
Write-Host "Command: .\stripe.exe prices create --product='$productSingle' --unit-amount=999900 --currency=usd" -ForegroundColor Gray

$priceSingleResult = .\stripe.exe prices create `
  --product="$productSingle" `
  --unit-amount=999900 `
  --currency=usd 2>&1 | Out-String

Write-Host $priceSingleResult -ForegroundColor DarkGray

if ($priceSingleResult -match "(price_[a-zA-Z0-9]+)") {
    $priceSingle = $matches[1]
    Write-Host "[OK] Price created: $priceSingle" -ForegroundColor Green
} else {
    Write-Host "Could not extract price ID from output" -ForegroundColor Red
    $priceSingle = Read-Host "Please enter the price ID shown above (price_xxxxx)"
}

Write-Host ""

# Create Product 2: Annual Subscription
Write-Host "Creating subscription product..." -ForegroundColor Cyan
Write-Host "Command: .\stripe.exe products create --name='EOS 3.5 Gas Mixture - Annual Subscription'" -ForegroundColor Gray

$productSubResult = .\stripe.exe products create `
  --name="EOS 3.5 Gas Mixture - Annual Subscription" `
  --description="Annual supply of 1 Liter 3.7% Ethane BAL Xenon" 2>&1 | Out-String

Write-Host $productSubResult -ForegroundColor DarkGray

if ($productSubResult -match "(prod_[a-zA-Z0-9]+)") {
    $productSub = $matches[1]
    Write-Host "[OK] Product created: $productSub" -ForegroundColor Green
} else {
    Write-Host "Could not extract product ID from output" -ForegroundColor Red
    $productSub = Read-Host "Please enter the product ID shown above (prod_xxxxx)"
}

Write-Host ""

# Create Price for Subscription
Write-Host 'Creating subscription price ($9,499/year)...' -ForegroundColor Cyan
Write-Host "Command: .\stripe.exe prices create --product='$productSub' --unit-amount=949900 --currency=usd --recurring='interval=year'" -ForegroundColor Gray

$priceSubResult = .\stripe.exe prices create `
  --product="$productSub" `
  --unit-amount=949900 `
  --currency=usd `
  --recurring="interval=year" 2>&1 | Out-String

Write-Host $priceSubResult -ForegroundColor DarkGray

if ($priceSubResult -match "(price_[a-zA-Z0-9]+)") {
    $priceSub = $matches[1]
    Write-Host "[OK] Price created: $priceSub" -ForegroundColor Green
} else {
    Write-Host "Could not extract price ID from output" -ForegroundColor Red
    $priceSub = Read-Host "Please enter the price ID shown above (price_xxxxx)"
}

Write-Host ""

# Update stripe-config.js
Write-Host "Updating src/stripe-config.js..." -ForegroundColor Yellow
$configContent = @"
// Stripe Configuration
// Auto-generated on $(Get-Date)

export const STRIPE_CONFIG = {
    // Public key (safe to expose in frontend)
    PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY_HERE',
    
    // Products and Prices (auto-generated)
    PRICES: {
        SINGLE_PURCHASE: '$priceSingle',
        ANNUAL_SUBSCRIPTION: '$priceSub'
    },
    
    // URLs for redirects
    SUCCESS_URL: process.env.STRIPE_SUCCESS_URL || window.location.origin + '/success.html',
    CANCEL_URL: process.env.STRIPE_CANCEL_URL || window.location.origin + '/cancel.html'
};

// Product information for display
export const PRODUCTS = {
    SINGLE: {
        name: 'EOS 3.5 Gas Mixture - Single Purchase',
        description: '1 Liter 3.7% Ethane BAL Xenon for EOS 3.5 X-Ray Machines',
        price: 9999,
        currency: 'usd',
        type: 'one_time',
        productId: '$productSingle',
        priceId: '$priceSingle'
    },
    SUBSCRIPTION: {
        name: 'EOS 3.5 Gas Mixture - Annual Subscription',
        description: 'Annual supply of 1 Liter 3.7% Ethane BAL Xenon',
        price: 9499,
        currency: 'usd',
        type: 'subscription',
        interval: 'year',
        productId: '$productSub',
        priceId: '$priceSub'
    }
};
"@

$configContent | Out-File -FilePath "src\stripe-config.js" -Encoding UTF8
Write-Host "[OK] Updated src/stripe-config.js" -ForegroundColor Green

# Create Firebase Functions config
Write-Host "Creating Firebase Functions config..." -ForegroundColor Yellow
$envContent = @"
# Stripe Configuration
# Generated on $(Get-Date)

# Get these from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Webhook secret - get this after setting up webhook endpoint
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Product Price IDs (auto-generated)
STRIPE_PRICE_SINGLE=$priceSingle
STRIPE_PRICE_SUBSCRIPTION=$priceSub

# Email configuration (existing)
EMAIL_APIKEY=YOUR_RESEND_API_KEY
EMAIL_FROM=noreply@apeximagegas.com
EMAIL_NOTIFICATION=admin@apeximagegas.com
"@

$envContent | Out-File -FilePath "functions\.env" -Encoding UTF8
Write-Host "[OK] Created functions\.env" -ForegroundColor Green

Write-Host ""
Write-Host "==================== SETUP COMPLETE ====================" -ForegroundColor Green
Write-Host ""
Write-Host "Products and Prices created:" -ForegroundColor Cyan
Write-Host "  Single Purchase Product: $productSingle" -ForegroundColor White
Write-Host "  Single Purchase Price: $priceSingle" -ForegroundColor White
Write-Host "  Subscription Product: $productSub" -ForegroundColor White
Write-Host "  Subscription Price: $priceSub" -ForegroundColor White
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Get your API keys from Stripe Dashboard:" -ForegroundColor Cyan
Write-Host "   https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
Write-Host ""
Write-Host "2. Update functions\.env with:" -ForegroundColor Cyan
Write-Host "   - Your Secret Key (sk_test_...)" -ForegroundColor White
Write-Host "   - Your Publishable Key (pk_test_...)" -ForegroundColor White
Write-Host ""
Write-Host "3. Set up webhook endpoint:" -ForegroundColor Cyan
Write-Host "   .\stripe.exe listen --forward-to https://YOUR-DOMAIN/stripeWebhook" -ForegroundColor White
Write-Host "   Copy the webhook signing secret (whsec_...) to functions\.env" -ForegroundColor White
Write-Host ""
Write-Host "4. Deploy Firebase Functions:" -ForegroundColor Cyan
Write-Host "   firebase deploy --only functions" -ForegroundColor White
Write-Host ""
Write-Host "========================================================" -ForegroundColor Green