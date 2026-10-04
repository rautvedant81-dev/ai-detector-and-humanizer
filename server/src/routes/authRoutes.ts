import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', (req, res) => res.json({ message: 'Logged out successfully.' }));
router.get('/me', requireAuth, getCurrentUser);

export default router;
