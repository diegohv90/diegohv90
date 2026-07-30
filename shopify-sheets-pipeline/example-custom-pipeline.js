/**
 * Example: Using the pipeline programmatically
 * This shows how to use the pipeline components in your own scripts
 */

const ShopifyExtractor = require('./shopifyExtractor');
const GoogleSheetsUploader = require('./googleSheetsUploader');

async function customPipeline() {
  // Configure your credentials
  const shopifyConfig = {
    storeUrl: 'your-store.myshopify.com',
    accessToken: 'your-access-token',
  };

  const googleConfig = {
    spreadsheetId: 'your-spreadsheet-id',
    sheetName: 'MyCustomSheet',
  };

  try {
    // Example 1: Get products and upload to one sheet
    console.log('Syncing products...');
    const productExtractor = new ShopifyExtractor(
      shopifyConfig.storeUrl,
      shopifyConfig.accessToken
    );
    const products = await productExtractor.getProducts();
    
    const productUploader = new GoogleSheetsUploader(
      googleConfig.spreadsheetId,
      'Products'
    );
    await productUploader.uploadData(products);
    await productUploader.formatSheet();
    console.log('Products synced!');

    // Example 2: Get orders and upload to another sheet
    console.log('Syncing orders...');
    const orders = await productExtractor.getOrders();
    
    const orderUploader = new GoogleSheetsUploader(
      googleConfig.spreadsheetId,
      'Orders'
    );
    await orderUploader.uploadData(orders);
    await orderUploader.formatSheet();
    console.log('Orders synced!');

    // Example 3: Filter and transform data before uploading
    console.log('Syncing active products only...');
    const allProducts = await productExtractor.getProducts();
    const activeProducts = allProducts.filter(p => p.status === 'active');
    
    const activeUploader = new GoogleSheetsUploader(
      googleConfig.spreadsheetId,
      'Active Products'
    );
    await activeUploader.uploadData(activeProducts);
    console.log('Active products synced!');

    console.log('All done!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  customPipeline();
}

module.exports = { customPipeline };
