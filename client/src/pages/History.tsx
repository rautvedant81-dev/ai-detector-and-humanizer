import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Edit2,
  Download,
  Eye,
  ShieldCheck,
  Wand2,
  FileText
} from 'lucide-react';
import { historyService } from '../services/historyService';
import { HistoryItem } from '../types';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { downloadAsTxt } from '../utils/exportUtils';

export const History: React.FC = () => {
  const { success, info } = useToast();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Rename Modal State
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const data = await historyService.getHistory(typeFilter, dateFilter, searchQuery);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, dateFilter, searchQuery]);

  const handleRename = async () => {
    if (!activeItem || !newTitle.trim()) return;
    await historyService.renameItem(activeItem.id, newTitle.trim());
    setRenameModalOpen(false);
    success('Document renamed successfully');
    fetchItems();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    await historyService.deleteItem(itemToDelete);
    setDeleteModalOpen(false);
    setItemToDelete(null);
    success('Document deleted');
    fetchItems();
  };

  const handleDownload = (item: HistoryItem) => {
    downloadAsTxt(`${item.title.replace(/[^a-zA-Z0-9]/g, '_')}_Summary`, `HUMANCHECK AI DOCUMENT RECORD\n\nTitle: ${item.title}\nType: ${item.type.toUpperCase()}\nDate: ${new Date(item.createdAt).toLocaleString()}\nWord Count: ${item.wordCount}\nScore/Metric: ${item.score ? item.score + '% AI Likelihood' : '+' + item.readabilityImprovement + '% Readability'}\n\nExported from HumanCheck AI.`);
    success('Downloaded document summary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <HistoryIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Analysis & Rewrite History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            View, search, rename, and export your previous detections and humanized versions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              historyService.clearAll();
              fetchItems();
              info('History cleared');
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            Clear All History
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by document title..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All' },
              { id: 'detector', label: 'Detector' },
              { id: 'humanizer', label: 'Humanizer' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  typeFilter === t.id
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDateFilter(d.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  dateFilter === d.id
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading document history...
          </div>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4 sm:px-6">Document</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Word Count</th>
                  <th className="py-3.5 px-4">AI Score / Metric</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Document & Type */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-sm sm:max-w-md">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            item.type === 'detector'
                              ? 'bg-brand-50 dark:bg-brand-950 text-brand-600'
                              : 'bg-accent-50 dark:bg-purple-950 text-accent-600'
                          }`}
                        >
                          {item.type === 'detector' ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <Wand2 className="w-4 h-4" />
                          )}
                        </div>
                        <div className="truncate">
                          <Link
                            to={`/history/${item.id}`}
                            className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 truncate block"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {item.type} Assessment
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    {/* Word Count */}
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                      {item.wordCount.toLocaleString()} words
                    </td>

                    {/* AI Score / Readability */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.type === 'detector' && item.score !== undefined ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            item.score > 60
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : item.score < 35
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {item.score}% AI Score
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          +{item.readabilityImprovement || 18}% Flow
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/history/${item.id}`}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setActiveItem(item);
                            setNewTitle(item.title);
                            setRenameModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No analyses yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Your previous detector and humanizer results will appear here automatically.
            </p>
            <Link
              to="/detector"
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all"
            >
              Analyze Your First Text
            </Link>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      <Modal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Rename Document"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Enter new title"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRenameModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRename}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white shadow"
            >
              Save Name
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Are you sure you want to delete this document record? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white shadow"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
