#!/bin/bash

# Stripe Setup Script for Apex Gas
# This script creates products and prices in Stripe programmatically

echo "Setting up Stripe products and prices..."

# Check if stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "Stripe CLI is not installed. Please install it first."
    exit 1
fi

# Login to Stripe (if not already logged in)
echo "Checking Stripe authentication..."
stripe config --list > /dev/null 2>&1 || stripe login

# Create Product 1: Single Purchase
echo "Creating single purchase product..."
PRODUCT_SINGLE=$(stripe products create \
  --name="EOS 3.5 Gas Mixture - Single Purchase" \
  --description="1 Liter 3.7% Ethane BAL Xenon for EOS 3.5 X-Ray Machines" \
  --json | grep -o '"id": "[^"]*' | grep -o '[^"]*$' | head -1)

echo "Product created: $PRODUCT_SINGLE"

# Create Price for Single Purchase
echo "Creating price for single purchase..."
PRICE_SINGLE=$(stripe prices create \
  --product="$PRODUCT_SINGLE" \
  --unit-amount=999900 \
  --currency=usd \
  --json | grep -o '"id": "[^"]*' | grep -o '[^"]*$' | head -1)

echo "Price created: $PRICE_SINGLE"

# Create Product 2: Annual Subscription
echo "Creating subscription product..."
PRODUCT_SUB=$(stripe products create \
  --name="EOS 3.5 Gas Mixture - Annual Subscription" \
  --description="Annual supply of 1 Liter 3.7% Ethane BAL Xenon" \
  --json | grep -o '"id": "[^"]*' | grep -o '[^"]*$' | head -1)

echo "Product created: $PRODUCT_SUB"

# Create Price for Subscription
echo "Creating price for subscription..."
PRICE_SUB=$(stripe prices create \
  --product="$PRODUCT_SUB" \
  --unit-amount=949900 \
  --currency=usd \
  --recurring="interval=year" \
  --json | grep -o '"id": "[^"]*' | grep -o '[^"]*$' | head -1)

echo "Price created: $PRICE_SUB"

# Create .env file with the IDs
echo "Creating .env.local file..."
cat > .env.local << EOF
# Stripe Configuration (Generated)
STRIPE_PRICE_SINGLE=$PRICE_SINGLE
STRIPE_PRICE_SUBSCRIPTION=$PRICE_SUB
STRIPE_PRODUCT_SINGLE=$PRODUCT_SINGLE
STRIPE_PRODUCT_SUBSCRIPTION=$PRODUCT_SUB
EOF

# Also create Firebase Functions config
echo "Setting Firebase Functions config..."
cat > functions/.env << EOF
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
STRIPE_PRICE_SINGLE=$PRICE_SINGLE
STRIPE_PRICE_SUBSCRIPTION=$PRICE_SUB
EOF

echo "==================== SETUP COMPLETE ===================="
echo ""
echo "Products and Prices created:"
echo "  Single Purchase Product: $PRODUCT_SINGLE"
echo "  Single Purchase Price: $PRICE_SINGLE"
echo "  Subscription Product: $PRODUCT_SUB"
echo "  Subscription Price: $PRICE_SUB"
echo ""
echo "NEXT STEPS:"
echo "1. Add your Stripe Secret Key to functions/.env"
echo "2. Set up webhook endpoint and add webhook secret to functions/.env"
echo "3. Deploy Firebase Functions"
echo ""
echo "To set up webhook for local testing:"
echo "  stripe listen --forward-to localhost:5001/stripeWebhook"
echo ""
echo "========================================================"