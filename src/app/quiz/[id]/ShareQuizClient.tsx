'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  GraduationCap, 
  RotateCcw, 
  Share2, 
  Sparkles, 
  Zap, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  CheckCircle,
  Copy
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

  // 从 URL 参数或服务端还原测验数据（若首屏未直接注入）
  useEffect(() => {
    if (quiz) {
      setStartTime(Date.now());
      saveQuiz(quiz);
      return;
    }

    const compressedParam = searchParams.get('d');
    if (compressedParam) {
      const decompressed = decompressQuizData(compressedParam);
      if (decompressed && decompressed.questions.length > 0) {
        setQuiz(decompressed);
        setIsLoading(false);
        setStartTime(Date.now());
        saveQuiz(decompressed);
        return;
      }
    }

    // 向服务端查询已注册的 shareId
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
  }, [shareId, searchParams, quiz]);

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
    try {
      const { shareUrl } = await createShareableLink(quiz);
      await navigator.clipboard.writeText(shareUrl);
      setToastMsg('Challenge link copied! Send to friends to beat your score.');
      setTimeout(() => setToastMsg(null), 3000);
    } catch {
      setToastMsg('Quiz challenge link ready to share!');
      setTimeout(() => setToastMsg(null), 3000);
    }
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
          href="/#input-hero"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all shadow-md active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>⚡ Turn Your Own Video into a Quiz</span>
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);

  let badgeTitle = 'Proficient';
  let badgeBorder = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  let badgeComment = 'Great understanding! You captured the core concepts effectively.';

  if (scorePercent === 100) {
    badgeTitle = 'Mastery (Flawless 100%)';
    badgeBorder = 'text-amber-300 border-amber-400/50 bg-amber-950/40';
    badgeComment = 'Flawless recall! You have completely mastered this lecture material.';
  } else if (scorePercent >= 80) {
    badgeTitle = 'Advanced Comprehension';
    badgeBorder = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    badgeComment = 'Excellent score! Solid grasp of complex principles.';
  } else if (scorePercent < 60) {
    badgeTitle = 'Developing Learner';
    badgeBorder = 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    badgeComment = 'Good effort! Review the flashcard explanations below to solidify knowledge.';
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6 sm:py-10 space-y-6">
      {/* 复制提示 Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-zinc-950 px-4 py-2.5 rounded-xl font-medium text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 顶栏：来源视频与挑战标签 */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 backdrop-blur-md relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-2">
              <Zap className="w-3 h-3 fill-current" />
              PEER CHALLENGE MODE
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2">
              {quiz.videoTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-2 font-mono">
              <span>{quiz.questions.length} Active-Recall Questions</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" /> ~2 Mins
              </span>
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
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold transition-all border border-amber-400/30 shadow-sm active:scale-95"
            title="Share this challenge"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share Challenge</span>
          </button>
        </div>
      </div>

      {/* 核心未答完模式：答题卡片 */}
      {!isCompleted ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
          {/* 进度条 */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
              <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / quiz.questions.length) * 100)}% Progress</span>
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
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* 选项列表 */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedOption === optIdx;
              const isCorrectAnswer = optIdx === currentQ.answerIndex;

              let btnStyle = 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200';
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
                <span>{currentIndex === quiz.questions.length - 1 ? 'View Final Score & Results' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 答题完成战报卡片与病毒裂变 CTA */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 总得分战报 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/85 p-6 sm:p-8 text-center backdrop-blur-md relative overflow-hidden shadow-xl">
            <div className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-mono font-bold mb-4 border shadow-sm ${badgeBorder}`}>
              <Award className="w-4 h-4 shrink-0" />
              <span>{badgeTitle}</span>
            </div>

            <div className="text-6xl font-extrabold text-white font-mono mb-2 tracking-tight">
              {scorePercent}%
            </div>
            <p className="text-sm text-zinc-300 mb-2 font-mono">
              You scored <strong className="text-amber-300 font-bold">{correctCount}</strong> out of {quiz.questions.length} questions in {elapsedSeconds}s!
            </p>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
              {badgeComment}
            </p>

            {/* 操作栏 */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Challenge Friends / Copy Share Link</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all border border-zinc-700/60"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>

          {/* 全题目深度解析回顾清单 (Review All Explanations) */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-7 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Review All Questions & Explanations</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {correctCount}/{quiz.questions.length} Correct
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {quiz.questions.map((q, idx) => {
                const userAns = userAnswers.find((a) => a.questionId === q.id);
                const isCorrect = userAns ? userAns.isCorrect : false;
                const correctLetter = String.fromCharCode(65 + q.answerIndex);
                const userLetter = userAns !== undefined ? String.fromCharCode(65 + userAns.selectedIndex) : '-';

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2 text-xs sm:text-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold text-white leading-snug">
                        {idx + 1}. {q.question}
                      </span>
                      {userAns !== undefined && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {isCorrect ? '✓ CORRECT' : `✗ YOUR PICK: [${userLetter}]`}
                        </span>
                      )}
                    </div>

                    <div className="text-zinc-400 text-xs">
                      <strong className="text-emerald-400">Correct Answer [{correctLetter}]:</strong> {q.options[q.answerIndex]}
                    </div>

                    <div className="text-zinc-300 text-xs bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/60 leading-relaxed">
                      <span className="text-amber-400/90 font-mono font-bold mr-1.5">EXPLANATION:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 核心考点总结 Takeaways */}
          {quiz.takeaways && quiz.takeaways.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Lecture Key Takeaways</span>
              </h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                {quiz.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ================================================================= */}
          {/* 核心病毒裂变转化盒 (Viral Growth Conversion Box) */}
          {/* ================================================================= */}
          <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/20 via-zinc-900/95 to-zinc-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-3">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>FREE AI QUIZ GENERATOR</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-2">
                ⚡ Turn Your Own YouTube Video into a Quiz
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                Studying for exams, technical interviews, or certifications? Paste any YouTube lecture, podcast, or tutorial link. VideoToQuiz AI instantly extracts high-yield concepts, generates active recall tests, and exports Anki flashcards in 30 seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/#input-hero"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs sm:text-sm font-extrabold transition-all shadow-lg active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>⚡ Create Your Free Quiz (Claim 20 Credits)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Saved Library</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
