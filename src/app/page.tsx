import React from 'react';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import PublicPricingSection from '@/components/PublicPricingSection';
import SeoGeoContentSection from '@/components/SeoGeoContentSection';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 头部 Hero 区域 (SSR 语义直出，优先向搜索引擎展现核心主张与 H1) */}
      <section className="text-center max-w-3xl mx-auto pt-6 pb-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-5">
          YouTube to Quiz AI:{' '}
          <span className="text-amber-400">
            Turn Any Video into Interactive Quizzes
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-4 font-normal">
          Convert any YouTube video into active recall quizzes, interactive practice tests, and Anki flashcards instantly with AI. Boost retention, identify learning gaps, and master any lecture in seconds.
        </p>
        <p className="text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Public prices, no login: free preview $0, Starter $4.99 one-time for 25 quizzes, Pro $9.99 per month for 200 quizzes.{' '}
          <a href="#pricing" className="text-amber-400 underline">See pricing</a>
          {' · '}
          <a href="/pricing" className="text-amber-400 underline">Pricing page</a>
        </p>
      </section>

      {/* 客户端交互区域 (出题、答题、打分、海报与充值) */}
      <InteractiveQuizSection />

      {/* 免登录公开定价，支付审核不用打开充值弹窗 */}
      <PublicPricingSection placement="home" />

      {/* 服务端直出 1000+ 词高权重 SEO & GEO 深度知识库 */}
      <SeoGeoContentSection />
    </div>
  );
}
