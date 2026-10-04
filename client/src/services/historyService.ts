import { HistoryItem, DetectionResult, HumanizeResult } from '../types';
import { apiRequest } from './api';

const LOCAL_HISTORY_KEY = 'humancheck_history_items';
const LOCAL_ANALYSES_MAP = 'humancheck_analyses_map';
const LOCAL_HUMANIZES_MAP = 'humancheck_humanizes_map';

export const historyService = {
  async getHistory(type = 'all', filter = 'all', search = ''): Promise<HistoryItem[]> {
    try {
      const params = new URLSearchParams();
      if (type !== 'all') params.append('type', type);
      if (filter !== 'all') params.append('filter', filter);
      if (search) params.append('search', search);

      const res = await apiRequest<{ success: boolean; data: HistoryItem[] }>(`/history?${params.toString()}`);
      return res.data;
    } catch (err) {
      // Local fallback
      return this.getLocalHistory(type, filter, search);
    }
  },

  async deleteItem(id: string): Promise<boolean> {
    try {
      await apiRequest(`/history/${id}`, { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    this.removeLocalItem(id);
    return true;
  },

  async renameItem(id: string, title: string): Promise<boolean> {
    try {
      await apiRequest(`/history/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title })
      });
    } catch (e) {
      // ignore
    }
    this.renameLocalItem(id, title);
    return true;
  },

  async clearAll(): Promise<boolean> {
    try {
      await apiRequest('/history', { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem(LOCAL_HISTORY_KEY);
    localStorage.removeItem(LOCAL_ANALYSES_MAP);
    localStorage.removeItem(LOCAL_HUMANIZES_MAP);
    return true;
  },

  // Local storage helpers
  getLocalHistory(type = 'all', filter = 'all', search = ''): HistoryItem[] {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    let items: HistoryItem[] = [];

    if (raw) {
      try {
        items = JSON.parse(raw);
      } catch (e) {
        items = [];
      }
    }

    if (items.length === 0) {
      // Seed initial demo items if empty
      items = [
        {
          id: 'analysis-demo-1',
          type: 'detector',
          title: 'Artificial Intelligence in Healthcare Paper',
          wordCount: 51,
          score: 78,
          humanScore: 22,
          classification: 'likely_ai',
          confidence: 'high',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'analysis-demo-2',
          type: 'detector',
          title: 'Product Launch Blog Post',
          wordCount: 54,
          score: 14,
          humanScore: 86,
          classification: 'likely_human',
          confidence: 'high',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'humanize-demo-1',
          type: 'humanizer',
          title: 'Executive Summary Rewrite',
          wordCount: 25,
          readabilityImprovement: 22,
          tone: 'natural',
          strength: 2,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(items));
    }

    if (type !== 'all') {
      items = items.filter(i => i.type === type);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q));
    }

    if (filter === 'today') {
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      items = items.filter(i => new Date(i.createdAt).getTime() >= dayAgo);
    } else if (filter === 'week') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      items = items.filter(i => new Date(i.createdAt).getTime() >= weekAgo);
    } else if (filter === 'month') {
      const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      items = items.filter(i => new Date(i.createdAt).getTime() >= monthAgo);
    }

    return items;
  },

  saveLocalDetectorResult(result: DetectionResult, title: string) {
    if (!result.id) return;
    const historyItem: HistoryItem = {
      id: result.id,
      type: 'detector',
      title,
      wordCount: result.wordCount,
      score: result.aiProbability,
      humanScore: result.humanProbability,
      classification: result.classification,
      confidence: result.confidence,
      createdAt: result.createdAt || new Date().toISOString()
    };

    const items = this.getLocalHistory('all', 'all', '');
    const updated = [historyItem, ...items.filter(i => i.id !== result.id)];
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));

    // Save full result
    const map = this.getJsonMap(LOCAL_ANALYSES_MAP);
    map[result.id] = result;
    localStorage.setItem(LOCAL_ANALYSES_MAP, JSON.stringify(map));
  },

  saveLocalHumanizerResult(result: HumanizeResult, title: string) {
    if (!result.id) return;
    const historyItem: HistoryItem = {
      id: result.id,
      type: 'humanizer',
      title,
      wordCount: result.wordCountAfter,
      readabilityImprovement: result.readabilityChange,
      createdAt: result.createdAt || new Date().toISOString()
    };

    const items = this.getLocalHistory('all', 'all', '');
    const updated = [historyItem, ...items.filter(i => i.id !== result.id)];
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));

    const map = this.getJsonMap(LOCAL_HUMANIZES_MAP);
    map[result.id] = result;
    localStorage.setItem(LOCAL_HUMANIZES_MAP, JSON.stringify(map));
  },

  getLocalDetectorResult(id: string): DetectionResult | null {
    const map = this.getJsonMap(LOCAL_ANALYSES_MAP);
    return map[id] || null;
  },

  getLocalHumanizerResult(id: string): HumanizeResult | null {
    const map = this.getJsonMap(LOCAL_HUMANIZES_MAP);
    return map[id] || null;
  },

  removeLocalItem(id: string) {
    const items = this.getLocalHistory('all', 'all', '');
    const updated = items.filter(i => i.id !== id);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));

    const aMap = this.getJsonMap(LOCAL_ANALYSES_MAP);
    delete aMap[id];
    localStorage.setItem(LOCAL_ANALYSES_MAP, JSON.stringify(aMap));

    const hMap = this.getJsonMap(LOCAL_HUMANIZES_MAP);
    delete hMap[id];
    localStorage.setItem(LOCAL_HUMANIZES_MAP, JSON.stringify(hMap));
  },

  renameLocalItem(id: string, title: string) {
    const items = this.getLocalHistory('all', 'all', '');
    const item = items.find(i => i.id === id);
    if (item) {
      item.title = title;
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(items));
    }
  },

  getJsonMap(key: string): Record<string, any> {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
};
