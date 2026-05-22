import express from 'express';
import { 
  createProduct, 
  listProducts, 
  getProductById, 
  addMedia 
} from '../controllers/productController.js';

const router = express.Router();

router.post('/products', createProduct);
router.get('/products', listProducts);
router.get('/products/:id', getProductById);
router.post('/products/:id/media', addMedia);

export default router;