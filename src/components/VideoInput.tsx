'use client';

import React, { useState, useRef } from 'react';
import { 
  Youtube, 
  FileText, 
  Sparkles, 
  Loader2, 
  PlayCircle, 
  ArrowRight, 
  X, 
  Coins, 
  UploadCloud,
  FileCheck2,
  FileCode,
  File,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { InputMode } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { parseUploadedDocument, ParsedDocumentResult } from '@/lib/file-parser';

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
  externalMode?: InputMode;
  onExternalModeChange?: (mode: InputMode) => void;
}

export default function VideoInput({
  onGenerate,
  isLoading,
  externalMode,
  onExternalModeChange,
}: VideoInputProps) {
  const { t, lang } = useLanguage();
  const { user, openLoginModal } = useAuth();
  const [internalMode, setInternalMode] = useState<InputMode>('url');
  
  const mode = externalMode !== undefined ? externalMode : internalMode;
  const setMode = (m: InputMode) => {
    setInternalMode(m);
    if (onExternalModeChange) onExternalModeChange(m);
  };
  
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');

  // 文件上传与解析状态
  const [uploadedFile, setUploadedFile] = useState<ParsedDocumentResult | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [fileParseError, setFileParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewText, setShowPreviewText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 自选题量状态 (默认 5 题，支持 5, 10, 20 或自定义)
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [customInputVal, setCustomInputVal] = useState<string>('15');

  const activeQuestionCount = isCustomCount
    ? Math.min(Math.max(parseInt(customInputVal, 10) || 5, 1), 30)
    : questionCount;

  // 处理文件解析
  const handleProcessFile = async (file: File) => {
    setIsParsingFile(true);
    setFileParseError(null);
    try {
      const parsed = await parseUploadedDocument(file);
      setUploadedFile(parsed);
      setTitle(parsed.title);
    } catch (err: any) {
      setFileParseError(err.message || (lang === 'zh' ? '文件读取失败，请检查文件完整性。' : 'Failed to parse file.'));
      setUploadedFile(null);
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setFileParseError(null);
    setShowPreviewText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    } else if (mode === 'file' && uploadedFile) {
      onGenerate({
        mode: 'transcript', // 后端无缝复用 transcript 模式进行 DeepSeek-V3 推理
        transcript: uploadedFile.text,
        title: title.trim() || uploadedFile.title,
        questionCount: activeQuestionCount,
      });
    }
  };

  return (
    <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md relative">
      {/* 模式切换 Tabs (Open-Design 三核切换胶囊) */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800/80 w-fit">
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
          <FileText className={`w-3.5 h-3.5 ${mode === 'transcript' ? 'text-amber-400' : 'text-zinc-400'}`} />
          <span>{t.input.tabTranscript}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            mode === 'file'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <UploadCloud className={`w-3.5 h-3.5 ${mode === 'file' ? 'text-emerald-400' : 'text-zinc-400'}`} />
          <span>{lang === 'zh' ? '上传课件文件' : 'Upload Document'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            NEW
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'url' ? (
          /* 模式 1: 视频链接输入 */
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              {t.input.urlLabel}
            </label>
            <div className="relative flex items-center">
              <input
                type="url"
                placeholder={t.input.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-3.5 pr-10 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-600 transition-all font-mono"
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
        ) : mode === 'transcript' ? (
          /* 模式 2: 讲义文本直贴 */
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
        ) : (
          /* 模式 3: 文件上传与本地解析 (Dropzone) */
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt,.md,.srt,.vtt,.json,.csv"
              className="opacity-0 absolute w-1 h-1 pointer-events-none"
              disabled={isLoading || isParsingFile}
            />

            {!uploadedFile ? (
              /* 上传区域 */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-950/40'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/50 hover:bg-zinc-950/80'
                }`}
              >
                {isParsingFile ? (
                  <div className="flex flex-col items-center space-y-3 py-3">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <div className="text-xs font-semibold text-zinc-200">
                      {lang === 'zh' ? '正在智能提取课件文本内容...' : 'Extracting text content from document...'}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {lang === 'zh' ? '纯本地内存解析 · 隐私安全' : '100% Client-side local parsing · Privacy first'}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 py-2">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/30 transition-all shadow-sm">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                        {lang === 'zh' ? '点击或将课件讲义拖拽至此处' : 'Click or drag lecture files here'}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                        Supports PDF, Word (.docx), TXT, Markdown, SRT/VTT subtitles
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-500 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-800">
                      🔒 {lang === 'zh' ? '零云端转储 · 100% 浏览器本地安全解析' : 'Zero-server upload · Local in-browser processing'}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 文件解析就绪卡片 */
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
                        {uploadedFile.fileName}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 mt-1 font-mono">
                        <span className="text-emerald-400 font-semibold">{uploadedFile.wordCount.toLocaleString()} words</span>
                        <span>•</span>
                        <span>{uploadedFile.fileSizeFormatted}</span>
                        {uploadedFile.isTruncated && (
                          <span className="text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                            {lang === 'zh' ? '超长截取前4万字' : 'Truncated to 40k chars'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all shrink-0"
                    title={lang === 'zh' ? '移除并重新上传' : 'Remove and upload another'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 测验标题自适应输入框 */}
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    {lang === 'zh' ? '测验主题 / 试卷标题 (自动识别自文件名)' : 'Quiz Title / Subject (Auto-detected)'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-all"
                  />
                </div>

                {/* 文本片段折叠预览 */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPreviewText(!showPreviewText)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 font-mono"
                  >
                    {showPreviewText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPreviewText ? (lang === 'zh' ? '收起提取文本预览' : 'Hide extracted text preview') : (lang === 'zh' ? '查看已提取文本预览' : 'View extracted text preview')}</span>
                  </button>

                  {showPreviewText && (
                    <div className="mt-2 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 max-h-36 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed select-text">
                      {uploadedFile.text.slice(0, 1500)}
                      {uploadedFile.text.length > 1500 && '... [truncated for preview]'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 文件解析报错提示 */}
            {fileParseError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileParseError}</span>
              </div>
            )}
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
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {lang === 'zh' ? '自定义题量' : 'Custom'}
            </button>

            {isCustomCount && (
              <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={customInputVal}
                  onChange={(e) => setCustomInputVal(e.target.value)}
                  className="w-16 px-2.5 py-1 bg-zinc-900 border border-amber-500/50 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  placeholder="5-30"
                />
                <span className="text-xs text-zinc-400">{lang === 'zh' ? '道题 (最多30)' : 'Questions (max 30)'}</span>
              </div>
            )}
          </div>
        </div>

        {/* 提交按钮与福利导流 */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={
              isLoading || 
              isParsingFile || 
              (mode === 'url' && !url.trim()) || 
              (mode === 'transcript' && !transcript.trim()) || 
              (mode === 'file' && !uploadedFile)
            }
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span className="text-zinc-950 font-extrabold">
                  {lang === 'zh'
                    ? `智能推理中，正在生成 ${activeQuestionCount} 道考题...`
                    : `Reasoning in progress, generating ${activeQuestionCount} questions...`}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-zinc-950 fill-current" />
                <span className="font-extrabold">
                  {lang === 'zh'
                    ? `立即生成 ${activeQuestionCount} 题互动测验卷`
                    : `Generate ${activeQuestionCount}-Question Interactive Quiz`}
                </span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </>
            )}
          </button>

          {/* 未登录用户的友好福利提示 */}
          {!user && (
            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-zinc-400">
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
      <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2 text-xs">
        <div className="flex items-center justify-between text-zinc-300">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'zh' ? '或点击 1 秒试玩样卷 (免登录 · 零积分消耗)' : 'Or try 1-click interactive demo quizzes (Instant · 0 Credits)'}</span>
          </span>
          <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">Active Recall Demo</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              const sampleUrl = 'https://www.youtube.com/watch?v=8mAITcNt710';
              setUrl(sampleUrl);
              setMode('url');
              onGenerate({ mode: 'url', sampleKey: 'cs50', url: sampleUrl, questionCount: 5 });
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white transition-all shadow-sm font-medium"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Harvard CS50</span>
            <span className="text-[10px] text-emerald-400/90 bg-emerald-500/10 px-1 py-0.5 rounded font-mono">
              Python
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const sampleUrl = 'https://www.youtube.com/watch?v=BvJvJ1g4sD4';
              setUrl(sampleUrl);
              setMode('url');
              onGenerate({ mode: 'url', sampleKey: 'ninja_nerd', url: sampleUrl, questionCount: 5 });
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-300 hover:text-white transition-all shadow-sm font-medium"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ninja Nerd</span>
            <span className="text-[10px] text-emerald-400/90 bg-emerald-500/10 px-1 py-0.5 rounded font-mono">
              Medicine / USMLE
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const sampleUrl = 'https://www.youtube.com/watch?v=nm1TxQj9IsQ';
              setUrl(sampleUrl);
              setMode('url');
              onGenerate({ mode: 'url', sampleKey: 'huberman', url: sampleUrl, questionCount: 5 });
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white transition-all shadow-sm font-medium"
          >
            <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Huberman Lab</span>
            <span className="text-[10px] text-indigo-400/90 bg-indigo-500/10 px-1 py-0.5 rounded font-mono">
              Sleep & Focus
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const sampleUrl = 'https://www.youtube.com/watch?v=2v6E8ZgH9Jk';
              setUrl(sampleUrl);
              setMode('url');
              onGenerate({ mode: 'url', sampleKey: 'cfa', url: sampleUrl, questionCount: 5 });
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white transition-all shadow-sm font-medium"
          >
            <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>CFA Prep</span>
            <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-1 py-0.5 rounded font-mono">
              Finance
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
