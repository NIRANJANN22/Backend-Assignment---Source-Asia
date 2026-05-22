import express from 'express';
import { handleRequest, getStats } from '../controllers/rateLimitController.js';

const router = express.Router();

router.post('/request', handleRequest);
router.get('/stats', getStats);

export default router;