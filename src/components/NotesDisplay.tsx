'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Sparkles, BookOpen, Clock, ListChecks, Printer } from 'lucide-react';
import { QuizResultData } from '@/lib/types';

interface NotesDisplayProps {
  quizData: QuizResultData;
  onSwitchToQuiz: () => void;
  onSwitchToFlashcards: () => void;
}

export default function NotesDisplay({ quizData, onSwitchToQuiz, onSwitchToFlashcards }: NotesDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [activeNoteTab, setActiveNoteTab] = useState<'structured' | 'cornell'>('structured');

  const { videoTitle, summary, takeaways, questions, sections, cornellNotes } = quizData;

  // 格式化全量 Markdown 文本
  const generateMarkdown = () => {
    let md = `# ${videoTitle || 'Study Notes'}\n\n`;
    md += `## 📌 Executive Summary\n${summary}\n\n`;
    
    md += `## 🎯 Key Takeaways\n`;
    takeaways.forEach((item, idx) => {
      md += `${idx + 1}. ${item}\n`;
    });
    md += `\n`;

    if (sections && sections.length > 0) {
      md += `## 📚 Detailed Notes & Timestamps\n`;
      sections.forEach((sec) => {
        md += `### ${sec.timestamp ? `[${sec.timestamp}] ` : ''}${sec.heading}\n`;
        sec.bullets.forEach((b) => {
          md += `- ${b}\n`;
        });
        md += `\n`;
      });
    }

    if (cornellNotes) {
      md += `## 📝 Cornell Notes\n`;
      md += `### Cues / Keywords:\n`;
      cornellNotes.cues.forEach(c => md += `- ${c}\n`);
      md += `\n### Notes:\n`;
      cornellNotes.notes.forEach(n => md += `- ${n}\n`);
      md += `\n### Summary:\n${cornellNotes.summary}\n\n`;
    }

    if (questions && questions.length > 0) {
      md += `## 🧪 Review Quiz Questions\n`;
      questions.forEach((q, idx) => {
        md += `**Q${idx + 1}: ${q.question}**\n`;
        q.options.forEach((opt, oIdx) => {
          const letter = String.fromCharCode(65 + oIdx);
          const isCorrect = oIdx === q.answerIndex ? ' (Correct)' : '';
          md += `- ${letter}. ${opt}${isCorrect}\n`;
        });
        md += `> **Explanation:** ${q.explanation}\n\n`;
      });
    }

    return md;
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 容错降级
      const textarea = document.createElement('textarea');
      textarea.value = generateMarkdown();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(videoTitle || 'study-notes').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // 派生 Cornell 笔记（若后端未特别标注，则从题干与要点智能映射）
  const resolvedCornell = cornellNotes || {
    cues: questions.slice(0, 4).map(q => q.question.replace(/\?.*$/, '')),
    notes: takeaways.concat(questions.slice(0, 3).map(q => q.explanation)),
    summary: summary
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-8 text-zinc-100 shadow-xl space-y-6">
      {/* 头部标题与快捷工具栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> Ready in 10s
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400">
              <Clock className="w-3 h-3" /> AI Video to Notes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {videoTitle || 'Structured Video Lecture Notes'}
          </h2>
        </div>

        {/* 导出动作栏 */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700/60"
            title="Copy entire notes as formatted Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700/60"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" />
            .md File
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg transition-colors border border-zinc-700/60"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            PDF / Print
          </button>
        </div>
      </div>

      {/* 视图切换：结构化大纲 vs 康奈尔笔记法 */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveNoteTab('structured')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeNoteTab === 'structured'
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/40 hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Structured Summary
        </button>
        <button
          onClick={() => setActiveNoteTab('cornell')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeNoteTab === 'cornell'
              ? 'bg-amber-400 text-zinc-950 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/40 hover:bg-zinc-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Cornell Notes Format
        </button>
      </div>

      {/* 主笔记内容区 */}
      {activeNoteTab === 'structured' ? (
        <div className="space-y-6">
          {/* Executive Summary 概念摘要 */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Executive Summary
            </h3>
            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Key Takeaways 核心要点 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-emerald-400" /> Key Takeaways
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {takeaways.map((takeaway, idx) => (
                <div key={idx} className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-3.5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400">
                    <span className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30">
                      {idx + 1}
                    </span>
                    Core Concept
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-snug">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Timestamped Outline / Sections */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" /> Detailed Study Notes
            </h3>
            <div className="space-y-3">
              {(sections && sections.length > 0 ? sections : [
                {
                  heading: "Primary Foundations & Concepts",
                  timestamp: "00:00",
                  bullets: [
                    takeaways[0] || "Key theoretical context and problem statement.",
                    "Fundamental terminology and operational definitions introduced."
                  ]
                },
                {
                  heading: "Core Methodology & Analysis",
                  timestamp: "03:45",
                  bullets: [
                    takeaways[1] || "Step-by-step framework implementation.",
                    "Critical tradeoffs and domain constraints discussed in the lecture."
                  ]
                },
                {
                  heading: "Synthesis & Practical Implications",
                  timestamp: "08:20",
                  bullets: [
                    takeaways[2] || "Real-world testing strategies and retention takeaways.",
                    "Summary of key takeaways and actionable checklist."
                  ]
                }
              ]).map((sec, idx) => (
                <div key={idx} className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {sec.timestamp && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-semibold border border-zinc-700">
                        {sec.timestamp}
                      </span>
                    )}
                    <h4 className="text-sm sm:text-base font-semibold text-zinc-100">
                      {sec.heading}
                    </h4>
                  </div>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-zinc-300 pl-1">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Cornell Notes 专用三栏排版 */
        <div className="space-y-4">
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3 text-xs text-amber-300/90 leading-relaxed">
            💡 <strong>Cornell Method:</strong> Use the left Cue column for self-testing and keywords, the right column for comprehensive notes, and the bottom for instant review.
          </div>

          <div className="border border-zinc-700/80 rounded-xl overflow-hidden bg-zinc-950">
            {/* 上部：Cues + Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              {/* Cue Column */}
              <div className="p-4 sm:p-5 bg-zinc-900/40 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
                  Cues / Questions / Keywords
                </div>
                <ul className="space-y-3 text-xs sm:text-sm font-medium text-zinc-300">
                  {resolvedCornell.cues.map((cue, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-800">
                      <span className="text-amber-400 font-mono text-xs">#{idx + 1}</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Note-taking Column */}
              <div className="md:col-span-2 p-4 sm:p-5 space-y-3">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider pb-2 border-b border-zinc-800">
                  Lecture Notes & Explanations
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {resolvedCornell.notes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                      <p>{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 底部：Summary Column */}
            <div className="border-t border-zinc-800 p-4 sm:p-5 bg-zinc-900/70">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Cornell Summary
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                {resolvedCornell.summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 强化学习：测试与闪卡导流卡片 */}
      <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/60">
        <div>
          <h4 className="text-sm font-semibold text-white">Reinforce What You Just Learned</h4>
          <p className="text-xs text-zinc-400">Transform these study notes into active recall tests or flashcards.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onSwitchToQuiz}
            className="flex-1 sm:flex-initial px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-lg transition-all shadow-sm"
          >
            Take 5-Question Quiz →
          </button>
          <button
            onClick={onSwitchToFlashcards}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs sm:text-sm rounded-lg transition-colors border border-zinc-700"
          >
            Review Flashcards
          </button>
        </div>
      </div>
    </div>
  );
}
