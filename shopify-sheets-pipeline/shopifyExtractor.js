/**
 * Shopify Data Extractor
 * This module handles extracting data from Shopify using the Admin API
 * Works with collaborator access (no need for admin privileges to create API tokens)
 */

const axios = require('axios');

class ShopifyExtractor {
  constructor(storeUrl, accessToken) {
    this.storeUrl = storeUrl.replace('https://', '').replace('http://', '');
    this.accessToken = accessToken;
    this.baseUrl = `https://${this.storeUrl}/admin/api/2024-01`;
  }

  /**
   * Make authenticated request to Shopify Admin API
   */
  async makeRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json',
        },
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Get products from Shopify store
   */
  async getProducts(limit = 250) {
    try {
      console.log('Fetching products from Shopify...');
      const data = await this.makeRequest('/products.json', { limit });
      const products = data.products || [];
      
      console.log(`Successfully fetched ${products.length} products`);
      return products.map(product => ({
        id: product.id,
        title: product.title,
        vendor: product.vendor,
        product_type: product.product_type,
        created_at: product.created_at,
        updated_at: product.updated_at,
        status: product.status,
        tags: product.tags,
        variants_count: product.variants ? product.variants.length : 0,
        price: product.variants && product.variants[0] ? product.variants[0].price : 'N/A',
      }));
    } catch (error) {
      console.error('Error fetching products:', error.message);
      throw error;
    }
  }

  /**
   * Get orders from Shopify store
   */
  async getOrders(limit = 250) {
    try {
      console.log('Fetching orders from Shopify...');
      const data = await this.makeRequest('/orders.json', { 
        limit,
        status: 'any'
      });
      const orders = data.orders || [];
      
      console.log(`Successfully fetched ${orders.length} orders`);
      return orders.map(order => ({
        id: order.id,
        order_number: order.order_number,
        email: order.email,
        created_at: order.created_at,
        updated_at: order.updated_at,
        total_price: order.total_price,
        subtotal_price: order.subtotal_price,
        total_tax: order.total_tax,
        financial_status: order.financial_status,
        fulfillment_status: order.fulfillment_status || 'unfulfilled',
        items_count: order.line_items ? order.line_items.length : 0,
      }));
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      throw error;
    }
  }

  /**
   * Get customers from Shopify store
   */
  async getCustomers(limit = 250) {
    try {
      console.log('Fetching customers from Shopify...');
      const data = await this.makeRequest('/customers.json', { limit });
      const customers = data.customers || [];
      
      console.log(`Successfully fetched ${customers.length} customers`);
      return customers.map(customer => ({
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        orders_count: customer.orders_count,
        total_spent: customer.total_spent,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        state: customer.state,
      }));
    } catch (error) {
      console.error('Error fetching customers:', error.message);
      throw error;
    }
  }

  /**
   * Get inventory levels from Shopify store
   */
  async getInventory(limit = 250) {
    try {
      console.log('Fetching inventory from Shopify...');
      
      // First, get locations
      const locationsData = await this.makeRequest('/locations.json');
      const locations = locationsData.locations || [];
      
      if (locations.length === 0) {
        console.log('No locations found');
        return [];
      }
      
      // Get inventory levels for the first location
      const locationId = locations[0].id;
      const inventoryData = await this.makeRequest('/inventory_levels.json', { 
        limit,
        location_ids: locationId
      });
      
      const inventoryLevels = inventoryData.inventory_levels || [];
      console.log(`Successfully fetched ${inventoryLevels.length} inventory items`);
      
      return inventoryLevels.map(item => ({
        inventory_item_id: item.inventory_item_id,
        location_id: item.location_id,
        available: item.available,
        updated_at: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching inventory:', error.message);
      throw error;
    }
  }

  /**
   * Get data based on type
   */
  async getData(dataType = 'products') {
    switch (dataType.toLowerCase()) {
      case 'products':
        return await this.getProducts();
      case 'orders':
        return await this.getOrders();
      case 'customers':
        return await this.getCustomers();
      case 'inventory':
        return await this.getInventory();
      default:
        console.warn(`Unknown data type: ${dataType}. Defaulting to products.`);
        return await this.getProducts();
    }
  }
}

module.exports = ShopifyExtractor;
