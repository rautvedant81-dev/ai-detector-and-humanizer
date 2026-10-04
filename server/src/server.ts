import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import detectorRoutes from './routes/detectorRoutes.js';
import humanizerRoutes from './routes/humanizerRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initDatabase } from './services/dbService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middleware
app.use(helmet({
  contentSecurityPolicy: false // Allows dev asset loading
}));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Initialize Database connection (gracefully falls back to memory store if unavailable)
initDatabase();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'HumanCheck AI',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/detect', detectorRoutes);
app.use('/api/humanize', humanizerRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/user', userRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 HumanCheck AI Server running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`=========================================`);
  });
}

export default app;
