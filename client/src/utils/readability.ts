export function calculateFleschScore(text: string): { score: number; level: string } {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [''];

  if (words.length === 0 || sentences.length === 0) {
    return { score: 65, level: 'Standard / Readable' };
  }

  const syllables = words.reduce((acc, word) => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    const count = (clean.match(/[aeiouy]{1,2}/g) || []).length;
    return acc + Math.max(1, count);
  }, 0);

  const score = Math.round(206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length)));
  const clamped = Math.min(100, Math.max(10, score));

  let level = 'Standard';
  if (clamped >= 80) level = 'Very Easy / Fluent';
  else if (clamped >= 60) level = 'Standard / Natural';
  else if (clamped >= 40) level = 'Moderately Complex';
  else level = 'Dense / Academic';

  return { score: clamped, level };
}
