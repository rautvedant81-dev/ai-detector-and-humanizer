import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Wand2,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  Check,
  Split,
  ShieldCheck
} from 'lucide-react';
import { RichToolbar } from '../components/common/RichToolbar';
import { UploadBox } from '../components/common/UploadBox';
import { HumanizerControls } from '../components/humanizer/HumanizerControls';
import { DiffViewer } from '../components/humanizer/DiffViewer';
import { LoadingStepIndicator } from '../components/humanizer/LoadingStepIndicator';
import { humanizerService } from '../services/humanizerService';
import { HumanizeOptions, HumanizeResult } from '../types';
import { useToast } from '../context/ToastContext';
import { downloadAsTxt } from '../utils/exportUtils';

export const Humanizer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const [text, setText] = useState<string>('');
  const [title, setTitle] = useState<string>('Untitled Rewrite');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<HumanizeResult | null>(null);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Humanizer Controls State
  const [options, setOptions] = useState<HumanizeOptions>({
    text: '',
    tone: 'natural',
    strength: 2,
    style: 'clear',
    preserveOptions: {
      meaning: true,
      facts: true,
      citations: true,
      technical: true,
      urls: true,
      numbers: true,
      formatting: true
    }
  });

  // Receive text from state (e.g. from Detector page or History)
  useEffect(() => {
    if (location.state && (location.state as any).text) {
      setText((location.state as any).text);
    }
  }, [location.state]);

  const wordCountOriginal = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleHumanize = async () => {
    if (!text.trim()) {
      error('Please enter some text to humanize.');
      return;
    }

    setIsProcessing(true);
    try {
      const humanizeOpts = { ...options, text };
      const data = await humanizerService.humanize(humanizeOpts, title);

      setTimeout(() => {
        setResult(data);
        setIsProcessing(false);
        success('Text humanized successfully!');
      }, 850);
    } catch (err: any) {
      setIsProcessing(false);
      error(err.message || 'Humanization process failed. Please try again.');
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    info('Cleared editor');
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText((prev) => (prev ? `${prev}\n${clipboardText}` : clipboardText));
        success('Pasted from clipboard');
      }
    } catch {
      error('Clipboard access not granted');
    }
  };

  const handleCopyImproved = () => {
    if (!result?.improvedText) return;
    navigator.clipboard.writeText(result.improvedText);
    setCopied(true);
    success('Copied improved text to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImproved = () => {
    if (!result?.improvedText) return;
    downloadAsTxt(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Humanized`, result.improvedText);
    success('Downloaded improved text file');
  };

  const handleCheckInDetector = () => {
    if (!result?.improvedText) return;
    navigate('/detector', { state: { text: result.improvedText } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400">
              <Wand2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              AI Writing Humanizer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Transform stiff or AI-generated text into fluid, natural writing while preserving meaning and citations.
          </p>
        </div>

        {/* Quick Sample Button */}
        <button
          type="button"
          onClick={() => {
            setText(
              'The implementation of the proposed system demonstrates significant improvements in operational efficiency. Furthermore, it is important to note that employees will utilize the dashboard daily to streamline communication workflows.'
            );
            setTitle('Process Efficiency Memo');
            success('Loaded sample text');
          }}
          className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load AI Draft Sample
        </button>
      </div>

      {/* Humanizer Control Panel */}
      <HumanizerControls
        options={options}
        onChange={(updated) => setOptions((prev) => ({ ...prev, ...updated }))}
        disabled={isProcessing}
      />

      {/* Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Original Text Editor */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between overflow-hidden">
          <div>
            <RichToolbar
              onClear={handleClear}
              onPaste={handlePaste}
              textToCopy={text}
              disabled={isProcessing}
            />

            <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Original Text
              </span>
              <span className="text-[11px] text-slate-400">
                {wordCountOriginal} words
              </span>
            </div>

            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the text you want to humanize here..."
              disabled={isProcessing}
              className="w-full p-4 bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-100 focus:outline-none resize-none font-sans"
            />
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-900/30">
            <button
              type="button"
              onClick={handleHumanize}
              disabled={isProcessing || !text.trim()}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white shadow-md hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              {isProcessing ? 'Humanizing...' : 'Humanize Text'}
            </button>

            <span className="text-[11px] text-slate-400">
              Strength: {options.strength} • Tone: {options.tone}
            </span>
          </div>
        </div>

        {/* Right Side: Improved Text Output */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between overflow-hidden">
          <div>
            {/* Top Bar with actions */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Improved Output
                </span>
                {result && (
                  <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    +{result.readabilityChange}% Readability
                  </span>
                )}
              </div>

              {result && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsCompareMode(!isCompareMode)}
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                      isCompareMode
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    <Split className="w-3.5 h-3.5" />
                    {isCompareMode ? 'Exit Diff' : 'Compare Diff'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyImproved}
                    className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Copy improved text"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadImproved}
                    className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Download text"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Output View / Loading state */}
            {isProcessing ? (
              <div className="p-8 min-h-[300px] flex items-center justify-center">
                <LoadingStepIndicator />
              </div>
            ) : result ? (
              <div className="p-5 text-sm leading-relaxed text-slate-800 dark:text-slate-100 max-h-[360px] overflow-y-auto whitespace-pre-wrap select-text font-sans">
                {result.improvedText}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[320px] space-y-2 text-slate-400">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Wand2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Your rewritten natural text will appear here
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Press <strong>Humanize Text</strong> to eliminate robotic clichés and balance sentence flow.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Bar Actions */}
          {result && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
              <button
                type="button"
                onClick={handleHumanize}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Regenerate
              </button>

              <button
                type="button"
                onClick={handleCheckInDetector}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Check Result in AI Detector
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Before and After Comparison View (Diff Viewer) */}
      {result && isCompareMode && (
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Split className="w-4 h-4 text-brand-600" />
              Before & After Comparison Highlights
            </h3>
            <span className="text-xs text-slate-500">
              Words before: <strong>{result.wordCountBefore}</strong> → Words after: <strong>{result.wordCountAfter}</strong>
            </span>
          </div>

          <DiffViewer
            originalText={result.originalText}
            improvedText={result.improvedText}
            diff={result.diff}
            readabilityChange={result.readabilityChange}
          />
        </div>
      )}

      {/* File Upload Option */}
      <div className="pt-2">
        <UploadBox
          onTextLoaded={(loadedText, fileName) => {
            setText(loadedText);
            if (fileName) setTitle(fileName.replace(/\.[^/.]+$/, ''));
          }}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};
