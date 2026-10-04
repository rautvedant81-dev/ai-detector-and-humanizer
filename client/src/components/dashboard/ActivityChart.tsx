import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export const ActivityChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Sample activity data
  const data7d = [
    { label: 'Mon', detector: 4, humanizer: 3 },
    { label: 'Tue', detector: 6, humanizer: 5 },
    { label: 'Wed', detector: 8, humanizer: 7 },
    { label: 'Thu', detector: 5, humanizer: 4 },
    { label: 'Fri', detector: 10, humanizer: 9 },
    { label: 'Sat', detector: 3, humanizer: 2 },
    { label: 'Sun', detector: 7, humanizer: 6 }
  ];

  const data30d = [
    { label: 'W1', detector: 24, humanizer: 19 },
    { label: 'W2', detector: 32, humanizer: 27 },
    { label: 'W3', detector: 29, humanizer: 22 },
    { label: 'W4', detector: 41, humanizer: 35 }
  ];

  const data90d = [
    { label: 'Month 1', detector: 92, humanizer: 78 },
    { label: 'Month 2', detector: 114, humanizer: 95 },
    { label: 'Month 3', detector: 138, humanizer: 120 }
  ];

  const activeData = timeRange === '7d' ? data7d : timeRange === '30d' ? data30d : data90d;
  const maxVal = Math.max(...activeData.map(d => Math.max(d.detector, d.humanizer)));

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            Writing & Analysis Activity
          </h3>
          <p className="text-xs text-slate-500">Volume of scans and text humanizations</p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2.5 py-1 rounded-lg transition-all uppercase ${
                timeRange === r
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG / Bar Representation */}
      <div className="pt-4 h-48 flex items-end justify-between gap-3">
        {activeData.map((item, idx) => {
          const detHeight = Math.max(12, (item.detector / maxVal) * 100);
          const humHeight = Math.max(12, (item.humanizer / maxVal) * 100);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1.5 h-36">
                {/* Detector Bar */}
                <div
                  className="w-full max-w-[16px] bg-gradient-to-t from-brand-600 to-indigo-400 rounded-t-md transition-all group-hover:brightness-110"
                  style={{ height: `${detHeight}%` }}
                  title={`Detector: ${item.detector}`}
                />
                {/* Humanizer Bar */}
                <div
                  className="w-full max-w-[16px] bg-gradient-to-t from-accent-600 to-purple-400 rounded-t-md transition-all group-hover:brightness-110"
                  style={{ height: `${humHeight}%` }}
                  title={`Humanizer: ${item.humanizer}`}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-brand-600 inline-block" />
          <span className="text-slate-600 dark:text-slate-400">AI Detector Scans</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-accent-600 inline-block" />
          <span className="text-slate-600 dark:text-slate-400">Humanizer Rewrites</span>
        </div>
      </div>
    </div>
  );
};
