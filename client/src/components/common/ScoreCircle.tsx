import React from 'react';
import { ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';
import { ClassificationType } from '../../types';

interface ScoreCircleProps {
  score: number; // 0 to 100 (AI probability)
  humanScore: number;
  confidence: 'low' | 'medium' | 'high';
  classification: ClassificationType;
  size?: number;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  humanScore,
  confidence,
  classification,
  size = 200
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // green for likely_human
  let badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  let label = 'Likely Human-Written';
  let Icon = ShieldCheck;

  if (classification === 'likely_ai' || score >= 65) {
    strokeColor = '#EF4444'; // red
    badgeBg = 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    label = 'Likely AI-Assisted';
    Icon = Cpu;
  } else if (classification === 'mixed' || (score > 35 && score < 65)) {
    strokeColor = '#F59E0B'; // yellow / amber
    badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    label = 'Mixed / Uncertain';
    Icon = AlertTriangle;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Animated Progress Gauge */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="animate-gauge"
            fill="transparent"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {score}%
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
            AI Probability
          </span>
        </div>
      </div>

      {/* Assessment Classification Badge */}
      <div className={`mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold ${badgeBg} shadow-sm`}>
        <Icon className="w-4 h-4" />
        {label}
      </div>

      {/* Probabilities & Confidence meter */}
      <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Human-like Patterns:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{humanScore}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">AI-like Patterns:</span>
          <span className="font-bold text-rose-600 dark:text-rose-400">{score}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Analysis Confidence:</span>
          <span className="font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">{confidence}</span>
        </div>

        {/* Horizontal Confidence bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              confidence === 'high' ? 'w-full bg-emerald-500' : confidence === 'medium' ? 'w-2/3 bg-amber-500' : 'w-1/3 bg-slate-400'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
