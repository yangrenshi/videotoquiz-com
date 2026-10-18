'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GeneratingProgressProps {
  totalQuestions: number;
}

export default function GeneratingProgress({ totalQuestions }: GeneratingProgressProps) {
  const { lang } = useLanguage();
  const [progress, setProgress] = useState(5);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // 阶段定义
  const steps = [
    {
      pct: 20,
      zh: '正在连接公开视频源并解析字幕文本...',
      en: 'Connecting to video source and extracting academic transcript...',
    },
    {
      pct: 45,
      zh: '深度解析讲座知识图谱与核心教学逻辑...',
      en: 'Synthesizing lecture thesis, key concepts, and mental models...',
    },
    {
      pct: 75,
      zh: `正在逐题拟定高质量单选题与核心解析 (1 ~ ${totalQuestions} 题)...`,
      en: `Crafting high-yield questions and pedagogical rationales (1 ~ ${totalQuestions})...`,
    },
    {
      pct: 95,
      zh: '正在校验学术信度并排版结构化互动试卷...',
      en: 'Validating answer keys and formatting interactive paper...',
    },
  ];

  // 平滑模拟进度增长
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) {
          return 96; // 维持在 96% 等待后端返回
        }
        // 动态递增
        const increment = prev < 40 ? 4 : prev < 70 ? 2.5 : 1.2;
        const next = Math.min(prev + increment, 96);

        // 更新步骤索引
        if (next < 25) setCurrentStepIndex(0);
        else if (next < 55) setCurrentStepIndex(1);
        else if (next < 85) setCurrentStepIndex(2);
        else setCurrentStepIndex(3);

        return next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [totalQuestions]);

  // 计算当前题数预估
  const estimatedGeneratedCount = Math.min(
    Math.max(Math.floor((progress / 96) * totalQuestions), 1),
    totalQuestions
  );

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* 顶部微光 */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 状态与计数徽章 */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Brain className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-200">
              {lang === 'zh' ? '智能认知引擎测评构建中' : 'Cognitive Assessment in Progress'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {lang === 'zh' ? `第 ${estimatedGeneratedCount} / ${totalQuestions} 题` : `Question ${estimatedGeneratedCount} / ${totalQuestions}`}
          </span>
          <span className="text-sm font-mono font-bold text-white">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>

      {/* 进度条轨道 */}
      <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-300 relative shadow-sm"
          style={{ width: `${progress}%` }}
        >
          {/* 流光点 */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/60 blur-[2px] rounded-full animate-pulse" />
        </div>
      </div>

      {/* 当前阶段动态文案 */}
      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
        <span className="truncate">
          {lang === 'zh' ? steps[currentStepIndex].zh : steps[currentStepIndex].en}
        </span>
      </div>

      {/* 四阶段指示点 */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-4 gap-2 text-[10px] text-zinc-500 font-medium">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1 transition-colors ${
              idx <= currentStepIndex ? 'text-amber-400/90' : 'text-zinc-600'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                idx <= currentStepIndex ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
            />
            <span className="truncate">Step {idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
