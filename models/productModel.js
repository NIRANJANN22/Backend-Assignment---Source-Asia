import { v4 as uuidv4 } from 'uuid';

class ProductModel {
  constructor() {
    this.products = new Map(); 
    
    this.skuIndex = new Map(); 
    
  }

  createProduct(productData) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const product = {
      id,
      name: productData.name.trim(),
      sku: productData.sku.trim(),
      image_urls: productData.image_urls || [],
      video_urls: productData.video_urls || [],
      created_at: now,
      updated_at: now
    };
    
    this.products.set(id, product);
    this.skuIndex.set(product.sku, id);
    
    return product;
  }

  isSkuExists(sku) {
    return this.skuIndex.has(sku);
  }

  getProductById(id) {
    return this.products.get(id);
  }

  getProductsList(limit = 20, offset = 0) {
    const allProducts = Array.from(this.products.values());
    const paginatedProducts = allProducts.slice(offset, offset + limit);
    
    // Return only necessary fields for list view
    return paginatedProducts.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      image_count: product.image_urls.length,
      video_count: product.video_urls.length,
      thumbnail_url: product.image_urls[0] || null, // First image as thumbnail
      created_at: product.created_at
    }));
  }

  addMedia(productId, image_urls = [], video_urls = []) {
    const product = this.products.get(productId);
    if (!product) return null;
    
    if (image_urls.length > 0) {
      product.image_urls.push(...image_urls);
    }
    if (video_urls.length > 0) {
      product.video_urls.push(...video_urls);
    }
    
    product.updated_at = new Date().toISOString();
    this.products.set(productId, product);
    
    return product;
  }

  getTotalCount() {
    return this.products.size;
  }
}

export default ProductModel;