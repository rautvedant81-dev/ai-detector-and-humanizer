import React, { useState } from 'react';
import {
  Sliders,
  Moon,
  Sun,
  Monitor,
  Bell,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { historyService } from '../services/historyService';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const [defaultTone, setDefaultTone] = useState<string>('natural');
  const [defaultStrength, setDefaultStrength] = useState<number>(2);
  const [language, setLanguage] = useState<string>('en-US');
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [usageAlerts, setUsageAlerts] = useState<boolean>(true);

  const handleSavePreferences = () => {
    success('Preferences saved successfully!');
  };

  const handleClearHistory = () => {
    historyService.clearAll();
    success('Analysis and rewrite history cleared.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize default humanizer strengths, themes, notifications, and privacy options.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Writing Preferences */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Default Writing Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Default Humanization Tone
              </label>
              <select
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="natural">Natural (Default)</option>
                <option value="professional">Professional</option>
                <option value="academic">Academic</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="conversational">Conversational</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Default Rewrite Strength
              </label>
              <select
                value={defaultStrength}
                onChange={(e) => setDefaultStrength(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value={1}>1 — Light (Subtle adjustments)</option>
                <option value={2}>2 — Moderate (Balanced)</option>
                <option value={3}>3 — Strong (High variation)</option>
                <option value={4}>4 — Extensive (Deep restructuring)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Interface & Linguistic Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="en-IN">English (India)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* 2. Appearance & Theme */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sun className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Theme', icon: Monitor }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as any);
                    success(`Switched to ${t.label}`);
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all ${
                    theme === t.id
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Notifications */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Email Notifications
                </span>
                <span className="text-slate-400 text-[11px]">
                  Receive monthly report summaries and feature updates
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Usage Limit Alerts
                </span>
                <span className="text-slate-400 text-[11px]">
                  Notify when approaching monthly word quotas
                </span>
              </div>
              <input
                type="checkbox"
                checked={usageAlerts}
                onChange={() => setUsageAlerts(!usageAlerts)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>

        {/* 4. Privacy & Data Control */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Privacy & Data Controls
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            HumanCheck AI never sells your text. You retain complete ownership over your submissions and can purge history records with a single click.
          </p>

          <div className="pt-2">
            <button
              onClick={handleClearHistory}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Document History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
