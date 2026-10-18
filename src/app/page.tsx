'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, FileText, Lightbulb } from 'lucide-react';
import VideoInput from '@/components/VideoInput';
import TranscriptViewer from '@/components/TranscriptViewer';
import QuizCard from '@/components/QuizCard';
import QuizResult from '@/components/QuizResult';
import PosterModal from '@/components/PosterModal';
import PricingModal from '@/components/PricingModal';
import ComparisonTable from '@/components/ComparisonTable';
import FaqSection from '@/components/FaqSection';
import { QuizResultData, UserAnswerRecord, QuizScoreSummary, InputMode, TranscriptResultData } from '@/lib/types';
import { SAMPLE_QUIZZES } from '@/lib/sample-quizzes';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { user, openLoginModal, refreshUser } = useAuth();
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingTranscript, setIsExtractingTranscript] = useState(false);
  const [transcriptData, setTranscriptData] = useState<TranscriptResultData | null>(null);
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
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // 纯免费提取视频讲义与完整字幕 (0费用 / 零等待)
  const handleExtractTranscript = async (url: string) => {
    setIsExtractingTranscript(true);
    setErrorMsg(null);
    setTranscriptData(null);

    try {
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error || t.transcriptViewer.noCaptionsTip);
        return;
      }

      setTranscriptData(json);
      setTimeout(() => {
        document.getElementById('transcript-anchor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error extracting transcript.');
    } finally {
      setIsExtractingTranscript(false);
    }
  };

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
          setIsPricingOpen(true);
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

  // 是否处于锁定状态：官方样例 100% 全免费；对于自定义扣积分生成的完整试卷，用户已支付积分，因此直接畅享全部题目！
  const isCurrentQuestionLocked = false;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 头部 Hero 区域 (Open-Design 纯粹克制排版) */}
      <section className="text-center max-w-3xl mx-auto pt-6 pb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-5">
          {t.hero.titleLine1}{' '}
          <span className="text-amber-400">
            {t.hero.titleHighlight}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          {t.hero.subtitle}
        </p>

        {/* 核心亮点标签 */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-300 font-medium">
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
      </section>

      {/* 核心输入与出题区域 */}
      <section className="w-full max-w-2xl mx-auto mb-10">
        <VideoInput
          externalMode={inputMode}
          onExternalModeChange={setInputMode}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onExtractTranscript={handleExtractTranscript}
          isExtractingTranscript={isExtractingTranscript}
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

      {/* 字幕与讲义查看器锚点 */}
      <div id="transcript-anchor" className="w-full max-w-3xl mx-auto scroll-mt-24">
        {transcriptData && (
          <TranscriptViewer
            data={transcriptData}
            onGenerateQuiz={(text, title) => handleGenerate({ mode: 'transcript', transcript: text, title, questionCount: 5 })}
            onClose={() => setTranscriptData(null)}
            isLoadingQuiz={isLoading}
          />
        )}
      </div>

      {/* 答题锚点与做题区域 */}
      <div id="quiz-anchor" className="w-full max-w-2xl mx-auto mb-16 scroll-mt-24">
        {quizData && !isQuizCompleted && (
          <div className="space-y-4 animate-fadeIn">
            <div className="px-1 flex items-center justify-between text-xs text-zinc-300">
              <span className="font-bold text-sm text-zinc-100 truncate max-w-md">
                {quizData.videoTitle}
              </span>
              {isSample && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-sm">
                  {t.quiz.sampleBadge}
                </span>
              )}
            </div>
            <QuizCard
              key={quizData.questions[currentQuestionIndex].id}
              question={quizData.questions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={quizData.questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
              isLast={currentQuestionIndex === quizData.questions.length - 1}
              isLocked={isCurrentQuestionLocked}
              onOpenPricing={() => setIsPricingOpen(true)}
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
              onOpenPricing={() => setIsPricingOpen(true)}
              isSample={isSample}
            />
          </div>
        )}
      </div>

      {/* Q-A-D-L 竞品对比表 (GEO优化) */}
      <ComparisonTable />

      {/* FAQ 问答矩阵 (结构化数据) */}
      <FaqSection />

      {/* 海报证书弹窗 */}
      <PosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        videoTitle={quizData?.videoTitle || 'Educational Video Lecture'}
        summary={currentScoreSummary}
      />

      {/* 双轨收费弹窗 */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />
    </div>
  );
}
