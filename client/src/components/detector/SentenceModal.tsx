import React from 'react';
import { Modal } from '../common/Modal';
import { SentenceAnalysis } from '../../types';
import { AlertCircle, CheckCircle2, AlertTriangle, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SentenceModalProps {
  sentence: SentenceAnalysis | null;
  index: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SentenceModal: React.FC<SentenceModalProps> = ({
  sentence,
  index,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  if (!sentence) return null;

  const aiPercentage = Math.round(sentence.score * 100);

  let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
  let badgeLabel = 'Human-like pattern';
  let Icon = CheckCircle2;

  if (sentence.classification === 'ai_like') {
    badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
    badgeLabel = 'AI-like pattern detected';
    Icon = AlertCircle;
  } else if (sentence.classification === 'mixed') {
    badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    badgeLabel = 'Uncertain / Mixed patterns';
    Icon = AlertTriangle;
  }

  const handleHumanizeThis = () => {
    onClose();
    navigate('/humanizer', { state: { text: sentence.text } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Sentence Analysis #${(index ?? 0) + 1}`}>
      <div className="space-y-4">
        {/* Sentence Text Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium italic text-slate-800 dark:text-slate-200 leading-relaxed">
          "{sentence.text}"
        </div>

        {/* Classification Header */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
            <Icon className="w-3.5 h-3.5" />
            {badgeLabel}
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Estimated Predictability: </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">{aiPercentage}%</span>
          </div>
        </div>

        {/* Reasons List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Linguistic Pattern Observations
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {sentence.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-100/50 dark:bg-slate-800/40 p-2.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
          Note: These linguistic patterns do not constitute definitive proof of AI authorship. Formal and academic human writing frequently shares similar regularities.
        </p>

        {/* Action Button */}
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleHumanizeThis}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Humanize in Editor
          </button>
        </div>
      </div>
    </Modal>
  );
};
