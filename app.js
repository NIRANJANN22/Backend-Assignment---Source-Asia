import express from 'express';
import rateLimitRoutes from './routes/rateLimitRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.use('/', rateLimitRoutes);
app.use('/', productRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    parts: ['rate-limited-api', 'product-catalog']
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Rate-limited API endpoints:`);
  console.log(`   POST /request`);
  console.log(`   GET /stats`);
  console.log(`📦 Product catalog endpoints:`);
  console.log(`   POST /products`);
  console.log(`   GET /products?limit=20&offset=0`);
  console.log(`   GET /products/{id}`);
  console.log(`   POST /products/{id}/media`);
});

export default app;