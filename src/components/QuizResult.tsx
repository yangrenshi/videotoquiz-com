'use client';

import React from 'react';
import { Award, RotateCcw, Image as ImageIcon, Download, CheckCircle, BookOpen, Printer } from 'lucide-react';
import { QuizResultData, UserAnswerRecord, QuizScoreSummary } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { openPrintableQuizPaper, downloadAnkiCards } from '@/lib/exporter';

interface QuizResultProps {
  quizData: QuizResultData;
  answers: UserAnswerRecord[];
  timeSpentSeconds: number;
  onRestart: () => void;
  onOpenPoster: (summary: QuizScoreSummary) => void;
  onOpenPricing: () => void;
  isSample?: boolean;
}

export default function QuizResult({
  quizData,
  answers,
  timeSpentSeconds,
  onRestart,
  onOpenPoster,
  onOpenPricing,
  isSample = false,
}: QuizResultProps) {
  const { t } = useLanguage();
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const total = quizData.questions.length;
  const percentage = Math.round((correctCount / total) * 100);

  let badgeTitle: string = t.result.badgeProficient;
  let masteryLevel: string = t.result.descProficient;
  let badgeBorder: string = 'text-zinc-300 border-zinc-700 bg-zinc-800/80';

  if (percentage === 100) {
    badgeTitle = t.result.badgeMastery;
    masteryLevel = t.result.descMastery;
    badgeBorder = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  } else if (percentage >= 80) {
    badgeTitle = t.result.badgeAdvanced;
    masteryLevel = t.result.descAdvanced;
    badgeBorder = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  } else if (percentage < 60) {
    badgeTitle = t.result.badgeDeveloping;
    masteryLevel = t.result.descDeveloping;
    badgeBorder = 'text-amber-400 border-amber-500/40 bg-amber-950/30';
  }

  const scoreSummary: QuizScoreSummary = {
    total,
    correct: correctCount,
    percentage,
    timeSpentSeconds,
    masteryLevel,
    badgeTitle,
  };

  const formattedScoreText = t.result.scoreText
    .replace('{correct}', String(correctCount))
    .replace('{total}', String(total));

  // 导出逻辑：样卷全免费导出，私人视频进入定价弹窗
  const handleExport = () => {
    if (isSample) {
      openPrintableQuizPaper(quizData, answers, scoreSummary);
      downloadAnkiCards(quizData);
    } else {
      onOpenPricing();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 战报总评分卡片 (Open-Design 纯粹微质感) */}
      <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 border ${badgeBorder}`}>
          <Award className="w-3.5 h-3.5" />
          <span>{badgeTitle}</span>
        </div>

        <div className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-2 font-mono">
          {percentage}%
        </div>
        <div className="text-sm font-medium text-zinc-400 mb-3">
          {formattedScoreText}
        </div>
        <p className="max-w-md mx-auto text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
          {masteryLevel}
        </p>

        {/* 关键操作按钮 (Open-Design: 物理按键与高对比度) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenPoster(scoreSummary)}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm active:scale-95 transition-all"
          >
            <ImageIcon className="w-4 h-4 text-zinc-700" />
            <span>{t.result.btnCertificate}</span>
          </button>

          {/* 样卷免费导出 vs 私人视频付费导出 */}
          {isSample ? (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-zinc-950 shadow-sm active:scale-95 transition-all"
              title="样卷特权：免费打印完整试卷并导出 Anki 卡片"
            >
              <Printer className="w-4 h-4 text-zinc-950" />
              <span>{t.result.btnExportSampleFree}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-zinc-950" />
              <span>{t.result.btnExport}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.result.btnRestart}</span>
          </button>
        </div>
      </div>

      {/* 核心考点回顾与视频摘要 */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-lg">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200 mb-3">
          <BookOpen className="w-4 h-4 text-zinc-400" />
          <span>{t.result.takeawaysTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4 italic bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
          "{quizData.summary}"
        </p>

        <ul className="space-y-2">
          {quizData.takeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
