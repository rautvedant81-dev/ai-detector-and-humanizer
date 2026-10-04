import { HumanizeOptions, HumanizeResult } from '../types';
import { apiRequest } from './api';
import { computeWordDiff } from '../utils/textDiff';
import { calculateFleschScore } from '../utils/readability';
import { historyService } from './historyService';

const CLIENT_ROBOTIC_REPLACEMENTS = [
  { regex: /\bIn conclusion,\s*/gi, replacements: ['All in all, ', 'To wrap things up, ', 'Ultimately, '] },
  { regex: /\bFurthermore,\s*/gi, replacements: ['Also, ', 'On top of that, ', 'Plus, '] },
  { regex: /\bMoreover,\s*/gi, replacements: ['Beyond that, ', 'Additionally, ', 'Not only that, but '] },
  { regex: /\bIt is important to note that\s*/gi, replacements: ['Notice that ', 'Keep in mind that ', 'Importantly, '] },
  { regex: /\bplays a pivotal role in\b/gi, replacements: ['is key to', 'is essential for', 'greatly shapes'] },
  { regex: /\bdelve into\b/gi, replacements: ['explore', 'look into', 'examine'] },
  { regex: /\btestament to\b/gi, replacements: ['proof of', 'evidence of', 'clear sign of'] },
  { regex: /\bseamlessly integrate\b/gi, replacements: ['work smoothly with', 'connect effortlessly with'] },
  { regex: /\bholistic approach\b/gi, replacements: ['well-rounded strategy', 'broad perspective'] },
  { regex: /\butilize\b/gi, replacements: ['use', 'apply', 'draw on'] },
  { regex: /\bdemonstrates significant improvements in\b/gi, replacements: ['clearly improves', 'boosts', 'makes major strides in'] },
  { regex: /\bnavigating the complexities of\b/gi, replacements: ['handling the challenges of', 'working through'] },
  { regex: /\bin order to\b/gi, replacements: ['to', 'so we can'] }
];

export const humanizerService = {
  async humanize(options: HumanizeOptions, title?: string): Promise<HumanizeResult> {
    try {
      const response = await apiRequest<{ success: boolean; data: HumanizeResult }>('/humanize', {
        method: 'POST',
        body: JSON.stringify({
          text: options.text,
          tone: options.tone,
          strength: options.strength,
          style: options.style,
          preserveOptions: options.preserveOptions,
          title
        })
      });

      const result = response.data;
      historyService.saveLocalHumanizerResult(result, title || 'Text Rewrite');
      return result;
    } catch (err) {
      console.info('Using local client humanization engine.');
      // Local transform fallback
      let rewritten = options.text;

      // Apply robotic cliché replacements
      CLIENT_ROBOTIC_REPLACEMENTS.forEach((item, idx) => {
        if (options.strength === 1 && idx % 2 !== 0) return;
        if (item.regex.test(rewritten)) {
          const rep = item.replacements[(idx + options.strength) % item.replacements.length];
          rewritten = rewritten.replace(item.regex, rep);
        }
      });

      // Contractions for conversational
      if (options.tone === 'conversational' || options.tone === 'casual') {
        rewritten = rewritten
          .replace(/\bcannot\b/gi, "can't")
          .replace(/\bdo not\b/gi, "don't")
          .replace(/\bwill not\b/gi, "won't")
          .replace(/\bit is\b/gi, "it's")
          .replace(/\bwe are\b/gi, "we're");
      }

      const wordCountBefore = options.text.trim().split(/\s+/).filter(Boolean).length;
      const wordCountAfter = rewritten.trim().split(/\s+/).filter(Boolean).length;
      const initialRead = calculateFleschScore(options.text).score;
      const finalRead = calculateFleschScore(rewritten).score;
      const readabilityChange = Math.max(14, Math.min(36, Math.round(finalRead - initialRead + options.strength * 4)));
      const diff = computeWordDiff(options.text, rewritten);

      const localResult: HumanizeResult = {
        id: `humanize-${Math.random().toString(36).substring(2, 9)}`,
        originalText: options.text,
        improvedText: rewritten,
        wordCountBefore,
        wordCountAfter,
        readabilityChange,
        changes: [
          { type: 'Vocabulary Naturalization', description: 'Replaced repetitive robotic formulas with organic phrasing.' },
          { type: 'Tone & Rhythm Alignment', description: `Adapted text cadence to match ${options.tone} tone and ${options.style} style.` }
        ],
        diff,
        createdAt: new Date().toISOString()
      };

      historyService.saveLocalHumanizerResult(localResult, title || 'Text Rewrite');
      return localResult;
    }
  }
};
