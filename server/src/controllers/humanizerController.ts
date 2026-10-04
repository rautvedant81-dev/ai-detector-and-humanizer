import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { HumanizerService } from '../services/humanizerService.js';

export async function humanize(req: AuthRequest, res: Response) {
  try {
    const { text, tone, strength, style, preserveOptions, title } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter some text to humanize.' });
    }

    const userId = req.user?.id;
    const result = await HumanizerService.humanize(
      {
        text,
        tone,
        strength: Number(strength) || 2,
        style,
        preserveOptions
      },
      userId,
      title
    );

    return res.status(200).json({
      success: true,
      data: result,
      positioning: 'Humanization improves readability, natural variation, and flow while striving to preserve your core meaning.'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Humanization process failed. Please try again.' });
  }
}

export async function getHumanizationById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const record = await HumanizerService.getById(id);

    if (!record) {
      return res.status(404).json({ error: 'Humanization record not found.' });
    }

    return res.json({
      success: true,
      data: record
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve humanization.' });
  }
}
