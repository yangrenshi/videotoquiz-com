'use client';

import React, { useState, useEffect } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Layers, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface FlashcardDeckProps {
  questions: QuizQuestion[];
  title?: string;
  onBackToQuiz?: () => void;
}

export default function FlashcardDeck({ questions, title, onBackToQuiz }: FlashcardDeckProps) {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const total = questions.length;
  const currentQ = questions[currentIndex];
  const optionLabels = ['A', 'B', 'C', 'D'];

  // 翻页时自动重置为正面
  const handleNext = () => {
    if (currentIndex < total - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // 键盘快捷键支持 (空格翻转，左右方向键切换)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在输入框中触发
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < total - 1) {
          setIsFlipped(false);
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          setIsFlipped(false);
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total]);

  if (!currentQ) return null;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 顶部控制栏 */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '🗂️ 闪卡背诵模式' : '🗂️ Flashcard Active Recall'}</span>
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {onBackToQuiz && (
          <button
            type="button"
            onClick={onBackToQuiz}
            className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-medium underline underline-offset-4"
          >
            {lang === 'zh' ? '← 返回测验做题模式' : '← Back to Quiz Test'}
          </button>
        )}
      </div>

      {/* 3D 翻转卡片容器 */}
      <div
        onClick={handleFlip}
        className="w-full min-h-[380px] sm:min-h-[420px] rounded-2xl cursor-pointer perspective select-none group relative"
        title={lang === 'zh' ? '点击或按空格键翻转查看答案' : 'Click or press Space to flip'}
      >
        <div
          className={`w-full h-full rounded-2xl transition-all duration-500 transform-style-3d border border-zinc-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between ${
            isFlipped
              ? 'bg-gradient-to-br from-zinc-900 via-emerald-950/20 to-zinc-900 border-emerald-500/30'
              : 'bg-zinc-900 hover:border-zinc-700'
          }`}
        >
          {/* 卡片头部信息 */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
            <span className="text-xs font-bold font-mono tracking-wider text-zinc-400">
              CARD {currentIndex + 1} OF {total}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 hidden sm:inline-block">
                {lang === 'zh' ? '按空格翻转' : 'Space to flip'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-300 flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                <span>{isFlipped ? (lang === 'zh' ? '答案与解析' : 'Answer') : (lang === 'zh' ? '题目正面' : 'Question')}</span>
              </span>
            </div>
          </div>

          {/* 正面：题目与选项 */}
          {!isFlipped ? (
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* 选项展示 */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                {currentQ.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2"
                  >
                    <span className="font-mono font-bold text-zinc-500 shrink-0 w-4">{optionLabels[idx]}.</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-zinc-500 pt-2 flex items-center justify-center gap-1">
                <span>{lang === 'zh' ? '👆 点击卡片任意处翻转，查看正确答案与考点深解' : '👆 Tap card to flip & reveal official rationale'}</span>
              </p>
            </div>
          ) : (
            /* 背面：正确答案与深度解析 */
            <div className="flex-1 flex flex-col justify-center space-y-4 animate-in fade-in duration-300">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'zh' ? '正确答案' : 'Correct Answer'}</span>
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  <span className="text-emerald-400 font-mono mr-1.5">{optionLabels[currentQ.answerIndex]}.</span>
                  {currentQ.options[currentQ.answerIndex]}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'zh' ? '核心考点与原理解析' : 'Key Concept & Rationale'}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>

              <p className="text-center text-xs text-zinc-500 pt-1">
                <span>{lang === 'zh' ? '再次点击翻回正面' : 'Click anywhere to flip back to question'}</span>
              </p>
            </div>
          )}

          {/* 进度条 */}
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 底部导航翻页控制 */}
      <div className="flex items-center justify-between w-full mt-5 px-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-200 text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{lang === 'zh' ? '上一张 (←)' : 'Previous (←)'}</span>
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95 flex items-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? (lang === 'zh' ? '翻看题目' : 'Flip to Front') : (lang === 'zh' ? '翻看解析 (Space)' : 'Flip to Back')}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-200 text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <span>{lang === 'zh' ? '下一张 (→)' : 'Next (→)'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
