import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { memoryStore } from '../services/dbService.js';

export async function getHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { type, filter, search } = req.query;

    let items: any[] = [];

    // Collect from memoryStore
    if (!type || type === 'all' || type === 'detector') {
      memoryStore.analyses.forEach((a) => {
        if (!userId || a.user_id === userId || a.user_id === 'demo-user-123') {
          items.push({
            id: a.id,
            type: 'detector',
            title: a.title,
            wordCount: a.word_count,
            score: a.ai_probability,
            humanScore: a.human_probability,
            classification: a.classification,
            confidence: a.confidence,
            createdAt: a.created_at
          });
        }
      });
    }

    if (!type || type === 'all' || type === 'humanizer') {
      memoryStore.humanizations.forEach((h) => {
        if (!userId || h.user_id === userId || h.user_id === 'demo-user-123') {
          items.push({
            id: h.id,
            type: 'humanizer',
            title: h.title,
            wordCount: h.word_count_after,
            readabilityImprovement: h.readability_change,
            tone: h.tone,
            strength: h.strength,
            createdAt: h.created_at
          });
        }
      });
    }

    // Sort by latest
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Search filter
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(item => item.title.toLowerCase().includes(q));
    }

    // Date range filter
    if (filter === 'today') {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      items = items.filter(item => new Date(item.createdAt).getTime() >= oneDayAgo);
    } else if (filter === 'week') {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      items = items.filter(item => new Date(item.createdAt).getTime() >= sevenDaysAgo);
    } else if (filter === 'month') {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      items = items.filter(item => new Date(item.createdAt).getTime() >= thirtyDaysAgo);
    }

    return res.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch history.' });
  }
}

export async function getDocumentDetail(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    if (id.startsWith('analysis') || memoryStore.analyses.has(id)) {
      const analysis = memoryStore.analyses.get(id);
      if (analysis) {
        return res.json({
          success: true,
          type: 'detector',
          data: analysis
        });
      }
    }

    if (id.startsWith('humanize') || memoryStore.humanizations.has(id)) {
      const humanization = memoryStore.humanizations.get(id);
      if (humanization) {
        return res.json({
          success: true,
          type: 'humanizer',
          data: humanization
        });
      }
    }

    return res.status(404).json({ error: 'Document record not found.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching document detail.' });
  }
}

export async function renameDocument(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Valid title is required.' });
    }

    if (memoryStore.analyses.has(id)) {
      const a = memoryStore.analyses.get(id)!;
      a.title = title.trim();
      return res.json({ success: true, message: 'Document renamed successfully.' });
    }

    if (memoryStore.humanizations.has(id)) {
      const h = memoryStore.humanizations.get(id)!;
      h.title = title.trim();
      return res.json({ success: true, message: 'Document renamed successfully.' });
    }

    return res.status(404).json({ error: 'Document not found.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error renaming document.' });
  }
}

export async function deleteDocument(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    let deleted = false;
    if (memoryStore.analyses.has(id)) {
      memoryStore.analyses.delete(id);
      deleted = true;
    }
    if (memoryStore.humanizations.has(id)) {
      memoryStore.humanizations.delete(id);
      deleted = true;
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    return res.json({ success: true, message: 'Document deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error deleting document.' });
  }
}

export async function clearAllHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id || 'demo-user-123';

    for (const [key, val] of memoryStore.analyses.entries()) {
      if (val.user_id === userId || val.user_id === 'demo-user-123') {
        memoryStore.analyses.delete(key);
      }
    }

    for (const [key, val] of memoryStore.humanizations.entries()) {
      if (val.user_id === userId || val.user_id === 'demo-user-123') {
        memoryStore.humanizations.delete(key);
      }
    }

    return res.json({ success: true, message: 'All analysis and humanization history cleared.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error clearing history.' });
  }
}
