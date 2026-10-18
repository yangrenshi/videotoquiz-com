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
  const { t, lang } = useLanguage();
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

        {/* 关键操作区 (符合 frontend-design 规范：双核成果卡片 + 呼吸留白 + 层次解耦) */}
        <div className="mt-7 pt-6 border-t border-zinc-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto">
            {/* 成果 1: 生成学术结业荣誉海报 */}
            <button
              type="button"
              onClick={() => onOpenPoster(scoreSummary)}
              className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-zinc-950/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:scale-105 transition-all shrink-0 shadow-inner">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-white tracking-tight truncate">
                    {lang === 'zh' ? '生成学术结业海报' : 'Academic Certificate'}
                  </div>
                  <div className="text-[11px] text-zinc-400 group-hover:text-zinc-300 truncate mt-0.5">
                    {lang === 'zh' ? '1080P 高清战报 · 社交分享' : '1080P HD shareable badge'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-zinc-500 group-hover:text-zinc-300 ml-2 shrink-0 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>

            {/* 成果 2: 导出打印版试卷与 Anki (变现核心 CTA，微金奢华微光) */}
            <button
              type="button"
              onClick={handleExport}
              className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent hover:from-amber-500/20 hover:via-amber-500/10 border border-amber-500/40 hover:border-amber-400/80 text-left transition-all duration-200 shadow-sm hover:shadow-amber-500/10 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-300 group-hover:text-amber-200 group-hover:scale-105 transition-all shrink-0 shadow-inner">
                  {isSample ? (
                    <Printer className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Download className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-white tracking-tight truncate">
                      {lang === 'zh' ? '导出 PDF / Anki 卡包' : 'Export PDF & Anki'}
                    </span>
                    {/* 精致微徽章 */}
                    {isSample ? (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        {lang === 'zh' ? '免费' : 'FREE'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-zinc-950 shrink-0 shadow-sm">
                        $4.99
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 group-hover:text-zinc-300 truncate mt-0.5">
                    {lang === 'zh' ? '高清打印卷 · 记忆闪卡包' : 'Printable exam & spaced cards'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-amber-400/70 group-hover:text-amber-300 ml-2 shrink-0 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>

          {/* 轻量次级按键 - 测试下一个视频 */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'zh' ? '测验完成，测试下一个视频' : 'Test another video'}</span>
            </button>
          </div>
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
