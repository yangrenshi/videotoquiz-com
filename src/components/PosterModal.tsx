'use client';

import React, { useRef, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { drawQuizScorePoster } from '@/lib/poster';
import { QuizScoreSummary } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  summary: QuizScoreSummary | null;
}

export default function PosterModal({ isOpen, onClose, videoTitle, summary }: PosterModalProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && summary && canvasRef.current) {
      drawQuizScorePoster(canvasRef.current, videoTitle, summary);
    }
  }, [isOpen, summary, videoTitle]);

  if (!isOpen || !summary) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `quiz-certificate-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 overflow-hidden flex flex-col items-center">
        {/* 标题栏与关闭 */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
          <span className="text-sm font-semibold text-zinc-200">
            {t.certificate.title}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 动态 Canvas 视窗 */}
        <div className="w-full aspect-[3/2] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 下载与操作 */}
        <div className="w-full flex items-center justify-end gap-3 mt-4 pt-3 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {t.certificate.close}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-zinc-900" />
            <span>{t.certificate.download}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
