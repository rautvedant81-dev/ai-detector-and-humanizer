import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Download,
  Wand2
} from 'lucide-react';
import { RichToolbar } from '../components/common/RichToolbar';
import { UploadBox } from '../components/common/UploadBox';
import { ScoreCircle } from '../components/common/ScoreCircle';
import { SentenceHighlight } from '../components/detector/SentenceHighlight';
import { SentenceModal } from '../components/detector/SentenceModal';
import { StatsCard } from '../components/detector/StatsCard';
import { InsightsCard } from '../components/detector/InsightsCard';
import { ExportModal } from '../components/detector/ExportModal';
import { LoadingStepIndicator } from '../components/humanizer/LoadingStepIndicator';
import { detectorService } from '../services/detectorService';
import { DetectionResult, SentenceAnalysis } from '../types';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export const Detector: React.FC = () => {
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [text, setText] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('Untitled Document');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  // Modal states
  const [selectedSentence, setSelectedSentence] = useState<SentenceAnalysis | null>(null);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(null);
  const [sentenceModalOpen, setSentenceModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;

  const handleAnalyze = async () => {
    if (!text.trim()) {
      error('Please enter some text before analyzing.');
      return;
    }

    if (wordCount < 4) {
      error('Please provide more text for a more useful analysis (at least 5-10 words).');
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await detectorService.analyze(text, docTitle);
      setTimeout(() => {
        setResult(data);
        setIsAnalyzing(false);
        success('Text analyzed successfully!');
      }, 700);
    } catch (err: any) {
      setIsAnalyzing(false);
      error(err.message || 'Analysis failed. Please try again.');
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
    } catch (e) {
      error('Clipboard access not granted');
    }
  };

  const handleFileLoaded = (loadedText: string, fileName?: string) => {
    setText(loadedText);
    if (fileName) {
      setDocTitle(fileName.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSelectSentence = (sentence: SentenceAnalysis, index: number) => {
    setSelectedSentence(sentence);
    setSelectedSentenceIndex(index);
    setSentenceModalOpen(true);
  };

  const handleSendToHumanizer = () => {
    navigate('/humanizer', { state: { text } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              AI Content Detector
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Paste or upload text below to analyze linguistic predictability and sentence patterns.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-subtle transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download Report
            </button>
            <button
              onClick={handleSendToHumanizer}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Open in Humanizer
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Input Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
            {/* Rich Editor Toolbar */}
            <RichToolbar
              onClear={handleClear}
              onPaste={handlePaste}
              textToCopy={text}
              disabled={isAnalyzing}
            />

            {/* Document Title Input */}
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Document Title"
                className="text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none w-full max-w-xs"
              />
              <span className="text-[11px] text-slate-400">
                {wordCount} words • {charCount} chars
              </span>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={14}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your essay, article, research paper, or blog post here to analyze linguistic patterns..."
                disabled={isAnalyzing}
                className="w-full p-4 sm:p-5 bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-100 focus:outline-none resize-none font-sans"
              />

              {/* Character limit & warning */}
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {wordCount < 30 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      ⚠️ Longer samples (30+ words) provide more reliable analysis.
                    </span>
                  ) : (
                    <span>Sample length is optimal for pattern detection.</span>
                  )}
                </span>
                <span>{charCount} / 25,000</span>
              </div>
            </div>
          </div>

          {/* Action Buttons & File Uploader */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing Patterns...' : 'Analyze Text'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={isAnalyzing || !text}
                className="px-4 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            {/* Quick Demo Pre-fill button */}
            <button
              type="button"
              onClick={() => {
                setText(
                  'The implementation of artificial intelligence systems in clinical healthcare environments demonstrates significant improvements in diagnostic efficiency. Furthermore, it is important to note that automated neural networks play a pivotal role in predicting radiological anomalies. In conclusion, these technologies foster a holistic paradigm shift in modern medicine.'
                );
                setDocTitle('AI in Healthcare Analysis');
                success('Loaded sample text');
              }}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load AI Sample
            </button>
          </div>

          {/* Drag and Drop File Upload Component */}
          <div className="pt-2">
            <UploadBox onTextLoaded={handleFileLoaded} disabled={isAnalyzing} />
          </div>
        </div>

        {/* Right / Results Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {isAnalyzing ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle min-h-[420px] flex items-center justify-center">
              <LoadingStepIndicator
                steps={[
                  'Extracting sentence length metrics...',
                  'Measuring vocabulary redundancy (TTR)...',
                  'Checking predictable transition clichés...',
                  'Calculating composite probability score...',
                  'Compiling report...'
                ]}
              />
            </div>
          ) : result ? (
            <div className="space-y-6 animate-fade-in">
              {/* Score Circular Gauge Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium">
                <ScoreCircle
                  score={result.aiProbability}
                  humanScore={result.humanProbability}
                  confidence={result.confidence}
                  classification={result.classification}
                />

                {/* Important Disclaimer */}
                <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 leading-relaxed text-center">
                  <strong>Important:</strong> This result is an estimate based on linguistic patterns and is not definitive proof that AI was used.
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center min-h-[380px] space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Awaiting Analysis
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Paste your text on the left and click <strong>Analyze Text</strong> to view full probability scores, sentence highlights, and insights.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analysis Breakdown (Visible after run) */}
      {result && (
        <div className="space-y-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 animate-fade-in">
          {/* 1. Statistics Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Document Metrics Overview
            </h3>
            <StatsCard
              words={result.wordCount}
              characters={result.characterCount}
              sentences={result.sentenceCount}
              paragraphs={result.paragraphCount}
              aiProbability={result.aiProbability}
              humanProbability={result.humanProbability}
            />
          </div>

          {/* 2. Sentence-Level Breakdown Highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sentence-Level Linguistic Analysis
              </h3>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
                {result.sentences.length} sentences analyzed
              </span>
            </div>
            <SentenceHighlight
              sentences={result.sentences}
              onSelectSentence={handleSelectSentence}
            />
          </div>

          {/* 3. Writing Insights & Suggestions */}
          <InsightsCard
            insights={result.insights}
            suggestions={result.suggestions}
          />
        </div>
      )}

      {/* Sentence Explanation Modal */}
      <SentenceModal
        isOpen={sentenceModalOpen}
        onClose={() => setSentenceModalOpen(false)}
        sentence={selectedSentence}
        index={selectedSentenceIndex}
      />

      {/* Export Report Modal */}
      {result && (
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          result={result}
          title={docTitle}
        />
      )}
    </div>
  );
};
