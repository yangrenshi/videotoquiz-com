'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  GraduationCap, 
  RotateCcw, 
  Share2, 
  Sparkles, 
  Zap, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { QuizResultData, UserAnswerRecord } from '@/lib/types';
import { decompressQuizData, createShareableLink } from '@/lib/quiz-share';
import { saveQuiz } from '@/lib/quiz-storage';

interface ShareQuizClientProps {
  shareId: string;
  initialQuiz?: QuizResultData | null;
}

export default function ShareQuizClient({ shareId, initialQuiz }: ShareQuizClientProps) {
  const searchParams = useSearchParams();
  const [quiz, setQuiz] = useState<QuizResultData | null>(initialQuiz || null);
  const [isLoading, setIsLoading] = useState(!initialQuiz);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 答题状态
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // 复制提示
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 从 URL 参数或服务端还原测验数据
  useEffect(() => {
    if (quiz) {
      setStartTime(Date.now());
      return;
    }

    const compressedParam = searchParams.get('d');
    if (compressedParam) {
      const decompressed = decompressQuizData(compressedParam);
      if (decompressed && decompressed.questions.length > 0) {
        setQuiz(decompressed);
        setIsLoading(false);
        setStartTime(Date.now());
        // 自动将收到的优质测验同步归档到访客的个人中心库
        saveQuiz(decompressed);
        return;
      }
    }

    // 尝试向服务端查询
    fetch(`/api/quiz/share?id=${encodeURIComponent(shareId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.quiz) {
          setQuiz(data.quiz);
          saveQuiz(data.quiz);
          setStartTime(Date.now());
        } else {
          setLoadError('The requested quiz could not be loaded or has expired.');
        }
      })
      .catch(() => {
        setLoadError('Failed to load shared quiz. Please verify the URL.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [shareId, searchParams]);

  // 选择选项
  const handleSelectOption = (idx: number) => {
    if (hasSubmittedCurrent) return;
    setSelectedOption(idx);
    setHasSubmittedCurrent(true);

    if (!quiz) return;
    const currentQ = quiz.questions[currentIndex];
    const isCorrect = idx === currentQ.answerIndex;
    setUserAnswers((prev) => [
      ...prev.filter((a) => a.questionId !== currentQ.id),
      { questionId: currentQ.id, selectedIndex: idx, isCorrect },
    ]);
  };

  // 下一题 / 结束
  const handleNext = () => {
    if (!quiz) return;
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmittedCurrent(false);
    } else {
      setElapsedSeconds(Math.max(10, Math.round((Date.now() - startTime) / 1000)));
      setIsCompleted(true);
    }
  };

  // 重新作答
  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setHasSubmittedCurrent(false);
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  // 复制分享链接
  const handleCopyShare = async () => {
    if (!quiz) return;
    const { shareUrl } = await createShareableLink(quiz);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setToastMsg('Challenge link copied to clipboard!');
      setTimeout(() => setToastMsg(null), 3000);
    }).catch(() => {
      setToastMsg('Link: ' + shareUrl);
      setTimeout(() => setToastMsg(null), 4000);
    });
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 animate-pulse mb-4">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Loading Shared Quiz...</h2>
        <p className="text-xs text-zinc-400 font-mono">Preparing active recall questions and explanations</p>
      </div>
    );
  }

  // 报错状态
  if (loadError || !quiz) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Quiz Not Found</h2>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          {loadError || 'This shared quiz link may be broken or parameters are missing.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all shadow-md active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Create Your Own Quiz</span>
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 sm:py-10 space-y-6">
      {/* 提示吐司 */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-zinc-950 px-4 py-2.5 rounded-xl font-medium text-xs shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 顶栏：来源视频与挑战标签 */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-2">
              <Zap className="w-3 h-3 fill-current" />
              PEER CHALLENGE MODE
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2">
              {quiz.videoTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-2 font-mono">
              <span>{quiz.questions.length} Questions</span>
              <span>•</span>
              <span>Active Recall Testing</span>
              {quiz.videoId && (
                <>
                  <span>•</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${quiz.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Watch Source Video</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyShare}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all border border-zinc-700/60"
            title="Share this challenge"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 核心未答完模式：答题卡片 */}
      {!isCompleted ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
          {/* 进度条 */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
              <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 题目正文 */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* 选项列表 */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedOption === optIdx;
              const isCorrectAnswer = optIdx === currentQ.answerIndex;

              let btnStyle = 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-200';
              if (hasSubmittedCurrent) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500/40';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'border-rose-500/60 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500/40';
                } else {
                  btnStyle = 'border-zinc-800/60 bg-zinc-950/30 text-zinc-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={hasSubmittedCurrent}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all text-xs sm:text-sm leading-relaxed ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {letter}
                  </span>
                  <span className="flex-1">{optionText}</span>
                </button>
              );
            })}
          </div>

          {/* 选项提交后：解析展开 */}
          {hasSubmittedCurrent && (
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs sm:text-sm space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold font-mono">
                {selectedOption === currentQ.answerIndex ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Incorrect Choice
                  </span>
                )}
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400 font-normal">
                  Answer: [{String.fromCharCode(65 + currentQ.answerIndex)}]
                </span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-xs">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* 底部下一题按钮 */}
          {hasSubmittedCurrent && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>{currentIndex === quiz.questions.length - 1 ? 'View Final Results' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 答题完成战报卡片与病毒裂变 CTA */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 text-center backdrop-blur-md relative overflow-hidden shadow-xl">
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-mono font-bold mb-4 border bg-amber-400/10 text-amber-300 border-amber-400/30">
              <Award className="w-4 h-4" />
              CHALLENGE COMPLETED
            </div>

            <div className="text-6xl font-extrabold text-white font-mono mb-2 tracking-tight">
              {scorePercent}%
            </div>
            <p className="text-sm text-zinc-300 mb-6 font-mono">
              You got <strong className="text-amber-300 font-bold">{correctCount}</strong> out of {quiz.questions.length} questions correct in {elapsedSeconds}s!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all border border-zinc-700/60"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all border border-zinc-700/60"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share with Friends</span>
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 核心病毒裂变转化盒 (Viral Growth Conversion Box) */}
          {/* ================================================================= */}
          <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>TURN ANY YOUTUBE VIDEO INTO A QUIZ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                Want to create a custom quiz for your own exams or study group?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                Paste any YouTube lecture, podcast or tutorial URL. VideoToQuiz AI automatically extracts key concepts, generates active-recall questions, and exports to Anki in 30 seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs sm:text-sm font-extrabold transition-all shadow-lg active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate Your Quiz Free (20 Credits)</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Go to My Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
