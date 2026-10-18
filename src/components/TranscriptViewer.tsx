'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Sparkles, X, BookOpen, Clock } from 'lucide-react';
import { TranscriptResultData } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface TranscriptViewerProps {
  data: TranscriptResultData | null;
  onGenerateQuiz: (transcript: string, title: string, questionCount: number) => void;
  onClose: () => void;
  isLoadingQuiz: boolean;
}

export default function TranscriptViewer({
  data,
  onGenerateQuiz,
  onClose,
  isLoadingQuiz,
}: TranscriptViewerProps) {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  // 自选题量状态 (默认 5 题，支持 5, 10, 20 或自定义，最高 30 题)
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [customInputVal, setCustomInputVal] = useState<string>('15');

  const activeQuestionCount = isCustomCount
    ? Math.min(Math.max(parseInt(customInputVal, 10) || 5, 1), 30)
    : questionCount;

  if (!data) return null;

  // 1 键复制全文
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // 下载纯文本 TXT
  const handleDownloadTxt = () => {
    const blob = new Blob([`${data.title}\n\n${data.transcript}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/[^\w\s-]/gi, '').slice(0, 40) || 'video-transcript'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md relative animate-fadeIn mb-8">
      {/* 顶部标题与元数据 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              {t.transcriptViewer.title}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-2">
            {data.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span>{data.wordCount.toLocaleString()} {t.transcriptViewer.words}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>~{data.estimatedReadingTimeMinutes} {t.transcriptViewer.minRead}</span>
            </span>
          </div>
        </div>

        {/* 快捷操作按键组 */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">{t.transcriptViewer.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t.transcriptViewer.copyAll}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.transcriptViewer.downloadTxt}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            title={t.transcriptViewer.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 文本阅读滚动区 (Open-Design 高清易读排版) */}
      <div className="w-full max-h-96 overflow-y-auto rounded-xl bg-zinc-950 p-4 sm:p-5 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans select-text shadow-inner">
        <p className="whitespace-pre-line">
          {data.transcript}
        </p>
      </div>

      {/* 底部高转化引导条：支持自选题量并一键从讲义生成测验题 */}
      <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
        {/* 题量选择行 */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-zinc-800/60 text-xs">
          <div className="flex items-center gap-2 text-zinc-300 font-medium">
            <span>🎯 {lang === 'zh' ? '测验题量：' : 'Question Count:'}</span>
            <div className="flex items-center gap-1.5">
              {[5, 10, 20].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    setQuestionCount(cnt);
                    setIsCustomCount(false);
                  }}
                  disabled={isLoadingQuiz}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    !isCustomCount && questionCount === cnt
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cnt} {lang === 'zh' ? '题' : 'Q'}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomCount(true)}
                disabled={isLoadingQuiz}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  isCustomCount
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {lang === 'zh' ? '自定义' : 'Custom'}
              </button>

              {isCustomCount && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={customInputVal}
                    onChange={(e) => setCustomInputVal(e.target.value)}
                    className="w-14 px-1.5 py-0.5 bg-zinc-900 border border-amber-500/50 rounded-md text-xs font-mono text-center text-amber-300 focus:outline-none"
                    disabled={isLoadingQuiz}
                  />
                  <span className="text-[11px] text-zinc-500">{lang === 'zh' ? '题(≤30)' : 'max 30'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
            <span>🪙 {lang === 'zh' ? `需消耗 ${activeQuestionCount} 积分` : `Requires ${activeQuestionCount} credits`}</span>
          </div>
        </div>

        {/* 触发生成按钮行 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 font-medium leading-relaxed">
            💡 {lang === 'zh' ? '讲义阅读完毕？测一测大脑对核心知识点的记忆与理解度：' : 'Finished reading? Test your understanding of key takeaways:'}
          </div>

          <button
            type="button"
            disabled={isLoadingQuiz}
            onClick={() => onGenerateQuiz(data.transcript, data.title, activeQuestionCount)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-zinc-200 text-zinc-950 shadow-md active:scale-95 disabled:opacity-50 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {lang === 'zh'
                ? `立即生成 ${activeQuestionCount} 题核心测验卷`
                : `Generate ${activeQuestionCount}-Question Quiz`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
