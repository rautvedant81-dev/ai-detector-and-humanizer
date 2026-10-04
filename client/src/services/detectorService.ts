import { DetectionResult } from '../types';
import { apiRequest } from './api';
import { runClientNLPAnalysis } from '../utils/nlpAnalysis';
import { historyService } from './historyService';

export const detectorService = {
  async analyze(text: string, title?: string): Promise<DetectionResult> {
    try {
      const response = await apiRequest<{ success: boolean; data: DetectionResult }>('/detect', {
        method: 'POST',
        body: JSON.stringify({ text, title })
      });

      const result = response.data;
      // Also cache in local history
      historyService.saveLocalDetectorResult(result, title || 'Text Analysis');
      return result;
    } catch (err) {
      console.info('Using local client NLP engine for instant processing.');
      // Fallback to client-side heuristic engine
      const localResult = runClientNLPAnalysis(text);
      localResult.id = `analysis-${Math.random().toString(36).substring(2, 9)}`;
      localResult.createdAt = new Date().toISOString();

      historyService.saveLocalDetectorResult(localResult, title || 'Text Analysis');
      return localResult;
    }
  },

  async getById(id: string): Promise<DetectionResult | null> {
    try {
      const response = await apiRequest<{ success: boolean; data: DetectionResult }>(`/detect/${id}`);
      return response.data;
    } catch (err) {
      return historyService.getLocalDetectorResult(id);
    }
  }
};
