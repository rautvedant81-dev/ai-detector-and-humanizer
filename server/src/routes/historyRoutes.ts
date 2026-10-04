import { Router } from 'express';
import {
  getHistory,
  getDocumentDetail,
  renameDocument,
  deleteDocument,
  clearAllHistory
} from '../controllers/historyController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getHistory);
router.get('/:id', optionalAuth, getDocumentDetail);
router.patch('/:id', optionalAuth, renameDocument);
router.delete('/:id', optionalAuth, deleteDocument);
router.delete('/', optionalAuth, clearAllHistory);

export default router;
