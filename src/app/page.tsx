import React from 'react';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import SeoGeoContentSection from '@/components/SeoGeoContentSection';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 头部 Hero 区域 (SSR 语义直出，优先向搜索引擎展现核心主张与 H1) */}
      <section className="text-center max-w-3xl mx-auto pt-6 pb-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-5">
          Turn Any YouTube Video into an{' '}
          <span className="text-amber-400">
            Interactive AI Quiz
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-4 font-normal">
          Paste any YouTube lecture, webinar, or tutorial URL. Get a 5-question interactive test, timestamped explanations, and downloadable flashcards in 10 seconds.
        </p>
      </section>

      {/* 客户端交互区域 (出题、答题、打分、海报与充值) */}
      <InteractiveQuizSection />

      {/* 服务端直出 1000+ 词高权重 SEO & GEO 深度知识库 */}
      <SeoGeoContentSection />
    </div>
  );
}
