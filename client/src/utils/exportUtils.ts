import { DetectionResult, HumanizeResult } from '../types';

export function downloadAsTxt(filename: string, content: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function generateDetectorReportText(title: string, result: DetectionResult): string {
  const divider = '=======================================================';
  const subDivider = '-------------------------------------------------------';

  let report = `${divider}\n`;
  report += `HUMANCHECK AI - CONTENT ANALYSIS REPORT\n`;
  report += `${divider}\n`;
  report += `Title: ${title}\n`;
  report += `Date: ${new Date().toLocaleString()}\n`;
  report += `Assessment: ${result.classification === 'likely_ai' ? 'Likely AI-Generated' : result.classification === 'likely_human' ? 'Likely Human-Written' : 'Mixed / Uncertain'}\n`;
  report += `AI Probability: ${result.aiProbability}%\n`;
  report += `Human Probability: ${result.humanProbability}%\n`;
  report += `Confidence Level: ${result.confidence.toUpperCase()}\n\n`;

  report += `${subDivider}\nMETRICS & METADATA\n${subDivider}\n`;
  report += `Words: ${result.wordCount}\n`;
  report += `Characters: ${result.characterCount}\n`;
  report += `Sentences: ${result.sentenceCount}\n`;
  report += `Paragraphs: ${result.paragraphCount}\n\n`;

  report += `${subDivider}\nKEY INSIGHTS\n${subDivider}\n`;
  result.insights.forEach((insight, idx) => {
    report += `• ${insight}\n`;
  });
  report += '\n';

  report += `${subDivider}\nRECOMMENDED IMPROVEMENTS\n${subDivider}\n`;
  result.suggestions.forEach((sugg, idx) => {
    report += `• ${sugg}\n`;
  });
  report += '\n';

  report += `${subDivider}\nSENTENCE-BY-SENTENCE BREAKDOWN\n${subDivider}\n`;
  result.sentences.forEach((sent, idx) => {
    report += `[Sentence ${idx + 1}] (${sent.classification.toUpperCase()} - ${Math.round(sent.score * 100)}% AI Index)\n`;
    report += `"${sent.text}"\n`;
    if (sent.reasons && sent.reasons.length > 0) {
      report += `Reasons: ${sent.reasons.join('; ')}\n`;
    }
    report += '\n';
  });

  report += `${divider}\n`;
  report += `DISCLAIMER: AI detection is probabilistic and should be treated as an assessment, not definitive proof of authorship.\n`;
  report += `${divider}\n`;

  return report;
}

export function printDetectorReport(title: string, result: DetectionResult) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>HumanCheck AI Report - ${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
          .header { border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 24px; font-weight: 800; color: #4f46e5; }
          .score-box { display: flex; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
          .metric { flex: 1; text-align: center; }
          .metric-val { font-size: 32px; font-weight: 800; color: #0f172a; }
          .metric-lbl { font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 600; }
          .grid-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; }
          .section-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .sentence-item { margin-bottom: 12px; padding: 10px; border-radius: 6px; background: #f8fafc; border-left: 4px solid #94a3b8; }
          .sentence-item.ai_like { border-left-color: #ef4444; background: #fef2f2; }
          .sentence-item.mixed { border-left-color: #f59e0b; background: #fffbeb; }
          .sentence-item.human_like { border-left-color: #10b981; background: #ecfdf5; }
          .disclaimer { margin-top: 40px; padding: 16px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #64748b; text-align: center; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">HumanCheck AI</div>
            <div style="font-size: 14px; color: #64748b;">Linguistic Pattern Assessment Report</div>
          </div>
          <div style="text-align: right; font-size: 13px; color: #64748b;">
            <div><strong>Document:</strong> ${title}</div>
            <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="score-box">
          <div class="metric">
            <div class="metric-val" style="color: ${result.aiProbability > 60 ? '#ef4444' : result.aiProbability < 35 ? '#10b981' : '#f59e0b'};">${result.aiProbability}%</div>
            <div class="metric-lbl">AI Likelihood</div>
          </div>
          <div class="metric">
            <div class="metric-val" style="color: #10b981;">${result.humanProbability}%</div>
            <div class="metric-lbl">Human Likelihood</div>
          </div>
          <div class="metric">
            <div class="metric-val">${result.confidence.toUpperCase()}</div>
            <div class="metric-lbl">Confidence Level</div>
          </div>
        </div>

        <div class="grid-stats">
          <div class="stat-card"><strong>${result.wordCount}</strong><br><span style="font-size: 12px; color: #64748b;">Words</span></div>
          <div class="stat-card"><strong>${result.characterCount}</strong><br><span style="font-size: 12px; color: #64748b;">Characters</span></div>
          <div class="stat-card"><strong>${result.sentenceCount}</strong><br><span style="font-size: 12px; color: #64748b;">Sentences</span></div>
          <div class="stat-card"><strong>${result.paragraphCount}</strong><br><span style="font-size: 12px; color: #64748b;">Paragraphs</span></div>
        </div>

        <div class="section-title">Key Observations & Insights</div>
        <ul>
          ${result.insights.map(i => `<li>${i}</li>`).join('')}
        </ul>

        <div class="section-title">Sentence-Level Analysis</div>
        ${result.sentences.map((s, idx) => `
          <div class="sentence-item ${s.classification}">
            <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">
              Sentence ${idx + 1} (${s.classification.replace('_', ' ').toUpperCase()} • ${Math.round(s.score * 100)}% AI Index)
            </div>
            <div>"${s.text}"</div>
            ${s.reasons && s.reasons.length ? `<div style="font-size: 12px; color: #64748b; margin-top: 4px;">• ${s.reasons.join(' • ')}</div>` : ''}
          </div>
        `).join('')}

        <div class="disclaimer">
          <strong>Important Note:</strong> AI detection is probabilistic and should be treated as an assessment, not definitive proof of authorship. Linguistic patterns are influenced by topic formality, academic standards, and personal style.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
