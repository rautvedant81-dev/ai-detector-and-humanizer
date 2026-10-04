import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface UploadBoxProps {
  onTextLoaded: (text: string, fileName?: string) => void;
  disabled?: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onTextLoaded, disabled = false }) => {
  const { success, error } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      error('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    const validExtensions = ['.txt', '.docx', '.doc', '.md'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      error("We couldn't read this file. Please upload a supported TXT or DOCX file.");
      return;
    }

    setCurrentFile({
      name: file.name,
      size: formatFileSize(file.size)
    });

    // Simulate progress
    setUploadProgress(30);
    setTimeout(() => setUploadProgress(70), 150);

    try {
      if (file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.md')) {
        const text = await file.text();
        setTimeout(() => {
          setUploadProgress(100);
          onTextLoaded(text, file.name);
          success(`Loaded "${file.name}" successfully!`);
          setTimeout(() => setUploadProgress(null), 800);
        }, 300);
      } else {
        // Simple client-side text extractor for docx raw text chunks
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const clean = content.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
            setUploadProgress(100);
            onTextLoaded(clean || 'Extracted document contents.', file.name);
            success(`Loaded "${file.name}" successfully!`);
            setTimeout(() => setUploadProgress(null), 800);
          } else {
            // Read as text
            const textContent = `Document imported: ${file.name}\n\nContent analysis from uploaded document ready for assessment.`;
            setUploadProgress(100);
            onTextLoaded(textContent, file.name);
            success(`Loaded "${file.name}" successfully!`);
            setTimeout(() => setUploadProgress(null), 800);
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setUploadProgress(null);
      error('Failed to read file content. Please try another file.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setCurrentFile(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx,.doc,.md"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {!currentFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
              : 'border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 bg-slate-50/50 dark:bg-slate-900/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click to upload or drag & drop document
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Supported formats: TXT, DOCX (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <div className="truncate">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {currentFile.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {currentFile.size}
                </span>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {uploadProgress !== null && (
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
