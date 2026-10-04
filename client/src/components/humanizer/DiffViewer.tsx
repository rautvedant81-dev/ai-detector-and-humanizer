import React from 'react';
import { DiffChunk } from '../../types';
import { TrendingUp } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  improvedText: string;
  diff: DiffChunk[];
  readabilityChange: number;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  improvedText,
  diff,
  readabilityChange
}) => {
  return (
    <div className="space-y-4">
      {/* Metric Callout */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Readability Improvement: +{readabilityChange}%</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-200 dark:bg-emerald-800 inline-block" />
            <span className="text-slate-600 dark:text-slate-300">Added / Enhanced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-200 dark:bg-rose-800 line-through inline-block" />
            <span className="text-slate-600 dark:text-slate-300">Removed Cliché</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Original Draft
            </span>
            <span className="text-[11px] text-slate-400">
              {originalText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap select-text">
            {originalText}
          </div>
        </div>

        {/* Improved with Live Diff Highlighting */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Improved Natural Writing
            </span>
            <span className="text-[11px] text-slate-400">
              {improvedText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <div className="text-sm leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap select-text">
            {diff.length > 0 ? (
              diff.map((chunk, idx) => {
                if (chunk.type === 'added') {
                  return (
                    <span
                      key={idx}
                      className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-medium px-0.5 rounded"
                    >
                      {chunk.text}
                    </span>
                  );
                }
                if (chunk.type === 'removed') {
                  return (
                    <span
                      key={idx}
                      className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 line-through opacity-70 px-0.5 rounded text-xs"
                    >
                      {chunk.text}
                    </span>
                  );
                }
                return <span key={idx} className="text-slate-800 dark:text-slate-200">{chunk.text}</span>;
              })
            ) : (
              <span className="text-slate-800 dark:text-slate-200">{improvedText}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
