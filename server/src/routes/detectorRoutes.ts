import { Router } from 'express';
import { detectText, getDetectionById } from '../controllers/detectorController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', apiLimiter, optionalAuth, detectText);
router.get('/:id', optionalAuth, getDetectionById);

export default router;
