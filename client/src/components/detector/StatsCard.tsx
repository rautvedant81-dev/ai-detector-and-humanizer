import React from 'react';
import { Type, Hash, AlignLeft, Layers, Percent, UserCheck } from 'lucide-react';

interface StatsCardProps {
  words: number;
  characters: number;
  sentences: number;
  paragraphs: number;
  aiProbability: number;
  humanProbability: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  words,
  characters,
  sentences,
  paragraphs,
  aiProbability,
  humanProbability
}) => {
  const stats = [
    { label: 'Words', value: words.toLocaleString(), icon: Type, color: 'text-brand-600 dark:text-brand-400' },
    { label: 'Characters', value: characters.toLocaleString(), icon: Hash, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Sentences', value: sentences, icon: AlignLeft, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Paragraphs', value: paragraphs, icon: Layers, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'AI Likelihood', value: `${aiProbability}%`, icon: Percent, color: aiProbability > 60 ? 'text-rose-600' : 'text-emerald-600' },
    { label: 'Human Likelihood', value: `${humanProbability}%`, icon: UserCheck, color: 'text-emerald-600 dark:text-emerald-400' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col items-center justify-center text-center"
          >
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span>{stat.label}</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {stat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
