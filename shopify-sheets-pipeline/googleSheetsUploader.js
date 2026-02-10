/**
 * Google Sheets Uploader
 * This module handles authentication and data upload to Google Sheets
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleSheetsUploader {
  constructor(spreadsheetId, sheetName = 'Sheet1') {
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    this.auth = null;
    this.sheets = null;
  }

  /**
   * Authenticate with Google Sheets API
   * This uses service account credentials from credentials.json
   */
  async authenticate() {
    try {
      const credentialsPath = path.join(__dirname, 'credentials.json');
      
      if (!fs.existsSync(credentialsPath)) {
        throw new Error(
          'credentials.json not found. Please add your Google service account credentials file.'
        );
      }

      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('Successfully authenticated with Google Sheets API');
    } catch (error) {
      console.error('Error authenticating with Google Sheets:', error.message);
      throw error;
    }
  }

  /**
   * Convert array of objects to 2D array for Google Sheets
   */
  dataToRows(data) {
    if (!data || data.length === 0) {
      return [];
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Convert each object to array of values
    const rows = data.map(item => 
      headers.map(header => {
        const value = item[header];
        return value !== null && value !== undefined ? String(value) : '';
      })
    );

    return [headers, ...rows];
  }

  /**
   * Clear existing data in the sheet
   */
  async clearSheet() {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: this.sheetName,
      });
      console.log('Cleared existing data from sheet');
    } catch (error) {
      console.error('Error clearing sheet:', error.message);
      throw error;
    }
  }

  /**
   * Upload data to Google Sheets
   */
  async uploadData(data) {
    try {
      if (!this.sheets) {
        await this.authenticate();
      }

      if (!data || data.length === 0) {
        console.log('No data to upload');
        return;
      }

      console.log(`Uploading ${data.length} rows to Google Sheets...`);

      // Convert data to rows format
      const rows = this.dataToRows(data);

      // Clear existing data first
      await this.clearSheet();

      // Upload new data
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: rows,
        },
      });

      console.log(`Successfully uploaded ${rows.length} rows to Google Sheets`);
      console.log(`Updated cells: ${response.data.updatedCells}`);
      return response.data;
    } catch (error) {
      console.error('Error uploading data to Google Sheets:', error.message);
      throw error;
    }
  }

  /**
   * Format the sheet with headers
   */
  async formatSheet() {
    try {
      if (!this.sheets) {
        await this.authenticate();
      }

      // Get sheet ID
      const sheetMetadata = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheet = sheetMetadata.data.sheets.find(
        s => s.properties.title === this.sheetName
      );

      if (!sheet) {
        console.log('Sheet not found for formatting');
        return;
      }

      const sheetId = sheet.properties.sheetId;

      // Format header row (bold, frozen)
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.9,
                      green: 0.9,
                      blue: 0.9,
                    },
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId: sheetId,
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
                fields: 'gridProperties.frozenRowCount',
              },
            },
          ],
        },
      });

      console.log('Sheet formatted successfully');
    } catch (error) {
      console.error('Error formatting sheet:', error.message);
      // Don't throw - formatting is optional
    }
  }
}

module.exports = GoogleSheetsUploader;
