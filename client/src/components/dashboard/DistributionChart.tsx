import React from 'react';
import { PieChart } from 'lucide-react';

export const DistributionChart: React.FC = () => {
  // Sample distribution breakdown
  const stats = [
    { label: 'Likely Human (0-35%)', percentage: 46, count: 22, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Mixed / Uncertain (36-64%)', percentage: 28, count: 13, color: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Likely AI (65-100%)', percentage: 26, count: 12, color: 'bg-rose-500', text: 'text-rose-500' }
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PieChart className="w-4 h-4 text-brand-600" />
          AI Score Distribution
        </h3>
        <p className="text-xs text-slate-500">Classification of your historical documents</p>
      </div>

      {/* Progress Bar Stack */}
      <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`${s.color} transition-all duration-500`}
            style={{ width: `${s.percentage}%` }}
            title={`${s.label}: ${s.percentage}%`}
          />
        ))}
      </div>

      {/* List breakdown */}
      <div className="space-y-3 pt-2">
        {stats.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="font-medium text-slate-700 dark:text-slate-300">{s.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">{s.count} docs</span>
              <span className={`font-extrabold ${s.text}`}>({s.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400">
        Average likelihood score across all documents: <strong className="text-slate-800 dark:text-slate-200 font-bold">39% AI-Assisted</strong>
      </div>
    </div>
  );
};
