import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-[#070B14] border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center text-white font-bold shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                HumanCheck<span className="text-brand-600 dark:text-brand-400">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The premium writing intelligence platform. Detect linguistic predictability and humanize AI drafts to preserve your authentic voice.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 w-fit px-3 py-1.5 rounded-full border border-brand-100 dark:border-brand-900">
              <Shield className="w-3.5 h-3.5" />
              Write naturally. Analyze confidently.
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/detector" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  AI Content Detector
                </Link>
              </li>
              <li>
                <Link to="/humanizer" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  AI Writing Humanizer
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  User Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  FAQ & Ethics
                </a>
              </li>
              <li>
                <Link to="/detector" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Sample Analysis
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 cursor-default">
                  API Docs <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Soon</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-brand-600 cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-brand-600 cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-brand-600 cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-brand-600 cursor-pointer">
                  Responsible AI
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="my-8 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900/90 dark:text-amber-200/90 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Assessment Disclaimer:</strong> AI detection results are probabilistic estimates based on linguistic heuristics and predictability markers. They must not be treated as definitive evidence of authorship. Formal, non-native, or academic human prose may exhibit predictable structures.
          </p>
        </div>

        {/* Copyright & Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
          <p>© 2026 HumanCheck AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for students, researchers, writers & professionals</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
