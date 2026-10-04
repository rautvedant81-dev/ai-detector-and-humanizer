import { DetectionResult, SentenceAnalysis } from '../types';

const AI_MARKERS = [
  'furthermore', 'moreover', 'in conclusion', 'it is important to note that',
  'plays a pivotal role', 'delve into', 'testament to', 'tapestry',
  'beacon of hope', 'foster', 'underscore', 'multifaceted', 'navigating the complexities',
  'in summary', 'it can be argued that', 'on the other hand', 'seamlessly integrate',
  'holistic approach', 'groundbreaking', 'paradigm shift', 'crucial aspect', 'it is worth noting that'
];

export function runClientNLPAnalysis(text: string): DetectionResult {
  const cleanText = text.trim();
  const characters = cleanText.length;
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const rawParagraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = Math.max(1, rawParagraphs.length);

  // Split into sentences preserving punctuation
  const sentenceMatches = cleanText.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [];
  const sentencesList = sentenceMatches.map(s => s.trim()).filter(Boolean);
  const sentenceCount = Math.max(1, sentencesList.length);

  if (wordCount < 4) {
    return {
      aiProbability: 50,
      humanProbability: 50,
      confidence: 'low',
      classification: 'mixed',
      wordCount,
      characterCount: characters,
      sentenceCount: 1,
      paragraphCount: 1,
      sentences: [{
        text: cleanText || 'Sample text',
        score: 0.5,
        classification: 'mixed',
        reasons: ['Text sample is too brief for statistical pattern extraction.']
      }],
      insights: ['Provide more text (30+ words recommended) for a reliable confidence score.'],
      suggestions: ['Add full paragraphs to examine natural sentence flow and transition patterns.']
    };
  }

  // Calculate length variance
  const sentenceLengths = sentencesList.map(s => s.split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceCount;
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / sentenceCount;
  const stdDev = Math.sqrt(variance);
  const lengthUniformity = Math.max(0, 1 - (stdDev / (avgLength + 0.1)));

  // Vocabulary Diversity (Type-Token Ratio)
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  const ttr = uniqueWords.size / wordCount;

  let totalScore = 0;
  const analyzedSentences: SentenceAnalysis[] = sentencesList.map((sentence) => {
    const sWords = sentence.split(/\s+/).length;
    const lower = sentence.toLowerCase();
    const reasons: string[] = [];
    let score = 0.38;

    let markerCount = 0;
    for (const marker of AI_MARKERS) {
      if (lower.includes(marker)) {
        markerCount++;
        reasons.push(`Predictable transition or cliché: "${marker}"`);
      }
    }
    if (markerCount > 0) {
      score += Math.min(0.42, markerCount * 0.22);
    }

    if (Math.abs(sWords - avgLength) < 3 && sentenceCount > 3) {
      score += 0.14;
      reasons.push('Matches uniform sentence rhythm across surrounding text');
    }

    if (/\b(is|are|was|were|been|being)\s+\w+ed\b/i.test(sentence)) {
      score += 0.09;
      reasons.push('Uses typical impersonal passive structure');
    }

    if (/\b(I|me|my|we|us|our|you'll|don't|can't|won't|honestly|actually|literally|kinda|gonna)\b/i.test(sentence)) {
      score -= 0.28;
      reasons.push('Features personal voice, contractions, or informal phrasing');
    }

    if (/[-—:;()!]/.test(sentence)) {
      score -= 0.12;
      reasons.push('Varied punctuation cadence and expressive tone');
    }

    score = Math.max(0.06, Math.min(0.96, score));
    totalScore += score;

    let classification: 'human_like' | 'mixed' | 'ai_like' = 'mixed';
    if (score < 0.40) {
      classification = 'human_like';
      if (reasons.length === 0) reasons.push('Natural sentence rhythm with varied vocabulary');
    } else if (score > 0.62) {
      classification = 'ai_like';
      if (reasons.length === 0) reasons.push('Highly predictable sentence structure and formula');
    } else {
      classification = 'mixed';
      if (reasons.length === 0) reasons.push('Standard balanced phrasing with standard grammar');
    }

    return {
      text: sentence,
      score: Math.round(score * 100) / 100,
      classification,
      reasons
    };
  });

  const rawProbability = (totalScore / sentenceCount) * 100;
  const uniformityWeight = (lengthUniformity - 0.5) * 16;
  const ttrAdjustment = (0.6 - ttr) * 26;
  const aiProbability = Math.min(96, Math.max(6, Math.round(rawProbability + uniformityWeight + ttrAdjustment)));
  const humanProbability = 100 - aiProbability;

  let confidence: 'low' | 'medium' | 'high' = 'medium';
  if (wordCount < 40) {
    confidence = 'low';
  } else if (wordCount > 140 && (aiProbability > 72 || aiProbability < 28)) {
    confidence = 'high';
  } else {
    confidence = 'medium';
  }

  let classification: 'likely_human' | 'mixed' | 'likely_ai' = 'mixed';
  if (aiProbability >= 65) {
    classification = 'likely_ai';
  } else if (aiProbability <= 35) {
    classification = 'likely_human';
  } else {
    classification = 'mixed';
  }

  const insights: string[] = [];
  if (lengthUniformity > 0.65) {
    insights.push('Sentence lengths follow a noticeably regular rhythm with low variance.');
  } else {
    insights.push('Sentence length and structure show organic dynamic variation.');
  }

  if (ttr < 0.55) {
    insights.push('Moderate vocabulary reuse observed across multiple paragraphs.');
  } else {
    insights.push('High lexical variety and diverse word choices detected.');
  }

  const markerMatches = AI_MARKERS.filter(m => cleanText.toLowerCase().includes(m));
  if (markerMatches.length > 0) {
    insights.push(`Contains recurring formal transition formulas (${markerMatches.slice(0, 3).join(', ')}).`);
  }

  const suggestions: string[] = [];
  if (aiProbability > 40) {
    suggestions.push('Add more personal perspective, real-world examples, or direct rhetorical points.');
    suggestions.push('Vary sentence lengths — combine short punchy statements with longer explanatory thoughts.');
    suggestions.push('Replace generic connective phrases (e.g., "Furthermore", "In conclusion") with natural transitions.');
  } else {
    suggestions.push('Keep the authentic personal voice and expressive punctuation.');
    suggestions.push('Ensure technical terms and citations remain clear and accurate.');
  }

  return {
    aiProbability,
    humanProbability,
    confidence,
    classification,
    wordCount,
    characterCount: characters,
    sentenceCount,
    paragraphCount,
    sentences: analyzedSentences,
    insights,
    suggestions
  };
}
