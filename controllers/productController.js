import ProductModel from '../models/productModel.js';
import { 
  validateProduct, 
  validateUrls, 
  validateMediaAddition 
} from '../utils/validators.js';

const productModel = new ProductModel();

// POST /products
export const createProduct = (req, res) => {
  const { name, sku, image_urls = [], video_urls = [] } = req.body;
  
  // Validate required fields
  const validation = validateProduct({ name, sku });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  // Check for duplicate SKU
  if (productModel.isSkuExists(sku)) {
    return res.status(409).json({ 
      error: 'Duplicate SKU',
      message: `Product with SKU '${sku}' already exists`
    });
  }
  
  // Validate URLs if provided
  const imageValidation = validateUrls(image_urls, 20);
  if (!imageValidation.valid) {
    return res.status(400).json({ error: imageValidation.error });
  }
  
  const videoValidation = validateUrls(video_urls, 20);
  if (!videoValidation.valid) {
    return res.status(400).json({ error: videoValidation.error });
  }
  
  // Create product
  const product = productModel.createProduct({
    name,
    sku,
    image_urls,
    video_urls
  });
  
  return res.status(201).json(product);
};

// GET /products
export const listProducts = (req, res) => {
  let { limit = 20, offset = 0, page = null, page_size = null } = req.query;
  
  // Handle page/page_size alternative
  if (page !== null && page_size !== null) {
    offset = (parseInt(page) - 1) * parseInt(page_size);
    limit = parseInt(page_size);
  }
  
  // Parse and validate pagination parameters
  limit = Math.min(parseInt(limit) || 20, 100); // Max limit 100
  offset = Math.max(parseInt(offset) || 0, 0);
  
  const products = productModel.getProductsList(limit, offset);
  const total = productModel.getTotalCount();
  
  return res.json({
    data: products,
    pagination: {
      limit,
      offset,
      total,
      has_more: offset + limit < total
    }
  });
};

// GET /products/:id
export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = productModel.getProductById(id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  return res.json(product);
};

// POST /products/:id/media
export const addMedia = (req, res) => {
  const { id } = req.params;
  const { image_urls = [], video_urls = [] } = req.body;
  
  // Validate at least one media type provided
  const mediaValidation = validateMediaAddition(image_urls, video_urls);
  if (!mediaValidation.valid) {
    return res.status(400).json({ error: mediaValidation.error });
  }
  
  // Validate URLs
  const imageValidation = validateUrls(image_urls, 20);
  if (!imageValidation.valid) {
    return res.status(400).json({ error: imageValidation.error });
  }
  
  const videoValidation = validateUrls(video_urls, 20);
  if (!videoValidation.valid) {
    return res.status(400).json({ error: videoValidation.error });
  }
  
  // Add media to product
  const updatedProduct = productModel.addMedia(id, image_urls, video_urls);
  
  if (!updatedProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  return res.json({
    message: 'Media added successfully',
    product: updatedProduct
  });
};