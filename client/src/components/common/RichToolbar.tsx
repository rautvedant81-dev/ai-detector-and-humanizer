import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Copy,
  Trash2,
  ClipboardCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface RichToolbarProps {
  onClear: () => void;
  onPaste?: () => void;
  textToCopy?: string;
  disabled?: boolean;
}

export const RichToolbar: React.FC<RichToolbarProps> = ({
  onClear,
  onPaste,
  textToCopy,
  disabled = false
}) => {
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-t-xl text-slate-600 dark:text-slate-400 text-xs">
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={disabled}
          title="Bold"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          title="Italic"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          title="Underline"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
        <button
          type="button"
          disabled={disabled}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        {onPaste && (
          <button
            type="button"
            onClick={onPaste}
            disabled={disabled}
            className="px-2.5 py-1 rounded bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            Paste
          </button>
        )}
        {textToCopy && (
          <button
            type="button"
            onClick={handleCopy}
            disabled={disabled}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            {copied ? <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          title="Clear Text"
          className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
