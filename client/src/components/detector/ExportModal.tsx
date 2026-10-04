import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DetectionResult } from '../../types';
import { FileText, Printer, Download, Check } from 'lucide-react';
import { downloadAsTxt, generateDetectorReportText, printDetectorReport } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DetectionResult;
  title: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  result,
  title
}) => {
  const { success } = useToast();
  const [downloadedTxt, setDownloadedTxt] = useState(false);

  const handleDownloadTxt = () => {
    const reportText = generateDetectorReportText(title, result);
    downloadAsTxt(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Report`, reportText);
    setDownloadedTxt(true);
    success('TXT report downloaded successfully');
    setTimeout(() => setDownloadedTxt(false), 2000);
  };

  const handlePrintPdf = () => {
    printDetectorReport(title, result);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download Analysis Report">
      <div className="space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Export your linguistic assessment report for documentation, sharing, or academic review.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* PDF / Print option */}
          <button
            onClick={handlePrintPdf}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 bg-white dark:bg-slate-800 flex flex-col items-center justify-center gap-2.5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                PDF Report (Print)
              </span>
              <span className="text-[11px] text-slate-500">
                Formatted styled document
              </span>
            </div>
          </button>

          {/* TXT Download */}
          <button
            onClick={handleDownloadTxt}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 bg-white dark:bg-slate-800 flex flex-col items-center justify-center gap-2.5 transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              {downloadedTxt ? <Check className="w-5 h-5 text-emerald-600" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                Plain Text (TXT)
              </span>
              <span className="text-[11px] text-slate-500">
                Raw structured report
              </span>
            </div>
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-500">
          All reports include metrics, full sentence-level scores, pattern insights, and the standard ethical AI assessment disclaimer.
        </div>
      </div>
    </Modal>
  );
};
