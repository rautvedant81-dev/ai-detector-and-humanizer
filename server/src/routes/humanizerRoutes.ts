import { Router } from 'express';
import { humanize, getHumanizationById } from '../controllers/humanizerController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', apiLimiter, optionalAuth, humanize);
router.get('/:id', optionalAuth, getHumanizationById);

export default router;
