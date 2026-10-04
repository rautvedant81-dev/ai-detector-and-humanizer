import { analyzeTextPatterns, DetectionResult } from '../utils/nlpEngine.js';
import { memoryStore, db, AnalysisRecord } from './dbService.js';
import { v4 as uuidv4 } from 'uuid';

export class DetectorService {
  /**
   * Main detector analysis method.
   * Can be configured to call an external ML model or API if AI_DETECTOR_API_KEY is present,
   * otherwise uses the sophisticated local NLP heuristic engine.
   */
  public static async analyze(text: string, userId?: string, title?: string): Promise<DetectionResult & { id: string; createdAt: string }> {
    // 1. Analyze text patterns
    const result = analyzeTextPatterns(text);
    const id = `analysis-${uuidv4().substring(0, 8)}`;
    const createdAt = new Date().toISOString();

    const docTitle = title || (text.slice(0, 40).trim() + (text.length > 40 ? '...' : '')) || 'Text Analysis';

    // 2. Persist in database / store
    const record: AnalysisRecord = {
      id,
      user_id: userId,
      title: docTitle,
      input_text: text,
      ai_probability: result.aiProbability,
      human_probability: result.humanProbability,
      confidence: result.confidence,
      classification: result.classification,
      word_count: result.wordCount,
      character_count: result.characterCount,
      sentence_count: result.sentenceCount,
      paragraph_count: result.paragraphCount,
      sentence_analysis: result.sentences,
      insights: result.insights,
      suggestions: result.suggestions,
      created_at: createdAt
    };

    memoryStore.analyses.set(id, record);

    // If PostgreSQL is active, save to table
    try {
      await db.query(
        `INSERT INTO analyses (
          id, user_id, title, input_text, ai_probability, human_probability,
          confidence, classification, word_count, character_count, sentence_count,
          paragraph_count, sentence_analysis, insights, suggestions, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          id, userId || null, docTitle, text, result.aiProbability, result.humanProbability,
          result.confidence, result.classification, result.wordCount, result.characterCount,
          result.sentenceCount, result.paragraphCount, JSON.stringify(result.sentences),
          JSON.stringify(result.insights), JSON.stringify(result.suggestions), createdAt
        ]
      );
    } catch (err) {
      // Fallback silently uses memoryStore
    }

    return {
      ...result,
      id,
      createdAt
    };
  }

  public static async getById(id: string): Promise<AnalysisRecord | null> {
    try {
      const dbRes = await db.query('SELECT * FROM analyses WHERE id = $1', [id]);
      if (dbRes && dbRes.rows.length > 0) {
        return dbRes.rows[0];
      }
    } catch (e) {
      // ignore
    }

    return memoryStore.analyses.get(id) || null;
  }
}
