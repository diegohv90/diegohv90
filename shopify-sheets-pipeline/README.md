# Shopify to Google Sheets Pipeline

Automated pipeline to extract data from a Shopify store and sync it with Google Sheets. Designed to work with collaborator access (does not require administrator permissions).

## 📋 Features

- ✅ Data extraction from Shopify using Admin API
- ✅ Works with collaborator access (you don't need to be admin)
- ✅ Support for multiple data types:
  - Products
  - Orders
  - Customers
  - Inventory
- ✅ Automatic synchronization with Google Sheets
- ✅ Automatic spreadsheet formatting
- ✅ Robust error handling

## 🚀 Installation

### 1. Install dependencies

```bash
cd shopify-sheets-pipeline
npm install
```

### 2. Configure Shopify

As a collaborator in a Shopify store, you need to obtain an access token:

#### Option A: Token provided by the store owner

Request the store administrator to create an access token with the following permissions:
- `read_products` (for products)
- `read_orders` (for orders)
- `read_customers` (for customers)
- `read_inventory` (for inventory)

#### Option B: Custom app (if you have access)

1. Go to your Shopify store: `https://YOUR-STORE.myshopify.com/admin/apps`
2. Navigate to "Apps" → "App development" → "Create an app"
3. Configure the necessary scopes
4. Generate the Access Token

### 3. Configure Google Sheets

#### Create a Google service account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on "Enable"
4. Create a service account:
   - Go to "APIs & Services" → "Credentials"
   - Click on "Create Credentials" → "Service Account"
   - Complete the form and click "Create"
   - You don't need to grant additional roles
5. Generate a key:
   - Click on the created service account
   - Go to the "Keys" tab
   - Click on "Add Key" → "Create new key"
   - Select "JSON" and download the file
6. Save the downloaded file as `credentials.json` in this directory

#### Configure the Spreadsheet

1. Create a new Google Sheet or open an existing one
2. Share the sheet with the service account email (you'll find the email in `credentials.json`, something like `xxx@xxx.iam.gserviceaccount.com`)
3. Grant "Editor" permissions
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 4. Configure environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Configure the following variables:

```env
# Your Shopify store URL (without https://)
SHOPIFY_STORE_URL=your-store.myshopify.com

# Shopify access token
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx

# Google Spreadsheet ID
GOOGLE_SPREADSHEET_ID=1abc123def456...

# Sheet name (default: Sheet1)
GOOGLE_SHEET_NAME=Products

# Data type to extract: products, orders, customers, inventory
DATA_TO_PULL=products
```

## 📖 Usage

### Run the pipeline

```bash
npm start
```

Or directly:

```bash
node index.js
```

### Example output

```
=== Shopify to Google Sheets Pipeline ===

Store: my-store.myshopify.com
Data Type: products
Target Sheet: Products

Step 1: Extracting data from Shopify...
Fetching products from Shopify...
Successfully fetched 45 products
Extracted 45 records from Shopify

Step 2: Uploading data to Google Sheets...
Successfully authenticated with Google Sheets API
Uploading 45 rows to Google Sheets...
Cleared existing data from sheet
Successfully uploaded 46 rows to Google Sheets
Updated cells: 368

Step 3: Formatting sheet...
Sheet formatted successfully

=== Pipeline completed successfully! ===
View your spreadsheet: https://docs.google.com/spreadsheets/d/1abc123def456...
```

## 📊 Supported data types

### Products
Extracts product information:
- ID
- Title
- Vendor
- Product type
- Creation and update dates
- Status
- Tags
- Variant count
- Price

### Orders
Extracts order information:
- ID and order number
- Customer email
- Dates
- Prices (total, subtotal, taxes)
- Financial status
- Fulfillment status
- Item count

### Customers
Extracts customer information:
- ID
- Email
- First and last name
- Order count
- Total spent
- Dates
- State

### Inventory
Extracts inventory levels:
- Item ID
- Location ID
- Available quantity
- Update date

## 🔧 Project structure

```
shopify-sheets-pipeline/
├── index.js                    # Main pipeline script
├── config.js                   # Configuration and environment variables
├── shopifyExtractor.js         # Module to extract data from Shopify
├── googleSheetsUploader.js     # Module to upload data to Google Sheets
├── package.json                # Project dependencies
├── .env.example               # Environment variables example
├── .env                       # Environment variables (not included in git)
├── credentials.json           # Google credentials (not included in git)
└── README.md                  # This file
```

## 🔐 Security

- ⚠️ **NEVER** share or commit the `.env` or `credentials.json` files
- These files are included in `.gitignore`
- Keep your tokens and credentials secure
- Revoke tokens you no longer need

## 🐛 Troubleshooting

### Error: "Authentication failed"
- Verify that your `SHOPIFY_ACCESS_TOKEN` is valid
- Ensure the token has the necessary permissions
- Verify that `credentials.json` is present and valid

### Error: "credentials.json not found"
- Make sure you have downloaded and placed the credentials file in the project directory
- Verify that the file name is exactly `credentials.json`

### Error: "Sheet not found"
- Verify that `GOOGLE_SHEET_NAME` matches the tab name in your spreadsheet
- Ensure the service account has access to the spreadsheet

### Error: "Rate limit exceeded"
- Shopify has API limits (2 requests/second for most plans)
- The script already includes basic handling, but if you have a lot of data, consider adding delays

## 📝 Automation (Optional)

### Using cron (Linux/macOS)

To run the pipeline automatically, add an entry to crontab:

```bash
# Run every day at 2:00 AM
0 2 * * * cd /path/to/shopify-sheets-pipeline && node index.js >> logs/pipeline.log 2>&1
```

### Using Task Scheduler (Windows)

1. Open Task Scheduler
2. Create a new basic task
3. Configure the trigger (schedule)
4. Configure the action: run `node.exe` with the path argument to `index.js`

## 🤝 Support

If you encounter problems or have questions:
- Email: diego.huamantica@outlook.com
- Open an issue in the repository

## 📄 License

MIT License - Feel free to use and modify according to your needs.

---

Developed by Diego Huamantica
