# Quick Start Guide

This guide will help you set up the pipeline in 5 minutes.

## Step 1: Install dependencies

```bash
cd shopify-sheets-pipeline
npm install
```

## Step 2: Configure environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env  # or use your favorite editor
```

Configure these variables:

```env
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
GOOGLE_SPREADSHEET_ID=1abc123def...
GOOGLE_SHEET_NAME=Sheet1
DATA_TO_PULL=products
```

### How to get the Shopify Access Token?

**As a collaborator**, request the store administrator to:

1. Go to: Settings → Apps and sales channels → Develop apps
2. Create a new custom app
3. Configure the permissions:
   - `read_products` for products
   - `read_orders` for orders
   - `read_customers` for customers
   - `read_inventory` for inventory
4. Install the app and copy the "Admin API access token"
5. Share that token with you securely

### How to get the Google Spreadsheet ID?

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/[THIS-IS-THE-ID]/edit`
3. Copy the ID that is between `/d/` and `/edit`

## Step 3: Configure Google credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Google Sheets API
4. Create a Service Account
5. Download the credentials in JSON format
6. Save them as `credentials.json` in this directory

**Important:** Share your Google Sheet with the service account email (it's in the JSON file, something like `xxx@xxx.iam.gserviceaccount.com`)

## Step 4: Validate configuration

```bash
npm run test-config
```

If everything is correct, you'll see:

```
✅ Configuration looks good!
```

## Step 5: Run the pipeline

```bash
npm start
```

## What data can I extract?

Change `DATA_TO_PULL` in your `.env` file to one of these values:

- `products` - Store products
- `orders` - Orders and sales
- `customers` - Customer base
- `inventory` - Inventory levels

## Quick troubleshooting

### Error: "credentials.json not found"
→ Make sure you have downloaded and saved the Google credentials file

### Error: "Authentication failed"
→ Verify that your Shopify token is valid and has the correct permissions

### Error: "Sheet not found"
→ Verify that you have shared the sheet with the Google service account

## Need help?

Read the [complete README](README.md) for more details or contact: diego.huamantica@outlook.com
