import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import PublicPricingSection from '@/components/PublicPricingSection';
import SeoGeoContentSection from '@/components/SeoGeoContentSection';

export const metadata: Metadata = {
  title: 'Video to Notes Generator — Turn Any Video into Study Notes | VideoToQuiz',
  description: 'The fastest AI video to notes generator. Convert any online lecture or video into structured study notes, Cornell summaries, and flashcards in seconds.',
  alternates: {
    canonical: 'https://videotoquiz.com/',
  },
  openGraph: {
    title: 'Video to Notes Generator — Turn Any Video into Study Notes | VideoToQuiz',
    description: 'The fastest AI video to notes generator. Convert any online lecture or video into structured study notes, Cornell summaries, and flashcards in seconds.',
    url: 'https://videotoquiz.com/',
    siteName: 'VideoToQuiz',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 头部 Hero 区域 (SSR 语义直出，严格聚焦主词 video to notes，H1 纯净单一) */}
      <section className="text-center max-w-3xl mx-auto pt-8 pb-6">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Video to Notes Generator
        </h1>

        <p className="text-base sm:text-lg text-amber-400/90 font-medium max-w-2xl mx-auto mb-3">
          Turn Any Video into Structured Study Notes, Key Takeaways &amp; Cornell Outlines in 10s
        </p>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-4 font-normal">
          The fastest AI <strong>video to notes</strong> generator. Convert online lectures, college courses, and tutorial videos into comprehensive study outlines, key takeaways, and printable Cornell notes. Looking to generate interactive tests or quizzes from your videos? Try our dedicated <Link href="/video-to-quiz" className="text-amber-400 underline hover:text-amber-300 font-medium">Video to Quiz Generator</Link>.
        </p>

        <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Public pricing, no login required to test: Free study notes preview, Starter $4.99 one-time for 25 conversions, Pro $9.99/mo for 200 conversions.{' '}
          <a href="#pricing" className="text-amber-400 underline hover:text-amber-300">See pricing</a>
          {' · '}
          <Link href="/pricing" className="text-amber-400 underline hover:text-amber-300">Pricing page</Link>
        </p>
      </section>

      {/* 客户端交互区域 (出题、笔记、答题、海报与导出) */}
      <InteractiveQuizSection />

      {/* 免登录公开定价，支付审核不用打开充值弹窗 */}
      <PublicPricingSection placement="home" />

      {/* 服务端直出 1000+ 词高权重 SEO & GEO 深度知识库 */}
      <SeoGeoContentSection />
    </div>
  );
}
