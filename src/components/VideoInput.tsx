'use client';

import React, { useState } from 'react';
import { Youtube, FileText, Sparkles, Loader2, PlayCircle, ArrowRight, X, Coins, HelpCircle } from 'lucide-react';
import { InputMode } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import GeneratingProgress from './GeneratingProgress';

interface VideoInputProps {
  onGenerate: (data: {
    mode: InputMode;
    url?: string;
    transcript?: string;
    title?: string;
    sampleKey?: string;
    questionCount?: number;
  }) => void;
  isLoading: boolean;
  onExtractTranscript?: (url: string) => void;
  isExtractingTranscript?: boolean;
}

export default function VideoInput({
  onGenerate,
  isLoading,
  onExtractTranscript,
  isExtractingTranscript = false,
}: VideoInputProps) {
  const { t, lang } = useLanguage();
  const { user, openLoginModal } = useAuth();
  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  
  // 自选题量状态 (默认 5 题，支持 5, 10, 20 或自定义)
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [customInputVal, setCustomInputVal] = useState<string>('15');

  const activeQuestionCount = isCustomCount
    ? Math.min(Math.max(parseInt(customInputVal, 10) || 5, 1), 30)
    : questionCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'url' && url.trim()) {
      onGenerate({ mode: 'url', url: url.trim(), questionCount: activeQuestionCount });
    } else if (mode === 'transcript' && transcript.trim()) {
      onGenerate({
        mode: 'transcript',
        transcript: transcript.trim(),
        title: title.trim(),
        questionCount: activeQuestionCount,
      });
    }
  };

  return (
    <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md relative">
      {/* 模式切换 Tabs (Open-Design 极简按键胶囊) */}
      <div className="flex items-center gap-1.5 mb-5 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800/80 w-fit">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'url'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Youtube className={`w-3.5 h-3.5 ${mode === 'url' ? 'text-red-400' : 'text-zinc-400'}`} />
          <span>{t.input.tabUrl}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('transcript')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'transcript'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${mode === 'transcript' ? 'text-emerald-400' : 'text-zinc-400'}`} />
          <span>{t.input.tabTranscript}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'url' ? (
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              {t.input.urlLabel}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={t.input.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-12 px-4 pr-10 bg-zinc-950 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all font-sans leading-normal shadow-inner"
                disabled={isLoading}
              />
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-3 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                {t.input.titleLabel}
              </label>
              <input
                type="text"
                placeholder={t.input.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                {t.input.transcriptLabel}
              </label>
              <textarea
                rows={5}
                placeholder={t.input.transcriptPlaceholder}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full px-3.5 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600 transition-all font-mono resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* 题目数量选择器 (自由自选 & 积分透明扣费) */}
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <span>{lang === 'zh' ? '自选考题数量' : 'Target Question Count'}</span>
              <span className="text-[10px] text-zinc-500 font-normal">
                ({lang === 'zh' ? '1 题 = 1 积分' : '1 Question = 1 Credit'})
              </span>
            </span>

            {/* 当前消耗预估 */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400">{lang === 'zh' ? '需消耗' : 'Costs'}:</span>
              <span className="text-amber-400 font-bold">{activeQuestionCount}</span>
              <span className="text-zinc-500">{lang === 'zh' ? '积分' : 'pts'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[5, 10, 20].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => {
                  setQuestionCount(cnt);
                  setIsCustomCount(false);
                }}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  !isCustomCount && questionCount === cnt
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cnt} {lang === 'zh' ? '题' : 'Q'}
              </button>
            ))}

            {/* 自定义题量按钮 */}
            <button
              type="button"
              onClick={() => setIsCustomCount(true)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                isCustomCount
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {lang === 'zh' ? '自定义题量' : 'Custom'}
            </button>

            {isCustomCount && (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={customInputVal}
                  onChange={(e) => setCustomInputVal(e.target.value)}
                  className="w-16 px-2 py-1 bg-zinc-900 border border-amber-500/50 rounded-lg text-xs font-mono text-center text-amber-300 focus:outline-none"
                  disabled={isLoading}
                />
                <span className="text-xs text-zinc-500">{lang === 'zh' ? '道 (上限30)' : 'max 30'}</span>
              </div>
            )}
          </div>
        </div>

        {/* 正在生成时的精美进度动画条 */}
        {isLoading && (
          <div className="animate-fade-in pt-1">
            <GeneratingProgress totalQuestions={activeQuestionCount} />
          </div>
        )}

        {/* 提交按钮与字幕提取按钮 */}
        <div className="space-y-2.5">
          <button
            type="submit"
            disabled={isLoading || isExtractingTranscript || (mode === 'url' ? !url.trim() : !transcript.trim())}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-white hover:bg-zinc-200 text-zinc-950 shadow-md active:scale-[0.99] disabled:bg-zinc-800/90 disabled:text-zinc-400 disabled:border disabled:border-zinc-700/60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span className="text-zinc-300">
                  {lang === 'zh'
                    ? `智能推理中，正在生成 ${activeQuestionCount} 道考题...`
                    : `Reasoning in progress, generating ${activeQuestionCount} questions...`}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {lang === 'zh'
                    ? `立即生成 ${activeQuestionCount} 题互动测验卷`
                    : `Generate ${activeQuestionCount}-Question Interactive Quiz`}
                </span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </>
            )}
          </button>

          {/* 模式为 URL 时，提供免费提取讲义与字幕入口 (0费用 / 极速导出) */}
          {mode === 'url' && (
            <button
              type="button"
              onClick={() => onExtractTranscript?.(url.trim())}
              disabled={isLoading || isExtractingTranscript || !url.trim()}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm bg-zinc-950 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {isExtractingTranscript ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span className="text-emerald-300">{t.transcriptViewer.extracting}</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.transcriptViewer.btnExtract}</span>
                </>
              )}
            </button>
          )}

          {/* 未登录用户的友好福利提示 */}
          {!user && (
            <div className="flex items-center justify-center gap-2 pt-1 text-xs text-zinc-400">
              <span className="text-amber-400">🎁</span>
              <span>
                {lang === 'zh'
                  ? '新用户首登赠送 20 免费试用积分'
                  : 'New users receive 20 free trial credits on sign-in'}
              </span>
              <button
                type="button"
                onClick={openLoginModal}
                className="underline text-amber-400 hover:text-amber-300 font-medium"
              >
                {lang === 'zh' ? '去登录领积分' : 'Sign in to claim'}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* 快速体验官方免消耗样卷 (零等待试玩，不扣积分) */}
      <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-2.5 text-xs text-zinc-300">
        <span className="font-semibold text-zinc-300">{t.input.sampleLabel}</span>
        <button
          type="button"
          onClick={() => {
            const sampleUrl = 'https://www.youtube.com/watch?v=8mAITcNt710';
            setUrl(sampleUrl);
            onGenerate({ mode: 'url', sampleKey: 'cs50', url: sampleUrl, questionCount: 5 });
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition-colors shadow-sm font-medium"
        >
          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.input.sampleCs50}</span>
          <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1 rounded">
            {lang === 'zh' ? '免积分' : 'Free'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            const sampleUrl = 'https://www.youtube.com/watch?v=iCvmsMzlF7o';
            setUrl(sampleUrl);
            onGenerate({ mode: 'url', sampleKey: 'psychology', url: sampleUrl, questionCount: 5 });
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition-colors shadow-sm font-medium"
        >
          <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.input.samplePsychology}</span>
          <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1 rounded">
            {lang === 'zh' ? '免积分' : 'Free'}
          </span>
        </button>
      </div>
    </div>
  );
}
