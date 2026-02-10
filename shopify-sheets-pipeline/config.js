/**
 * Configuration file for Shopify and Google Sheets integration
 */

require('dotenv').config();

module.exports = {
  shopify: {
    storeUrl: process.env.SHOPIFY_STORE_URL,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
  },
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    sheetName: process.env.GOOGLE_SHEET_NAME || 'Sheet1',
  },
  dataToPull: process.env.DATA_TO_PULL || 'products',
};
