'use client';

import React, { useState } from 'react';
import { CheckCircle2, Share2 } from 'lucide-react';
import VideoInput from '@/components/VideoInput';
import QuizCard from '@/components/QuizCard';
import QuizResult from '@/components/QuizResult';
import PosterModal from '@/components/PosterModal';
import PricingModal from '@/components/PricingModal';
import { QuizResultData, UserAnswerRecord, QuizScoreSummary, InputMode } from '@/lib/types';
import { SAMPLE_QUIZZES } from '@/lib/sample-quizzes';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { saveQuiz, updateQuizScore } from '@/lib/quiz-storage';
import { createShareableLink } from '@/lib/quiz-share';

export default function InteractiveQuizSection() {
  const { t, lang } = useLanguage();
  const { user, openLoginModal, refreshUser, openPricingModal } = useAuth();
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizResultData | null>(null);
  const [isSample, setIsSample] = useState(false);

  // 答题状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // 弹窗状态
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [currentScoreSummary, setCurrentScoreSummary] = useState<QuizScoreSummary | null>(null);

  // 发起测验生成
  const handleGenerate = async (params: {
    mode: InputMode;
    url?: string;
    transcript?: string;
    title?: string;
    sampleKey?: string;
    questionCount?: number;
  }) => {
    setIsLoading(true);
    setErrorMsg(null);
    setQuizData(null);
    setIsQuizCompleted(false);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);

    try {
      // 官方精选样例：全免费开放
      if (params.sampleKey && SAMPLE_QUIZZES[params.sampleKey]) {
        setIsSample(true);
        setQuizData(SAMPLE_QUIZZES[params.sampleKey]);
        setQuizStartTime(Date.now());
        setIsLoading(false);
        setTimeout(() => {
          document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }

      // 未登录拦截并友好引导
      if (!user) {
        openLoginModal();
        setIsLoading(false);
        return;
      }

      setIsSample(false);
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.requiresLogin) {
          openLoginModal();
          setErrorMsg(json.error || (lang === 'zh' ? '请先登录 Google 账户以领取 20 免费积分' : 'Please sign in to claim 20 free credits'));
        } else if (json.insufficientCredits) {
          openPricingModal();
          setErrorMsg(
            lang === 'zh'
              ? `积分不足 (当前余额: ${json.currentCredits} 点，本次需: ${json.requiredCredits} 点)，请充值加油包或精简题量。`
              : `Insufficient credits (${json.currentCredits} remaining, ${json.requiredCredits} required). Please top up or decrease question count.`
          );
        } else if (json.needsTranscriptFallback) {
          setErrorMsg(json.error);
        } else {
          setErrorMsg(json.error || 'Failed to generate quiz from video.');
        }
        return;
      }

      setQuizData(json.data);
      setQuizStartTime(Date.now());
      // 自动归档至用户历史测验库
      saveQuiz(json.data, params.url);
      // 刷新用户最新积分余额
      await refreshUser();

      setTimeout(() => {
        document.getElementById('quiz-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network communication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 用户点击选项
  const handleAnswer = (record: UserAnswerRecord) => {
    setUserAnswers((prev) => [...prev.filter((a) => a.questionId !== record.questionId), record]);
  };

  // 下一题 / 查看战报
  const handleNext = () => {
    if (!quizData) return;
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const elapsed = Math.max(15, Math.round((Date.now() - quizStartTime) / 1000));
      setTimeSpentSeconds(elapsed);
      setIsQuizCompleted(true);
      // 记录本次答题战报得分
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const quizId = quizData.videoId ? `quiz_${quizData.videoId}` : 'quiz_default';
      updateQuizScore(quizId, correctCount, quizData.questions.length);
    }
  };

  // 重新开始
  const handleRestart = () => {
    setQuizData(null);
    setIsQuizCompleted(false);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setErrorMsg(null);
    setIsSample(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [shareToast, setShareToast] = useState<string | null>(null);

  // 快捷分享测验
  const handleShareQuiz = async () => {
    if (!quizData) return;
    try {
      const { shareId } = await createShareableLink(quizData);
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const shareUrl = isLocal ? `${window.location.origin}/quiz/${shareId}` : `https://www.videotoquiz.com/quiz/${shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareToast(
        lang === 'zh'
          ? `测验挑战链接已复制 (${shareUrl})！可直接发送给好友一起做题 PK`
          : `Challenge link copied (${shareUrl})! Send to friends to challenge them.`
      );
      setTimeout(() => setShareToast(null), 4000);
    } catch (e) {
      setShareToast(lang === 'zh' ? '正在生成分享链接...' : 'Generating share link...');
      setTimeout(() => setShareToast(null), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* 复制成功浮动提示 */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-zinc-950 px-4 py-2.5 rounded-xl font-medium text-xs shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{shareToast}</span>
        </div>
      )}
      {/* 核心亮点标签 */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-300 font-medium mb-8">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.hero.feature1}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.hero.feature2}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.hero.feature3}</span>
        </span>
      </div>

      {/* 核心输入与出题区域 (携带 input-hero 锚点，便于病毒裂变回流直通聚焦) */}
      <section id="input-hero" className="w-full max-w-2xl mx-auto mb-10 scroll-mt-24">
        <VideoInput
          externalMode={inputMode}
          onExternalModeChange={setInputMode}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {/* 错误提示横幅与智能化补救指引 */}
        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs sm:text-sm leading-relaxed space-y-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-rose-100">{errorMsg}</p>
                
                {/* 当属于字幕提取限制问题时，提供一键切换与3秒复制指引 */}
                {(errorMsg.toLowerCase().includes('transcript') ||
                  errorMsg.toLowerCase().includes('caption') ||
                  errorMsg.includes('字幕')) && (
                  <div className="mt-3 pt-3 border-t border-rose-800/60 space-y-2.5">
                    <p className="text-zinc-300 text-xs leading-normal">
                      💡 <strong>快速通杀方案</strong>：YouTube 网页端原生提供了文字记录。您只需复制讲义或字幕文本粘贴进来，DeepSeek 即可直接提炼知识点生成测验：
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setInputMode('transcript');
                          setErrorMsg(null);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <span>⚡ 一键切换到【粘贴讲义 / 文本出题】</span>
                      </button>
                    </div>

                    <details className="text-[11px] text-zinc-400 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80 cursor-pointer">
                      <summary className="font-medium text-zinc-300 hover:text-white">
                        👉 如何在 YouTube 3 秒复制文字记录？（展开查看）
                      </summary>
                      <ol className="list-decimal list-inside space-y-1 mt-2 text-zinc-400 pl-1 leading-relaxed">
                        <li>在 YouTube 播放器下方点击右侧「...」（更多）按钮；</li>
                        <li>点击「显示文字记录」(Show transcript)；</li>
                        <li>在右侧展开的面板中全选复制文本，粘贴到上方输入框即可出题！</li>
                      </ol>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 答题锚点与做题区域 */}
      <div id="quiz-anchor" className="w-full max-w-2xl mx-auto mb-16 scroll-mt-24">
        {quizData && !isQuizCompleted && (
          <div className="space-y-4 animate-fadeIn">
            <div className="px-1 flex items-center justify-between text-xs text-zinc-300">
              <span className="font-bold text-sm text-zinc-100 truncate max-w-xs sm:max-w-md">
                {quizData.videoTitle}
              </span>
              <div className="flex items-center gap-2">
                {isSample && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-sm">
                    {t.quiz.sampleBadge}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleShareQuiz}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95 border border-amber-300"
                  title="Challenge Friends / Copy Share Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? '⚡ 挑战好友 / 分享' : '⚡ Challenge Friends / Copy Link'}</span>
                </button>
              </div>
            </div>
            <QuizCard
              key={quizData.questions[currentQuestionIndex].id}
              question={quizData.questions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={quizData.questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
              isLast={currentQuestionIndex === quizData.questions.length - 1}
              isLocked={false}
              onOpenPricing={() => openPricingModal()}
            />
          </div>
        )}

        {/* 战报完成区域 */}
        {quizData && isQuizCompleted && (
          <div className="animate-fadeIn">
            <QuizResult
              quizData={quizData}
              answers={userAnswers}
              timeSpentSeconds={timeSpentSeconds}
              onRestart={handleRestart}
              onOpenPoster={(summary) => {
                setCurrentScoreSummary(summary);
                setIsPosterOpen(true);
              }}
              onOpenPricing={() => openPricingModal()}
              isSample={isSample}
            />
          </div>
        )}
      </div>

      {/* 海报证书弹窗 */}
      <PosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        videoTitle={quizData?.videoTitle || 'Educational Video Lecture'}
        summary={currentScoreSummary}
      />
    </div>
  );
}
