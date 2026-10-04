import pg from 'pg';

const { Pool } = pg;

export interface AnalysisRecord {
  id: string;
  user_id?: string;
  title: string;
  input_text: string;
  ai_probability: number;
  human_probability: number;
  confidence: string;
  classification: string;
  word_count: number;
  character_count: number;
  sentence_count: number;
  paragraph_count: number;
  sentence_analysis: any;
  insights: any;
  suggestions: any;
  created_at: string;
}

export interface HumanizationRecord {
  id: string;
  user_id?: string;
  title: string;
  original_text: string;
  improved_text: string;
  tone: string;
  strength: number;
  style: string;
  preserve_options: any;
  word_count_before: number;
  word_count_after: number;
  readability_change: number;
  diff_data: any;
  created_at: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}

// In-memory mock store for instant zero-config startup and fallback
class MemoryStore {
  users: Map<string, UserRecord> = new Map();
  analyses: Map<string, AnalysisRecord> = new Map();
  humanizations: Map<string, HumanizationRecord> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Seed demo user
    const demoUser: UserRecord = {
      id: 'demo-user-123',
      name: 'Dr. Alex Morgan',
      email: 'alex.morgan@humancheck.ai',
      password_hash: '$2a$10$demoHashedPasswordPlaceHolder',
      role: 'pro',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    this.users.set(demoUser.id, demoUser);

    // Seed demo analyses
    const a1: AnalysisRecord = {
      id: 'analysis-demo-1',
      user_id: 'demo-user-123',
      title: 'Artificial Intelligence in Healthcare Paper',
      input_text: 'The implementation of artificial intelligence systems in clinical healthcare environments demonstrates significant improvements in diagnostic efficiency. Furthermore, it is important to note that automated neural networks play a pivotal role in predicting radiological anomalies. In conclusion, these technologies foster a holistic paradigm shift in modern medicine.',
      ai_probability: 78,
      human_probability: 22,
      confidence: 'high',
      classification: 'likely_ai',
      word_count: 51,
      character_count: 362,
      sentence_count: 3,
      paragraph_count: 1,
      sentence_analysis: [
        {
          text: 'The implementation of artificial intelligence systems in clinical healthcare environments demonstrates significant improvements in diagnostic efficiency.',
          score: 0.82,
          classification: 'ai_like',
          reasons: ['Predictable academic phrasing', 'Impersonal passive structure']
        },
        {
          text: 'Furthermore, it is important to note that automated neural networks play a pivotal role in predicting radiological anomalies.',
          score: 0.88,
          classification: 'ai_like',
          reasons: ['Contains cliché transitions: "Furthermore"', 'Predictable formula: "plays a pivotal role"']
        },
        {
          text: 'In conclusion, these technologies foster a holistic paradigm shift in modern medicine.',
          score: 0.65,
          classification: 'mixed',
          reasons: ['Formulaic closing statement: "In conclusion"', 'High-frequency buzzwords']
        }
      ],
      insights: [
        'Sentence structures are highly consistent throughout.',
        'Paragraph uses generic academic transition markers.',
        'Impersonal formal phrasing without specific empirical citations.'
      ],
      suggestions: [
        'Add specific case studies, clinical data points, or hospital benchmarks.',
        'Vary sentence lengths with concise conversational statements.',
        'Remove redundant transition phrases like "Furthermore" and "In conclusion".'
      ],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    };
    this.analyses.set(a1.id, a1);

    const a2: AnalysisRecord = {
      id: 'analysis-demo-2',
      user_id: 'demo-user-123',
      title: 'Product Launch Blog Post',
      input_text: 'When we first started building our platform last summer, honestly we had no idea how tricky text analysis could be. We ran into so many weird edge cases—especially with short sentences and colloquial idioms. But after months of testing with real teachers and students, we finally got it feeling right.',
      ai_probability: 14,
      human_probability: 86,
      confidence: 'high',
      classification: 'likely_human',
      word_count: 54,
      character_count: 318,
      sentence_count: 3,
      paragraph_count: 1,
      sentence_analysis: [
        {
          text: 'When we first started building our platform last summer, honestly we had no idea how tricky text analysis could be.',
          score: 0.12,
          classification: 'human_like',
          reasons: ['Personal perspective ("we", "our")', 'Organic conversational words ("honestly")']
        },
        {
          text: 'We ran into so many weird edge cases—especially with short sentences and colloquial idioms.',
          score: 0.15,
          classification: 'human_like',
          reasons: ['Expressive punctuation (em dash)', 'Authentic terminology']
        },
        {
          text: 'But after months of testing with real teachers and students, we finally got it feeling right.',
          score: 0.16,
          classification: 'human_like',
          reasons: ['Dynamic sentence starter ("But")', 'Natural rhythm and authentic personal tone']
        }
      ],
      insights: [
        'High natural lexical diversity.',
        'Organic sentence length variation and expressive punctuation.',
        'Personal storytelling voice with authentic pacing.'
      ],
      suggestions: [
        'Writing already exhibits excellent human cadence and flow.',
        'Keep the relatable personal examples and conversational tone.'
      ],
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    };
    this.analyses.set(a2.id, a2);

    const h1: HumanizationRecord = {
      id: 'humanize-demo-1',
      user_id: 'demo-user-123',
      title: 'Executive Summary Rewrite',
      original_text: 'The implementation of the proposed system demonstrates significant improvements in operational efficiency. Furthermore, it is important to note that employees will utilize the dashboard daily.',
      improved_text: 'The proposed system clearly improves operational efficiency. Beyond that, keep in mind that our team will use the dashboard on a daily basis.',
      tone: 'natural',
      strength: 2,
      style: 'clear',
      preserve_options: { meaning: true, facts: true, citations: true, urls: true, numbers: true },
      word_count_before: 26,
      word_count_after: 25,
      readability_change: 22,
      diff_data: [],
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    };
    this.humanizations.set(h1.id, h1);
  }
}

export const memoryStore = new MemoryStore();

let pgPool: pg.Pool | null = null;

export function initDatabase(): pg.Pool | null {
  const connectionString = process.env.DATABASE_URL || (
    process.env.DB_HOST ? `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'humancheck_db'}` : null
  );

  if (!connectionString) {
    console.log('ℹ️  Running in Demo Mode: Using high-performance in-memory database store.');
    return null;
  }

  try {
    pgPool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000
    });

    pgPool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.warn('⚠️  PostgreSQL connection failed. Falling back to in-memory store:', err.message);
        pgPool = null;
      } else {
        console.log('✅ Connected to PostgreSQL database at:', res.rows[0].now);
      }
    });

    return pgPool;
  } catch (err) {
    console.warn('⚠️  Could not initialize PostgreSQL pool. Using in-memory store.');
    return null;
  }
}

export const db = {
  async query(text: string, params?: any[]) {
    if (pgPool) {
      return pgPool.query(text, params);
    }
    return null;
  }
};
