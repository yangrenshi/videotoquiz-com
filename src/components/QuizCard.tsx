'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles, Lock, Zap, ShieldCheck } from 'lucide-react';
import { QuizQuestion, UserAnswerRecord } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (record: UserAnswerRecord) => void;
  onNext: () => void;
  isLast: boolean;
  isLocked?: boolean;
  onOpenPricing?: () => void;
}

export default function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onNext,
  isLast,
  isLocked = false,
  onOpenPricing,
}: QuizCardProps) {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // 当切换到新题目时，严格重置答题状态，杜绝沿用上一题答案
  useEffect(() => {
    setSelectedIndex(null);
    setHasAnswered(false);
  }, [question.id]);

  const handleSelect = (idx: number) => {
    if (hasAnswered || isLocked) return;
    setSelectedIndex(idx);
    setHasAnswered(true);

    const isCorrect = idx === question.answerIndex;
    onAnswer({
      questionId: question.id,
      selectedIndex: idx,
      isCorrect,
    });
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* 顶部进度条 (Open-Design: 纤细精密仪表感) */}
      <div className="flex items-center justify-between text-xs text-zinc-300 font-medium mb-3">
        <span className="flex items-center gap-1.5 text-zinc-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.quiz.questionBadge} {currentIndex + 1} {t.quiz.of} {totalQuestions}</span>
        </span>
        <span className="text-zinc-400 font-mono text-[11px]">
          {progressPercent}% {t.quiz.completed}
        </span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 题干与选项包装容器 */}
      <div className={`relative transition-all duration-300 ${isLocked ? 'select-none pointer-events-none' : ''}`}>
        {/* 题干 (高对比纯白易读) */}
        <h3 className={`text-base sm:text-lg font-bold text-white leading-snug mb-6 ${isLocked ? 'blur-[5px]' : ''}`}>
          {question.question}
        </h3>

        {/* 4 个选项 (高对比度清晰排版，杜绝灰暗看不清) */}
        <div className={`space-y-3 mb-6 ${isLocked ? 'blur-[6px]' : ''}`}>
          {question.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectAnswer = idx === question.answerIndex;

            let cardStyle = 'border-zinc-700/80 bg-zinc-950/80 hover:border-zinc-500 hover:bg-zinc-800/80 text-zinc-100 shadow-sm';
            let keycapStyle = 'bg-zinc-800 text-zinc-200 border-zinc-600 keycap';

            if (hasAnswered) {
              if (isCorrectAnswer) {
                cardStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-sm shadow-emerald-950/40 ring-1 ring-emerald-500/50';
                keycapStyle = 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400 shadow-sm';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle = 'border-rose-500 bg-rose-950/40 text-rose-100 shadow-sm shadow-rose-950/40 ring-1 ring-rose-500/50';
                keycapStyle = 'bg-rose-500 text-white font-bold border-rose-400 shadow-sm';
              } else {
                // 未选中的其余选项：文字依然保持高对比清晰度，绝不模糊看不清
                cardStyle = 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-800';
                keycapStyle = 'bg-zinc-900 text-zinc-400 border-zinc-700/60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={hasAnswered || isLocked}
                className={`w-full p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-150 active:scale-[0.99] ${cardStyle}`}
              >
                <span className={`w-6 h-6 rounded-md border text-[11px] font-mono flex items-center justify-center shrink-0 font-semibold transition-all ${keycapStyle}`}>
                  {optionLabels[idx]}
                </span>
                <span className="text-sm pt-0.5 leading-relaxed flex-1">
                  {option}
                </span>
                {hasAnswered && isCorrectAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 毛玻璃锁定遮罩与强转化浮层 (Open-Design 质感) */}
      {isLocked && (
        <div className="absolute inset-x-3 sm:inset-x-4 top-16 bottom-3 sm:bottom-4 z-20 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-amber-500/30 shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          {/* 琥珀锁徽章 */}
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-inner mb-3.5">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>

          <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase mb-1">
            {t.quiz.lockMilestone}
          </span>

          <h3 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight mb-2">
            {t.quiz.lockTitle}
          </h3>

          <p className="max-w-md text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
            {t.quiz.lockDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={onOpenPricing}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t.quiz.lockUnlockBtn}</span>
            </button>
            <button
              type="button"
              onClick={onOpenPricing}
              className="w-full sm:w-auto py-3 px-4 rounded-xl font-medium text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            >
              {t.quiz.lockProBtn}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.quiz.lockGuarantee}</span>
          </div>
        </div>
      )}

      {/* 答完后展开的考点解析 (未锁定时) */}
      {!isLocked && hasAnswered && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 animate-fadeIn mb-6">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                {t.quiz.coreConcept}
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 下一步按钮 (未锁定时，Open-Design 高质感按钮) */}
      {!isLocked && hasAnswered && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm active:scale-95 transition-all"
          >
            <span>{isLast ? t.quiz.viewScoreBtn : t.quiz.nextBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
