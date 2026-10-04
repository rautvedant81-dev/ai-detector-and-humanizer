import React from 'react';
import { SentenceAnalysis } from '../../types';
import { Info } from 'lucide-react';

interface SentenceHighlightProps {
  sentences: SentenceAnalysis[];
  onSelectSentence: (sentence: SentenceAnalysis, index: number) => void;
}

export const SentenceHighlight: React.FC<SentenceHighlightProps> = ({
  sentences,
  onSelectSentence
}) => {
  return (
    <div className="space-y-4">
      {/* Category Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Highlight Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-600 dark:border-emerald-400 inline-block" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Human-like pattern</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-600 dark:border-amber-400 inline-block" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Uncertain / Mixed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-600 dark:border-rose-400 inline-block" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">AI-like pattern</span>
        </div>
        <span className="ml-auto text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          Click any sentence to inspect reasons
        </span>
      </div>

      {/* Rendered Text with Sentence Highlights */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base leading-relaxed tracking-normal select-text">
        {sentences.map((sentence, idx) => {
          let styleClass = 'hover:ring-2 cursor-pointer transition-all rounded px-1 py-0.5 my-0.5 inline ';

          if (sentence.classification === 'ai_like') {
            styleClass += 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 border-b-2 border-rose-400 hover:ring-rose-400';
          } else if (sentence.classification === 'mixed') {
            styleClass += 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100 border-b-2 border-amber-400 hover:ring-amber-400';
          } else {
            styleClass += 'bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 border-b-2 border-emerald-400 hover:ring-emerald-400';
          }

          return (
            <React.Fragment key={idx}>
              <span
                onClick={() => onSelectSentence(sentence, idx)}
                className={styleClass}
                title={`Sentence ${idx + 1}: ${Math.round(sentence.score * 100)}% AI Index. Click for details.`}
              >
                {sentence.text}
              </span>{' '}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
