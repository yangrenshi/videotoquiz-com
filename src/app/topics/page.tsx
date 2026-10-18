import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, ArrowRight, BookOpen, Sparkles, Layers } from 'lucide-react';
import topicsData from '@/data/pseo-topics.json';

export const metadata: Metadata = {
  title: 'YouTube Lecture & Channel Quiz Directory | VideoToQuiz AI',
  description: 'Explore interactive active recall quizzes for MIT, Harvard, Khan Academy, Huberman Lab, and top educational YouTube video channels for free.',
  alternates: {
    canonical: 'https://www.videotoquiz.com/topics',
  },
  openGraph: {
    title: 'YouTube Lecture & Channel Quiz Directory | VideoToQuiz AI',
    description: 'Explore interactive quizzes for MIT, Harvard, Khan Academy, Huberman Lab, and top educational YouTube channels.',
    url: 'https://www.videotoquiz.com/topics',
    siteName: 'VideoToQuiz AI',
  },
};

export default function TopicsIndexPage() {
  // 按分类聚类
  const categories = Array.from(new Set(topicsData.map((t) => t.category)));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* 头部标题与面包屑 */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>EDUCATIONAL CHANNELS & CURRICULA DIRECTORY</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          YouTube Lecture &amp; Channel Quiz Directories
        </h1>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
          Select your favorite university course, science podcast, or programming bootcamp below. Turn long-form educational videos into high-yield active recall tests and Anki flashcards instantly.
        </p>
      </div>

      {/* 按类别展示卡片矩阵 */}
      <div className="space-y-10">
        {categories.map((cat) => {
          const catTopics = topicsData.filter((t) => t.category === cat);
          return (
            <section key={cat} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">{cat}</h2>
                <span className="text-xs text-zinc-500 font-mono">({catTopics.length} Curricula)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTopics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/topics/${topic.slug}`}
                    className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-900 transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400/90 block mb-1">
                        {topic.sourceChannel}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {topic.benefit}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-amber-300">
                      <span>Practice Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
