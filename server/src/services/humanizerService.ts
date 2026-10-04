import { humanizeText, HumanizeOptions, HumanizeResult } from '../utils/textTransformer.js';
import { memoryStore, db, HumanizationRecord } from './dbService.js';
import { v4 as uuidv4 } from 'uuid';

export class HumanizerService {
  /**
   * Main humanization service.
   * Modularized to support LLM backend (e.g. OpenAI, Anthropic, Gemini, local Ollama)
   * or high-speed rule-based text transformer.
   */
  public static async humanize(
    options: HumanizeOptions,
    userId?: string,
    title?: string
  ): Promise<HumanizeResult & { id: string; createdAt: string }> {
    const result = humanizeText(options);
    const id = `humanize-${uuidv4().substring(0, 8)}`;
    const createdAt = new Date().toISOString();

    const docTitle = title || (options.text.slice(0, 40).trim() + (options.text.length > 40 ? '...' : '')) || 'Text Rewrite';

    const record: HumanizationRecord = {
      id,
      user_id: userId,
      title: docTitle,
      original_text: options.text,
      improved_text: result.improvedText,
      tone: options.tone || 'natural',
      strength: options.strength || 2,
      style: options.style || 'clear',
      preserve_options: options.preserveOptions || {},
      word_count_before: result.wordCountBefore,
      word_count_after: result.wordCountAfter,
      readability_change: result.readabilityChange,
      diff_data: result.diff,
      created_at: createdAt
    };

    memoryStore.humanizations.set(id, record);

    try {
      await db.query(
        `INSERT INTO humanizations (
          id, user_id, title, original_text, improved_text, tone, strength,
          style, preserve_options, word_count_before, word_count_after,
          readability_change, diff_data, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          id, userId || null, docTitle, options.text, result.improvedText,
          options.tone || 'natural', options.strength || 2, options.style || 'clear',
          JSON.stringify(options.preserveOptions || {}), result.wordCountBefore,
          result.wordCountAfter, result.readabilityChange, JSON.stringify(result.diff),
          createdAt
        ]
      );
    } catch (err) {
      // Fallback
    }

    return {
      ...result,
      id,
      createdAt
    };
  }

  public static async getById(id: string): Promise<HumanizationRecord | null> {
    try {
      const dbRes = await db.query('SELECT * FROM humanizations WHERE id = $1', [id]);
      if (dbRes && dbRes.rows.length > 0) {
        return dbRes.rows[0];
      }
    } catch (e) {
      // ignore
    }

    return memoryStore.humanizations.get(id) || null;
  }
}
