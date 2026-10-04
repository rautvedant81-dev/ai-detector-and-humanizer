export interface SentenceAnalysis {
  text: string;
  score: number; // 0 (100% human) to 1 (100% AI)
  classification: 'human_like' | 'mixed' | 'ai_like';
  reasons: string[];
}

export interface DetectionResult {
  aiProbability: number;
  humanProbability: number;
  confidence: 'low' | 'medium' | 'high';
  classification: 'likely_human' | 'mixed' | 'likely_ai';
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  sentences: SentenceAnalysis[];
  insights: string[];
  suggestions: string[];
}

// Common generic AI transition & filler tokens
const AI_MARKERS = [
  'furthermore', 'moreover', 'in conclusion', 'it is important to note that',
  'plays a pivotal role', 'delve into', 'testament to', 'tapestry',
  'beacon of hope', 'foster', 'underscore', 'multifaceted', 'navigating the complexities',
  'in summary', 'it can be argued that', 'on the other hand', 'seamlessly integrate',
  'holistic approach', 'groundbreaking', 'paradigm shift', 'crucial aspect'
];

export function analyzeTextPatterns(text: string): DetectionResult {
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

  if (wordCount < 5) {
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
        reasons: ['Text is too short for reliable linguistic analysis']
      }],
      insights: ['Sample text is too brief for statistical pattern extraction.'],
      suggestions: ['Provide at least 30-50 words for higher confidence assessment.']
    };
  }

  // Calculate Burstiness (Variance in sentence length)
  const sentenceLengths = sentencesList.map(s => s.split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceCount;
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgSentenceLength, 2), 0) / sentenceCount;
  const stdDev = Math.sqrt(variance);
  const lengthUniformity = Math.max(0, 1 - (stdDev / (avgSentenceLength + 0.1)));

  // Calculate Vocabulary Diversity (Type-Token Ratio)
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  const ttr = uniqueWords.size / wordCount;

  // Process sentence-by-sentence analysis
  let totalScore = 0;
  const analyzedSentences: SentenceAnalysis[] = sentencesList.map((sentence) => {
    const sWords = sentence.split(/\s+/).length;
    const lower = sentence.toLowerCase();
    const reasons: string[] = [];
    let sentenceScore = 0.35; // baseline neutral

    // Check AI markers
    let markerCount = 0;
    for (const marker of AI_MARKERS) {
      if (lower.includes(marker)) {
        markerCount++;
        reasons.push(`Contains predictable transition or cliché: "${marker}"`);
      }
    }

    if (markerCount > 0) {
      sentenceScore += Math.min(0.4, markerCount * 0.2);
    }

    // Check sentence length vs average
    if (Math.abs(sWords - avgSentenceLength) < 3 && sentenceCount > 3) {
      sentenceScore += 0.12;
      reasons.push('Matches uniform sentence rhythm across surrounding text');
    }

    // Passive or formal voice indicator
    if (/\b(is|are|was|were|been|being)\s+\w+ed\b/i.test(sentence)) {
      sentenceScore += 0.08;
      reasons.push('Uses typical impersonal passive structure');
    }

    // Colloquial / human markers
    if (/\b(I|me|my|we|us|our|you'll|don't|can't|won't|honestly|actually|literally|kinda|gonna)\b/i.test(sentence)) {
      sentenceScore -= 0.25;
      reasons.push('Features personal voice, contractions, or informal phrasing');
    }

    // Complex punctuation (em dashes, colons, parentheses, exclamation)
    if (/[-—:;()!]/.test(sentence)) {
      sentenceScore -= 0.1;
      reasons.push('Varied punctuation cadence and expressive tone');
    }

    // Clamp score
    sentenceScore = Math.max(0.05, Math.min(0.95, sentenceScore));
    totalScore += sentenceScore;

    let classification: 'human_like' | 'mixed' | 'ai_like' = 'mixed';
    if (sentenceScore < 0.40) {
      classification = 'human_like';
      if (reasons.length === 0) reasons.push('Natural sentence rhythm with varied vocabulary');
    } else if (sentenceScore > 0.62) {
      classification = 'ai_like';
      if (reasons.length === 0) reasons.push('Highly regularized syntactic pattern');
    } else {
      classification = 'mixed';
      if (reasons.length === 0) reasons.push('Balanced phrasing with standard grammar');
    }

    return {
      text: sentence,
      score: Math.round(sentenceScore * 100) / 100,
      classification,
      reasons
    };
  });

  // Calculate composite probability
  const rawProbability = (totalScore / sentenceCount) * 100;
  // Weight with uniformity and vocabulary redundancy
  const uniformityWeight = (lengthUniformity - 0.5) * 15;
  const ttrAdjustment = (0.6 - ttr) * 25;
  const aiProbability = Math.min(96, Math.max(8, Math.round(rawProbability + uniformityWeight + ttrAdjustment)));
  const humanProbability = 100 - aiProbability;

  // Confidence estimation based on word count & score variance
  let confidence: 'low' | 'medium' | 'high' = 'medium';
  if (wordCount < 40) {
    confidence = 'low';
  } else if (wordCount > 150 && (aiProbability > 75 || aiProbability < 25)) {
    confidence = 'high';
  } else {
    confidence = 'medium';
  }

  // Classification label
  let classification: 'likely_human' | 'mixed' | 'likely_ai' = 'mixed';
  if (aiProbability >= 65) {
    classification = 'likely_ai';
  } else if (aiProbability <= 35) {
    classification = 'likely_human';
  } else {
    classification = 'mixed';
  }

  // Generate Insights
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
  if (markerMatches.length > 2) {
    insights.push(`Contains recurring formal transition formulas (${markerMatches.slice(0, 3).join(', ')}).`);
  }

  // Suggestions
  const suggestions: string[] = [];
  if (aiProbability > 40) {
    suggestions.push('Add more personal perspective, anecdotes, or direct rhetorical points.');
    suggestions.push('Vary sentence lengths — mix concise 5-word statements with longer explanatory thoughts.');
    suggestions.push('Replace generic connective phrases (e.g. "Furthermore", "In conclusion") with natural transitions.');
  } else {
    suggestions.push('Keep the authentic, conversational cadences and diverse sentence structures.');
    suggestions.push('Ensure factual claims and technical citations remain sharp and structured.');
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
