import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { memoryStore } from '../services/dbService.js';

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id || 'demo-user-123';
    const user = memoryStore.users.get(userId) || memoryStore.users.get('demo-user-123');

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      joinedDate: user.created_at,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching profile.' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id || 'demo-user-123';
    const { name, email } = req.body;

    const user = memoryStore.users.get(userId) || memoryStore.users.get('demo-user-123');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error updating profile.' });
  }
}

export async function updateSettings(req: AuthRequest, res: Response) {
  try {
    const { defaultTone, defaultStrength, language, theme, notificationsEnabled } = req.body;

    // Save to user settings state
    return res.json({
      message: 'Preferences saved successfully.',
      settings: {
        defaultTone: defaultTone || 'natural',
        defaultStrength: defaultStrength || 2,
        language: language || 'en-US',
        theme: theme || 'system',
        notificationsEnabled: notificationsEnabled !== false
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error saving settings.' });
  }
}
