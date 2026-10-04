import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Wand2,
  History as HistoryIcon,
  Percent,
  ArrowRight,
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { DistributionChart } from '../components/dashboard/DistributionChart';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const items = historyService.getLocalHistory('all', 'all', '');
    setRecentItems(items.slice(0, 5));
  }, []);

  const stats = [
    { label: 'Texts Analyzed', value: '24', icon: ShieldCheck, change: '+12% this week', color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-950' },
    { label: 'Texts Improved', value: '18', icon: Wand2, change: '+8 this week', color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-950' },
    { label: 'Words Processed', value: '34,280', icon: Layers, change: '100% quota active', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950' },
    { label: 'Average AI Score', value: '43%', icon: Percent, change: 'Moderate range', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Welcome Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-brand-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Workspace Active • {user?.role ? user.role.toUpperCase() : 'PRO'} Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
            Analyze writing patterns, inspect sentence-level heuristics, and humanize AI drafts to sound like yourself.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            to="/detector"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-brand-50 shadow transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            New Detection
          </Link>
          <Link
            to="/humanizer"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-700/70 hover:bg-brand-700 text-white border border-brand-500/40 transition-all flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4 text-brand-300" />
            Humanize Text
          </Link>
        </div>
      </div>

      {/* 2. Top Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {stat.change}
                </span>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Detector Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Content Detector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Analyze writing patterns, score predictability, and inspect sentence-level observations.
            </p>
          </div>
          <Link
            to="/detector"
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            Analyze Text <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* AI Humanizer Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-accent-50 dark:bg-purple-950 text-accent-600 dark:text-accent-400 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Humanizer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Improve naturalness and readability while strictly preserving meaning, citations, and facts.
            </p>
          </div>
          <Link
            to="/humanizer"
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-accent-600 to-indigo-600 hover:from-accent-700 hover:to-indigo-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            Humanize Text <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* History Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Document History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              View, rename, re-evaluate, or export all previous detections and rewritten versions.
            </p>
          </div>
          <Link
            to="/history"
            className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all"
          >
            View History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Analytics & Activity Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <DistributionChart />
      </div>

      {/* 5. Recent Activity List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Analyses & Rewrites
            </h3>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            View All History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentItems.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/history/${item.id}`)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      item.type === 'detector'
                        ? 'bg-brand-50 dark:bg-brand-950 text-brand-600'
                        : 'bg-accent-50 dark:bg-purple-950 text-accent-600'
                    }`}
                  >
                    {item.type === 'detector' ? <ShieldCheck className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()} • {item.wordCount} words
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.type === 'detector' && item.score !== undefined ? (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.score > 60
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : item.score < 35
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.score}% AI
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      +{item.readabilityImprovement || 18}% Readability
                    </span>
                  )}
                  <span className="text-xs text-slate-400 hover:text-slate-600">View →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No recent activity. Start by analyzing a document or humanizing text!
          </div>
        )}
      </div>
    </div>
  );
};
