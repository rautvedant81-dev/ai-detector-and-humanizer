import { DiffChunk } from '../types';

export function computeWordDiff(original: string, improved: string): DiffChunk[] {
  const origTokens = original.split(/(\s+|[.,!?;:])/).filter(t => t.length > 0);
  const imprTokens = improved.split(/(\s+|[.,!?;:])/).filter(t => t.length > 0);

  const diff: DiffChunk[] = [];
  let i = 0;
  let j = 0;

  while (i < origTokens.length || j < imprTokens.length) {
    const o = origTokens[i];
    const n = imprTokens[j];

    if (o === n) {
      if (o !== undefined) diff.push({ type: 'unchanged', text: o });
      i++;
      j++;
    } else if (o !== undefined && (j >= imprTokens.length || !imprTokens.slice(j, j + 8).includes(o))) {
      diff.push({ type: 'removed', text: o });
      i++;
    } else if (n !== undefined && (i >= origTokens.length || !origTokens.slice(i, i + 8).includes(n))) {
      diff.push({ type: 'added', text: n });
      j++;
    } else {
      if (o !== undefined) diff.push({ type: 'removed', text: o });
      if (n !== undefined) diff.push({ type: 'added', text: n });
      i++;
      j++;
    }
  }

  return diff;
}
