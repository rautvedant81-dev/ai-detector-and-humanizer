import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { DetectorService } from '../services/detectorService.js';

export async function detectText(req: AuthRequest, res: Response) {
  try {
    const { text, title } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter some text before analyzing.' });
    }

    if (text.trim().split(/\s+/).length < 3) {
      return res.status(400).json({ error: 'Please provide more text for a more useful analysis (at least 3-5 words).' });
    }

    const userId = req.user?.id;
    const result = await DetectorService.analyze(text, userId, title);

    return res.status(200).json({
      success: true,
      data: result,
      disclaimer: 'AI detection is probabilistic and should be treated as an assessment, not definitive proof of authorship.'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Analysis is temporarily unavailable. Please try again.' });
  }
}

export async function getDetectionById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const record = await DetectorService.getById(id);

    if (!record) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

    return res.json({
      success: true,
      data: record
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve analysis.' });
  }
}
