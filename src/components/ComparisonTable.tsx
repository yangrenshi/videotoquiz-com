'use client';

import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ComparisonTable() {
  const { t } = useLanguage();

  const rows = [
    {
      feature: t.comparison.f1,
      ourTool: true,
      kwizie: false,
      noteGpt: true,
      quizgecko: false,
    },
    {
      feature: t.comparison.f2,
      ourTool: true,
      kwizie: true,
      noteGpt: false,
      quizgecko: true,
    },
    {
      feature: t.comparison.f3,
      ourTool: true,
      kwizie: false,
      noteGpt: true,
      quizgecko: false,
    },
    {
      feature: t.comparison.f4,
      ourTool: true,
      kwizie: false,
      noteGpt: false,
      quizgecko: false,
    },
    {
      feature: t.comparison.f5,
      ourTool: true,
      kwizie: false,
      noteGpt: false,
      quizgecko: true,
    },
    {
      feature: t.comparison.f6,
      ourTool: true,
      kwizie: false,
      noteGpt: false,
      quizgecko: false,
    },
  ];

  return (
    <section id="comparison" className="w-full py-12 border-t border-zinc-800/80">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-900 text-zinc-300 border border-zinc-800 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.comparison.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
          {t.comparison.title}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          {t.comparison.subtitle}
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/90 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <th className="py-4 px-6">{t.comparison.thFeature}</th>
              <th className="py-4 px-4 text-zinc-100 bg-zinc-800/40 font-bold">
                {t.comparison.thOurTool}
              </th>
              <th className="py-4 px-4 text-zinc-500 font-medium">Kwizie.ai</th>
              <th className="py-4 px-4 text-zinc-500 font-medium">NoteGPT</th>
              <th className="py-4 px-4 text-zinc-500 font-medium">Quizgecko</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-3.5 px-6 font-medium text-zinc-200">
                  {row.feature}
                </td>
                <td className="py-3.5 px-4 bg-zinc-800/20 text-emerald-400 font-semibold">
                  {row.ourTool ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.comparison.yes}</span>
                    </span>
                  ) : (
                    <X className="w-4 h-4 text-rose-500" />
                  )}
                </td>
                <td className="py-3.5 px-4 text-zinc-400">
                  {row.kwizie ? (
                    <Check className="w-4 h-4 text-zinc-300" />
                  ) : (
                    <X className="w-4 h-4 text-zinc-600" />
                  )}
                </td>
                <td className="py-3.5 px-4 text-zinc-400">
                  {row.noteGpt ? (
                    <Check className="w-4 h-4 text-zinc-300" />
                  ) : (
                    <X className="w-4 h-4 text-zinc-600" />
                  )}
                </td>
                <td className="py-3.5 px-4 text-zinc-400">
                  {row.quizgecko ? (
                    <Check className="w-4 h-4 text-zinc-300" />
                  ) : (
                    <X className="w-4 h-4 text-zinc-600" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
