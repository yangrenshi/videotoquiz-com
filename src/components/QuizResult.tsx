'use client';

import React, { useState } from 'react';
import { Award, RotateCcw, Image as ImageIcon, Download, CheckCircle, BookOpen, Printer, Share2, CheckCircle2 } from 'lucide-react';
import { QuizResultData, UserAnswerRecord, QuizScoreSummary } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { openPrintableQuizPaper, downloadAnkiCards } from '@/lib/exporter';
import { createShareableLink } from '@/lib/quiz-share';

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

  const [shareToast, setShareToast] = useState<string | null>(null);

  // 分享测验给好友
  const handleShareChallenge = async () => {
    try {
      const { shareId } = await createShareableLink(quizData);
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const targetUrl = isLocal ? `${window.location.origin}/quiz/${shareId}` : `https://www.videotoquiz.com/quiz/${shareId}`;
      await navigator.clipboard.writeText(targetUrl);
      setShareToast(
        lang === 'zh'
          ? `挑战链接已复制 (${targetUrl})！可直接发送给微信/好友 PK 成绩`
          : `Challenge link copied (${targetUrl})! Send to friends to compare scores.`
      );
      setTimeout(() => setShareToast(null), 4000);
    } catch (e) {
      setShareToast(lang === 'zh' ? '正在生成分享链接...' : 'Generating share link...');
      setTimeout(() => setShareToast(null), 2500);
    }
  };

  return (
    <div className="w-full space-y-6 relative">
      {/* 复制成功浮动提示 */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-zinc-950 px-4 py-2.5 rounded-xl font-medium text-xs shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* 战报总评分卡片 (Open-Design 纯粹微质感) */}
      <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden text-center">
        {/* 能力级别胶囊 (确保拥有宽裕舒适的内边距，两端绝不碰壁) */}
        <div className={`inline-flex items-center gap-2 px-5 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-5 border shadow-sm ${badgeBorder}`}>
          <Award className="w-4 h-4 shrink-0" />
          <span>{badgeTitle}</span>
        </div>

        <div className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-2 font-mono">
          {percentage}%
        </div>
        <div className="text-sm font-medium text-zinc-400 mb-3">
          {formattedScoreText}
        </div>
        <p className="max-w-md mx-auto text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 px-4">
          {masteryLevel}
        </p>

        {/* 关键操作区 (符合 frontend-design 规范：宽幅舒适内间距、卡片级留白、双核层次分明) */}
        <div className="mt-8 pt-7 border-t border-zinc-800/80 space-y-4 max-w-xl mx-auto px-2">
          {/* 操作栏 3 项：高亮显著的 Challenge Friends 核心卡片置顶横贯 */}
          <button
            type="button"
            onClick={handleShareChallenge}
            className="w-full relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-zinc-950 to-amber-500/10 border-2 border-amber-400/90 hover:border-amber-300 hover:bg-zinc-900 transition-all duration-200 shadow-lg hover:shadow-amber-500/20 text-left group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                  <span>{lang === 'zh' ? '⚡ 挑战好友 · 复制分享链接' : '⚡ Challenge Friends / Copy Share Link'}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 shadow-sm shrink-0">
                    VIRAL
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-amber-200/90 truncate mt-1">
                  {lang === 'zh' ? '生成专属短链，好友点开即可做题 PK 战报' : 'Copy live challenge link & compare recall scores'}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-2 rounded-xl shrink-0 shadow transition-all">
              {lang === 'zh' ? '复制链接' : 'Copy Link'}
            </span>
          </button>

          {/* 成果 1: 学术海报 & 成果 2: 导出 Anki */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 成果 1: 生成学术结业荣誉海报 */}
            <button
              type="button"
              onClick={() => onOpenPoster(scoreSummary)}
              className="group relative flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:scale-105 transition-all shrink-0 shadow-inner">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-white tracking-tight truncate">
                    {lang === 'zh' ? '生成学术结业海报' : 'Academic Certificate'}
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 truncate mt-1">
                    {lang === 'zh' ? '1080P 高清战报 · 社交分享' : '1080P HD shareable badge'}
                  </div>
                </div>
              </div>
              <span className="text-sm text-zinc-500 group-hover:text-zinc-300 ml-3 shrink-0 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* 成果 2: 导出打印版试卷与 Anki (变现核心 CTA，微金奢华微光，宽裕内间距) */}
            <button
              type="button"
              onClick={handleExport}
              className="group relative flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent hover:from-amber-500/25 hover:via-amber-500/10 border border-amber-500/40 hover:border-amber-400 text-left transition-all duration-200 shadow-sm hover:shadow-amber-500/10 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-300 group-hover:text-amber-200 group-hover:scale-105 transition-all shrink-0 shadow-inner">
                  {isSample ? (
                    <Printer className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Download className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-white tracking-tight truncate">
                      {lang === 'zh' ? '导出 PDF / Anki 卡包' : 'Export PDF & Anki'}
                    </span>
                    {/* 精致独立微徽章 */}
                    {isSample ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        {lang === 'zh' ? '免费' : 'FREE'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 shrink-0 shadow-sm">
                        $4.99
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 truncate mt-1">
                    {lang === 'zh' ? '高清打印卷 · 记忆闪卡包' : 'Printable exam & spaced cards'}
                  </div>
                </div>
              </div>
              <span className="text-sm text-amber-400/80 group-hover:text-amber-300 ml-3 shrink-0 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

          {/* 轻量次级按键 - 测试下一个视频 (充足内边距，雅致通透) */}
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'zh' ? '测验完成，测试下一个视频' : 'Test another video'}</span>
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
