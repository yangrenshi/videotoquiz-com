import { QuizResultData, UserAnswerRecord, QuizScoreSummary } from './types';

/**
 * 导出 Anki 闪卡格式文本 (.txt)
 * 格式遵循 Anki 标准 TSV (Tab-Separated Values)
 */
export function downloadAnkiCards(quizData: QuizResultData): void {
  const lines: string[] = [];
  
  quizData.questions.forEach((q, idx) => {
    const optionLabels = ['A', 'B', 'C', 'D'];
    const optionsText = q.options.map((opt, i) => `${optionLabels[i]}. ${opt}`).join('<br>');
    const front = `<b>Q${idx + 1}: ${q.question}</b><br><br>${optionsText}`;
    const back = `<b>Correct Answer:</b> Option ${optionLabels[q.answerIndex]} - ${q.options[q.answerIndex]}<br><br><b>Key Concept:</b> ${q.explanation}`;
    
    // Tab 分隔 Front 和 Back
    lines.push(`${front}\t${back}`);
  });

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `anki-${quizData.videoId || 'quiz'}-cards.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * 打开排版精美的打印版 A4 试卷页面并调起系统打印（可一键另存为 PDF）
 */
export function openPrintableQuizPaper(
  quizData: QuizResultData,
  answers: UserAnswerRecord[],
  summary: QuizScoreSummary
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const optionLabels = ['A', 'B', 'C', 'D'];
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const questionsHtml = quizData.questions
    .map((q, idx) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      const userSelectedLabel = userAnswer ? optionLabels[userAnswer.selectedIndex] : 'None';
      const isCorrect = userAnswer?.isCorrect;

      const optionsHtml = q.options
        .map(
          (opt, i) => `
          <div style="margin-bottom: 6px; padding-left: 12px; font-size: 13px;">
            <strong style="display: inline-block; width: 22px;">${optionLabels[i]}.</strong> ${opt}
          </div>`
        )
        .join('');

      return `
        <div style="margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px dashed #e2e8f0; page-break-inside: avoid;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 10px; color: #0f172a;">
            ${idx + 1}. ${q.question}
          </div>
          ${optionsHtml}
          <div style="margin-top: 10px; font-size: 12px; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="color: ${isCorrect ? '#16a34a' : '#dc2626'}; font-weight: bold;">
              Your Answer: ${userSelectedLabel} (${isCorrect ? '✓ Correct' : '✗ Incorrect'})
            </span>
            <span style="margin: 0 8px; color: #94a3b8;">|</span>
            <span style="color: #0f172a; font-weight: bold;">Official Answer: ${optionLabels[q.answerIndex]}</span>
            <div style="margin-top: 4px; color: #475569; font-style: italic;">
              <strong>Rationale:</strong> ${q.explanation}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const takeawaysHtml = quizData.takeaways
    .map((item) => `<li style="margin-bottom: 4px;">${item}</li>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${quizData.videoTitle} - Examination Worksheet</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            line-height: 1.5;
          }
          .header-box {
            border: 2px solid #0f172a;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 24px;
          }
          .title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; }
          .subtitle { font-size: 12px; color: #64748b; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; margin-top: 12px; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          .summary-card { background: #f1f5f9; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 12.5px; }
          .footer { font-size: 11px; text-align: center; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; text-align: right;">
          <button onclick="window.print()" style="background: #0f172a; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header-box">
          <div class="subtitle">Academic Cognitive Retention Worksheet • Official Assessment</div>
          <div class="title">${quizData.videoTitle}</div>
          <div class="meta-grid">
            <div><strong>Score:</strong> ${summary.percentage}% (${summary.correct}/${summary.total})</div>
            <div><strong>Rating:</strong> ${summary.badgeTitle}</div>
            <div><strong>Date:</strong> ${dateStr}</div>
          </div>
        </div>

        <div class="summary-card">
          <strong style="color: #0f172a;">Executive Synthesis & Core Takeaways:</strong>
          <p style="margin: 6px 0 10px 0; color: #334155;">"${quizData.summary}"</p>
          <ul style="margin: 0; padding-left: 20px; color: #475569;">
            ${takeawaysHtml}
          </ul>
        </div>

        <h3 style="font-size: 15px; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 18px;">
          Formative Evaluation Questions & Detailed Rationales
        </h3>

        ${questionsHtml}

        <div class="footer">
          Generated via VideoToQuiz AI (https://www.videotoquiz.com) • Certified Cognitive Assessment System
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
