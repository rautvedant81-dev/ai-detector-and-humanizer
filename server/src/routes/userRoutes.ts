import { Router } from 'express';
import { getProfile, updateProfile, updateSettings } from '../controllers/userController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', optionalAuth, getProfile);
router.put('/profile', optionalAuth, updateProfile);
router.put('/settings', optionalAuth, updateSettings);

export default router;
