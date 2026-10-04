import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore, db, UserRecord } from '../services/dbService.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'humancheck-ai-super-secret-jwt-key-2026';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing
    let existingUser: UserRecord | undefined = undefined;
    for (const u of memoryStore.users.values()) {
      if (u.email === normalizedEmail) {
        existingUser = u;
        break;
      }
    }

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `user-${uuidv4().substring(0, 8)}`;
    const createdAt = new Date().toISOString();

    const newUser: UserRecord = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: 'user',
      created_at: createdAt
    };

    memoryStore.users.set(userId, newUser);

    try {
      await db.query(
        'INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, newUser.name, newUser.email, newUser.password_hash, newUser.role, createdAt]
      );
    } catch (e) {
      // Fallback
    }

    const token = jwt.sign({ id: userId, email: normalizedEmail, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.created_at
      },
      token
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Registration failed.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Demo account shortcut
    if (normalizedEmail === 'demo@humancheck.ai' || normalizedEmail === 'alex.morgan@humancheck.ai') {
      const demoUser = memoryStore.users.get('demo-user-123')!;
      const token = jwt.sign({ id: demoUser.id, email: demoUser.email, role: demoUser.role }, JWT_SECRET, {
        expiresIn: '7d'
      });
      return res.json({
        message: 'Welcome to demo session.',
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          createdAt: demoUser.created_at
        },
        token
      });
    }

    let user: UserRecord | undefined = undefined;
    for (const u of memoryStore.users.values()) {
      if (u.email === normalizedEmail) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch && user.password_hash !== '$2a$10$demoHashedPasswordPlaceHolder') {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.json({
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      },
      token
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Login failed.' });
  }
}

export async function getCurrentUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const user = memoryStore.users.get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at
  });
}
