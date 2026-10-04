import React from 'react';
import { Lightbulb, CheckCircle, Sparkles } from 'lucide-react';

interface InsightsCardProps {
  insights: string[];
  suggestions: string[];
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ insights, suggestions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Writing Insights */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Writing Insights</h3>
            <p className="text-[11px] text-slate-500">Linguistic pattern observations</p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Improvements */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Suggested Improvements</h3>
            <p className="text-[11px] text-slate-500">Tips for more organic, engaging flow</p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {suggestions.map((sugg, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{sugg}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
