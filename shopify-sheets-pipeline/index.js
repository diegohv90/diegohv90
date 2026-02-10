/**
 * Shopify to Google Sheets Pipeline
 * Main entry point for syncing data from Shopify to Google Sheets
 */

const config = require('./config');
const ShopifyExtractor = require('./shopifyExtractor');
const GoogleSheetsUploader = require('./googleSheetsUploader');

async function runPipeline() {
  console.log('=== Shopify to Google Sheets Pipeline ===\n');

  try {
    // Validate configuration
    if (!config.shopify.storeUrl) {
      throw new Error('SHOPIFY_STORE_URL is not configured. Please set it in .env file');
    }
    if (!config.shopify.accessToken) {
      throw new Error('SHOPIFY_ACCESS_TOKEN is not configured. Please set it in .env file');
    }
    if (!config.googleSheets.spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not configured. Please set it in .env file');
    }

    console.log(`Store: ${config.shopify.storeUrl}`);
    console.log(`Data Type: ${config.dataToPull}`);
    console.log(`Target Sheet: ${config.googleSheets.sheetName}\n`);

    // Step 1: Extract data from Shopify
    console.log('Step 1: Extracting data from Shopify...');
    const extractor = new ShopifyExtractor(
      config.shopify.storeUrl,
      config.shopify.accessToken
    );
    
    const data = await extractor.getData(config.dataToPull);
    console.log(`Extracted ${data.length} records from Shopify\n`);

    if (data.length === 0) {
      console.log('No data to upload. Pipeline completed.');
      return;
    }

    // Step 2: Upload data to Google Sheets
    console.log('Step 2: Uploading data to Google Sheets...');
    const uploader = new GoogleSheetsUploader(
      config.googleSheets.spreadsheetId,
      config.googleSheets.sheetName
    );
    
    await uploader.uploadData(data);
    
    // Step 3: Format the sheet
    console.log('\nStep 3: Formatting sheet...');
    await uploader.formatSheet();

    console.log('\n=== Pipeline completed successfully! ===');
    console.log(`View your spreadsheet: https://docs.google.com/spreadsheets/d/${config.googleSheets.spreadsheetId}`);

  } catch (error) {
    console.error('\n=== Pipeline failed ===');
    console.error('Error:', error.message);
    
    if (error.response && error.response.status === 401) {
      console.error('\nAuthentication failed. Please check your credentials:');
      console.error('- For Shopify: Verify SHOPIFY_ACCESS_TOKEN is valid');
      console.error('- For Google Sheets: Ensure credentials.json is properly configured');
    }
    
    process.exit(1);
  }
}

// Run the pipeline
if (require.main === module) {
  runPipeline();
}

module.exports = { runPipeline };
