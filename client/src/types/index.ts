export type ClassificationType = 'likely_human' | 'mixed' | 'likely_ai';

export interface SentenceAnalysis {
  text: string;
  score: number; // 0 to 1
  classification: 'human_like' | 'mixed' | 'ai_like';
  reasons: string[];
}

export interface DetectionResult {
  id?: string;
  aiProbability: number;
  humanProbability: number;
  confidence: 'low' | 'medium' | 'high';
  classification: ClassificationType;
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  sentences: SentenceAnalysis[];
  insights: string[];
  suggestions: string[];
  createdAt?: string;
}

export interface DiffChunk {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export interface HumanizeOptions {
  text: string;
  tone: 'natural' | 'professional' | 'academic' | 'casual' | 'friendly' | 'persuasive' | 'formal' | 'simple' | 'conversational';
  strength: number; // 1, 2, 3, 4
  style: 'clear' | 'concise' | 'detailed' | 'engaging' | 'personal';
  preserveOptions: {
    meaning: boolean;
    facts: boolean;
    citations: boolean;
    technical: boolean;
    urls: boolean;
    numbers: boolean;
    formatting: boolean;
  };
}

export interface HumanizeResult {
  id?: string;
  originalText: string;
  improvedText: string;
  wordCountBefore: number;
  wordCountAfter: number;
  readabilityChange: number;
  changes: {
    type: string;
    description: string;
  }[];
  diff: DiffChunk[];
  createdAt?: string;
}

export interface HistoryItem {
  id: string;
  type: 'detector' | 'humanizer';
  title: string;
  wordCount: number;
  score?: number;
  humanScore?: number;
  classification?: string;
  confidence?: string;
  readabilityImprovement?: number;
  tone?: string;
  strength?: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'pro' | 'admin';
  createdAt?: string;
  avatarUrl?: string;
}

export interface UserSettings {
  defaultTone: string;
  defaultStrength: number;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
}
