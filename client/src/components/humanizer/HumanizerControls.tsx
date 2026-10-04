import React from 'react';
import { Sliders, ShieldCheck } from 'lucide-react';
import { HumanizeOptions } from '../../types';

interface HumanizerControlsProps {
  options: HumanizeOptions;
  onChange: (updated: Partial<HumanizeOptions>) => void;
  disabled?: boolean;
}

export const HumanizerControls: React.FC<HumanizerControlsProps> = ({
  options,
  onChange,
  disabled = false
}) => {
  const tones = [
    { value: 'natural', label: 'Natural' },
    { value: 'professional', label: 'Professional' },
    { value: 'academic', label: 'Academic' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'formal', label: 'Formal' },
    { value: 'simple', label: 'Simple' },
    { value: 'conversational', label: 'Conversational' }
  ];

  const styles: Array<HumanizeOptions['style']> = ['clear', 'concise', 'detailed', 'engaging', 'personal'];

  const strengthLabels: Record<number, string> = {
    1: '1 — Light',
    2: '2 — Moderate',
    3: '3 — Strong',
    4: '4 — Extensive'
  };

  const handleCheckbox = (key: keyof HumanizeOptions['preserveOptions']) => {
    onChange({
      preserveOptions: {
        ...options.preserveOptions,
        [key]: !options.preserveOptions[key]
      }
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Humanizer Settings & Controls
          </h3>
        </div>
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2.5 py-1 rounded-full border border-brand-100 dark:border-brand-900">
          Smart Precision Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Rewrite Strength Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Rewrite Strength
            </label>
            <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {strengthLabels[options.strength] || '2 — Moderate'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            disabled={disabled}
            value={options.strength}
            onChange={(e) => onChange({ strength: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
            <span>Light</span>
            <span>Moderate</span>
            <span>Strong</span>
            <span>Extensive</span>
          </div>
        </div>

        {/* 2. Writing Tone Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Writing Tone
          </label>
          <select
            disabled={disabled}
            value={options.tone}
            onChange={(e) => onChange({ tone: e.target.value as any })}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {tones.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Writing Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            Writing Style
          </label>
          <div className="flex flex-wrap gap-1.5">
            {styles.map((style) => (
              <button
                key={style}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ style })}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  options.style === style
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preserve Content Options Checkboxes */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Content Integrity & Preservation Safeguards
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
          {[
            { key: 'meaning', label: 'Preserve meaning' },
            { key: 'facts', label: 'Preserve facts' },
            { key: 'citations', label: 'Preserve citations' },
            { key: 'technical', label: 'Preserve technical' },
            { key: 'urls', label: 'Preserve URLs' },
            { key: 'numbers', label: 'Preserve numbers' },
            { key: 'formatting', label: 'Preserve formatting' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300 select-none p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={!!options.preserveOptions[item.key as keyof HumanizeOptions['preserveOptions']]}
                onChange={() => handleCheckbox(item.key as keyof HumanizeOptions['preserveOptions'])}
                className="w-3.5 h-3.5 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-600"
              />
              <span className="text-[11px] truncate">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
