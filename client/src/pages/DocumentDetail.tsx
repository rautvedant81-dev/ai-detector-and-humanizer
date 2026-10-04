import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Wand2,
  Calendar,
  Layers,
  Download,
  Trash2,
  Printer
} from 'lucide-react';
import { historyService } from '../services/historyService';
import { useToast } from '../context/ToastContext';
import { ScoreCircle } from '../components/common/ScoreCircle';
import { SentenceHighlight } from '../components/detector/SentenceHighlight';
import { SentenceModal } from '../components/detector/SentenceModal';
import { InsightsCard } from '../components/detector/InsightsCard';
import { DiffViewer } from '../components/humanizer/DiffViewer';
import { DetectionResult, HumanizeResult, SentenceAnalysis } from '../types';
import { downloadAsTxt, printDetectorReport } from '../utils/exportUtils';

export const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success } = useToast();

  const [docType, setDocType] = useState<'detector' | 'humanizer' | null>(null);
  const [detectorData, setDetectorData] = useState<DetectionResult | null>(null);
  const [humanizerData, setHumanizerData] = useState<HumanizeResult | null>(null);
  const [title, setTitle] = useState<string>('Document Details');

  // Sentence modal
  const [selectedSentence, setSelectedSentence] = useState<SentenceAnalysis | null>(null);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(null);
  const [sentenceModalOpen, setSentenceModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Check detector store
    const det = historyService.getLocalDetectorResult(id);
    if (det) {
      setDocType('detector');
      setDetectorData(det);
      const items = historyService.getLocalHistory();
      const match = items.find(i => i.id === id);
      if (match) setTitle(match.title);
      return;
    }

    // Check humanizer store
    const hum = historyService.getLocalHumanizerResult(id);
    if (hum) {
      setDocType('humanizer');
      setHumanizerData(hum);
      const items = historyService.getLocalHistory();
      const match = items.find(i => i.id === id);
      if (match) setTitle(match.title);
      return;
    }

    // Fallback: mock detail
    setDocType('detector');
    setDetectorData({
      id,
      aiProbability: 68,
      humanProbability: 32,
      confidence: 'medium',
      classification: 'likely_ai',
      wordCount: 142,
      characterCount: 890,
      sentenceCount: 7,
      paragraphCount: 2,
      sentences: [
        {
          text: 'The implementation of artificial intelligence systems in clinical healthcare environments demonstrates significant improvements.',
          score: 0.82,
          classification: 'ai_like',
          reasons: ['Predictable academic phrasing', 'Impersonal passive structure']
        }
      ],
      insights: ['Sentence structures are highly uniform.', 'Moderate vocabulary variety detected.'],
      suggestions: ['Add more personal perspective or case studies.', 'Vary sentence lengths.']
    });
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    await historyService.deleteItem(id);
    success('Document deleted');
    navigate('/history');
  };

  const handleDownloadTxt = () => {
    if (detectorData) {
      downloadAsTxt(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Analysis`, `Title: ${title}\nAI Likelihood: ${detectorData.aiProbability}%\nWords: ${detectorData.wordCount}\n\n${detectorData.sentences.map(s => s.text).join(' ')}`);
    } else if (humanizerData) {
      downloadAsTxt(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Humanized`, humanizerData.improvedText);
    }
    success('Downloaded document text');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Nav Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>

        <div className="flex items-center gap-2">
          {detectorData && (
            <button
              onClick={() => printDetectorReport(title, detectorData)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Printer className="w-3.5 h-3.5" />
              Print PDF
            </button>
          )}
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
            Download TXT
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Document Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                docType === 'detector'
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600'
                  : 'bg-accent-50 dark:bg-purple-950 text-accent-600'
              }`}
            >
              {docType === 'detector' ? <ShieldCheck className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {title}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Created on {new Date().toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {detectorData?.wordCount || humanizerData?.wordCountAfter || 0} words
            </span>
            <span className="capitalize font-semibold text-brand-600">
              {docType} Record
            </span>
          </div>
        </div>

        {/* Action button */}
        {docType === 'detector' && detectorData && (
          <button
            onClick={() => navigate('/humanizer', { state: { text: detectorData.sentences.map(s => s.text).join(' ') } })}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all self-start md:self-auto flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Humanize in Editor
          </button>
        )}
      </div>

      {/* DETECTOR DETAIL VIEW */}
      {docType === 'detector' && detectorData && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Analyzed Sentences
              </h3>
              <SentenceHighlight
                sentences={detectorData.sentences}
                onSelectSentence={(s, idx) => {
                  setSelectedSentence(s);
                  setSelectedSentenceIndex(idx);
                  setSentenceModalOpen(true);
                }}
              />
            </div>
            <div className="lg:col-span-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium">
                <ScoreCircle
                  score={detectorData.aiProbability}
                  humanScore={detectorData.humanProbability}
                  confidence={detectorData.confidence}
                  classification={detectorData.classification}
                />
              </div>
            </div>
          </div>

          <InsightsCard
            insights={detectorData.insights}
            suggestions={detectorData.suggestions}
          />
        </div>
      )}

      {/* HUMANIZER DETAIL VIEW */}
      {docType === 'humanizer' && humanizerData && (
        <div className="space-y-6 animate-fade-in">
          <DiffViewer
            originalText={humanizerData.originalText}
            improvedText={humanizerData.improvedText}
            diff={humanizerData.diff || []}
            readabilityChange={humanizerData.readabilityChange}
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
    </div>
  );
};
