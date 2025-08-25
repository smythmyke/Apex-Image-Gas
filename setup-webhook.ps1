# Stripe Webhook Setup Script

Write-Host "Setting up Stripe Webhook..." -ForegroundColor Green

# Get the Firebase Functions URL
$projectId = "apex-gas-9920e"
$region = "us-central1"
$functionName = "stripeWebhook"

# Construct the webhook URL
$webhookUrl = "https://$region-$projectId.cloudfunctions.net/$functionName"

Write-Host "Webhook URL: $webhookUrl" -ForegroundColor Cyan
Write-Host ""

# Create webhook endpoint in Stripe
Write-Host "Creating webhook endpoint in Stripe..." -ForegroundColor Yellow

$webhookResult = .\stripe.exe webhook_endpoints create `
  --url="$webhookUrl" `
  --enabled-events="checkout.session.completed" `
  --enabled-events="customer.subscription.created" `
  --enabled-events="customer.subscription.updated" `
  --enabled-events="customer.subscription.deleted" 2>&1 | Out-String

Write-Host $webhookResult -ForegroundColor DarkGray

# Extract webhook secret
if ($webhookResult -match '"secret":\s*"(whsec_[^"]+)"') {
    $webhookSecret = $matches[1]
    Write-Host "[OK] Webhook created with secret: $webhookSecret" -ForegroundColor Green
    
    # Update functions\.env
    Write-Host "Updating functions\.env with webhook secret..." -ForegroundColor Yellow
    
    $envPath = "functions\.env"
    $envContent = Get-Content $envPath -Raw
    $envContent = $envContent -replace "STRIPE_WEBHOOK_SECRET=.*", "STRIPE_WEBHOOK_SECRET=$webhookSecret"
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    
    Write-Host "[OK] Updated functions\.env" -ForegroundColor Green
    Write-Host ""
    Write-Host "==================== WEBHOOK CONFIGURED ====================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Webhook URL: $webhookUrl" -ForegroundColor Cyan
    Write-Host "Webhook Secret: $webhookSecret" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANT: Now redeploy functions with:" -ForegroundColor Yellow
    Write-Host "  firebase deploy --only functions" -ForegroundColor White
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
} else {
    Write-Host "Could not create webhook. Please create manually in Stripe Dashboard:" -ForegroundColor Red
    Write-Host "1. Go to https://dashboard.stripe.com/test/webhooks" -ForegroundColor Yellow
    Write-Host "2. Click 'Add endpoint'" -ForegroundColor Yellow
    Write-Host "3. Enter URL: $webhookUrl" -ForegroundColor Yellow
    Write-Host "4. Select events: checkout.session.completed, customer.subscription.*" -ForegroundColor Yellow
    Write-Host "5. Copy the signing secret to functions\.env" -ForegroundColor Yellow
}

# For local testing
Write-Host ""
Write-Host "For local testing, use:" -ForegroundColor Cyan
Write-Host "  .\stripe.exe listen --forward-to $webhookUrl" -ForegroundColor White