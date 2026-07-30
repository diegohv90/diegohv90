/**
 * Test script to validate Shopify and Google Sheets configuration
 * Run this before running the main pipeline to ensure everything is set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('=== Configuration Validation Script ===\n');

let hasErrors = false;

// Check if .env file exists
console.log('Checking .env file...');
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  console.log('   Please copy .env.example to .env and configure your credentials');
  hasErrors = true;
} else {
  console.log('✅ .env file exists');
  
  // Load environment variables
  require('dotenv').config();
  
  // Check required environment variables
  const requiredVars = [
    'SHOPIFY_STORE_URL',
    'SHOPIFY_ACCESS_TOKEN',
    'GOOGLE_SPREADSHEET_ID'
  ];
  
  console.log('\nChecking environment variables...');
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].includes('your-')) {
      console.error(`❌ ${varName} is not configured`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName} is configured`);
    }
  }
}

// Check if credentials.json exists
console.log('\nChecking Google credentials...');
const credPath = path.join(__dirname, 'credentials.json');
if (!fs.existsSync(credPath)) {
  console.error('❌ credentials.json file not found');
  console.log('   Please add your Google service account credentials');
  console.log('   See README.md for instructions');
  hasErrors = true;
} else {
  console.log('✅ credentials.json file exists');
  
  try {
    const credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    if (credentials.type === 'service_account') {
      console.log('✅ Valid service account credentials format');
      console.log(`   Service account: ${credentials.client_email}`);
    } else {
      console.error('❌ Invalid credentials format');
      hasErrors = true;
    }
  } catch (error) {
    console.error('❌ Error reading credentials.json:', error.message);
    hasErrors = true;
  }
}

// Check if node_modules exists
console.log('\nChecking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ Dependencies not installed');
  console.log('   Run: npm install');
  hasErrors = true;
} else {
  console.log('✅ Dependencies are installed');
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Configuration has errors. Please fix them before running the pipeline.');
  process.exit(1);
} else {
  console.log('✅ Configuration looks good! You can now run the pipeline with: npm start');
  process.exit(0);
}
