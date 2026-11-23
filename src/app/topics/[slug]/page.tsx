import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ExternalLink,
  ChevronRight,
  BrainCircuit,
  FileCheck2,
  Clock,
  HelpCircle
} from 'lucide-react';
import topicsData from '@/data/pseo-topics.json';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return topicsData.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = topicsData.find((d) => d.slug === slug);
  if (!item) return {};

  // 严格要求：频道名放在最前，紧跟 Quiz Generator
  const rawTitle = item.metaTitle || `${item.sourceChannel} Quiz Generator — Make Video Quizzes & Tests`;
  const cleanBaseTitle = rawTitle.split('|')[0].trim();
  const normalizedTitle = `${cleanBaseTitle} | VideoToQuiz`;

  return {
    title: normalizedTitle,
    description: item.metaDesc,
    alternates: {
      canonical: `https://videotoquiz.com/topics/${item.slug}`,
    },
    openGraph: {
      title: normalizedTitle,
      description: item.metaDesc,
      url: `https://videotoquiz.com/topics/${item.slug}`,
      siteName: 'VideoToQuiz',
      images: [
        {
          url: 'https://videotoquiz.com/og-preview.png',
          width: 1200,
          height: 630,
          alt: `${normalizedTitle}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: normalizedTitle,
      description: item.metaDesc,
      images: ['https://videotoquiz.com/og-preview.png'],
    },
  };
}

export default async function PSeoTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const item = topicsData.find((d) => d.slug === slug);
  if (!item) notFound();

  // 智能网状内链：同主题优先，筛选 4 个相关测验页
  const sameCategoryTopics = topicsData.filter(
    (t) => t.slug !== item.slug && t.category === item.category
  );
  const otherTopics = topicsData.filter(
    (t) => t.slug !== item.slug && t.category !== item.category
  );
  const relatedTopics = [...sameCategoryTopics, ...otherTopics].slice(0, 4);

  // FAQ 结构化数据物料 (对齐 Schema 与页面可见 DOM)
  const faqs = [
    {
      question: `How do I turn ${item.sourceChannel} YouTube videos into interactive quizzes?`,
      answer: `Simply copy any lecture or tutorial URL from ${item.sourceChannel} and paste it into our free video to quiz generator. The AI automatically parses video transcripts, extracts core cognitive concepts, and creates multiple-choice questions with timestamped explanations in seconds.`
    },
    {
      question: `Can I export quizzes generated from ${item.sourceChannel} to Anki or Quizlet?`,
      answer: `Yes. Every test created with VideoToQuiz can be exported with 1-click into standard Anki (.apkg/csv) decks, Quizlet format, printable PDF study guides, or Markdown flashcards for permanent spaced repetition retention.`
    },
    {
      question: `Why is active testing better than re-watching ${item.sourceChannel} videos?`,
      answer: `Cognitive science research (Roediger & Karpicke, 2006) demonstrates that passive video watching creates an illusion of competence where 70% of material is forgotten within 24 hours. Immediate active recall testing forces neural retrieval, increasing long-term exam retention by over 115%.`
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: item.h1,
        description: item.metaDesc,
        inLanguage: 'en-US',
        mainEntityOfPage: `https://videotoquiz.com/topics/${item.slug}`,
        datePublished: '2026-10-18T00:00:00+00:00',
        dateModified: '2026-11-03T00:00:00+00:00',
        author: {
          '@type': 'Organization',
          name: 'VideoToQuiz Editorial Team',
          url: 'https://videotoquiz.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'VideoToQuiz',
          url: 'https://videotoquiz.com',
        },
        about: {
          '@type': 'Thing',
          name: item.sourceChannel,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://videotoquiz.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Study Topics',
            item: 'https://videotoquiz.com/topics',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: item.title,
            item: `https://videotoquiz.com/topics/${item.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. 结构化面包屑导航 (Breadcrumb Trail - 传递权重) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/topics" className="hover:text-zinc-200 transition-colors">Study Topics</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-amber-400 font-semibold truncate max-w-xs">{item.title}</span>
      </nav>

      {/* 2. 单 H1 黄金原则 (包含核心频道与学科高意图词) */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{item.category.toUpperCase()} • {item.sourceChannel}</span>
          </div>

          {(item.slug.includes('medicine') || item.category === 'medicine') && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
              <span>🩺 Tailored for Medical Students (USMLE / MCAT / NCLEX)</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {item.h1}
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          {item.benefit}
        </p>

        {/* 顶部专属导读 (Editorial Intro Guide) */}
        {item.editorialIntro && (
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/90 border border-amber-500/20 shadow-sm mt-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-amber-300">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Curator&apos;s Study Guide for {item.sourceChannel}</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal">
              {item.editorialIntro}
            </p>
          </div>
        )}

        {/* 明确指向 /video-to-quiz 的 CTA 条 */}
        <div className="flex items-center justify-between p-3.5 px-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs sm:text-sm text-zinc-200">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Have a custom video or lecture? Convert any video into questions with our dedicated tool.</span>
          </div>
          <Link
            href="/video-to-quiz"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 shrink-0 font-mono underline"
          >
            <span>Video to Quiz Generator</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* 3. 首屏核心交互出题组件 (即开即用) */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Zap className="w-4 h-4 fill-current" />
            <span>Generate Quiz for {item.sourceChannel}</span>
          </span>
          <span className="hidden sm:inline">20 Free Bonus Credits</span>
        </div>

        <InteractiveQuizSection
          initialSampleKey={item.slug.includes('ninja-nerd') ? 'ninja_nerd' : undefined}
          customBanner={
            item.slug.includes('ninja-nerd') ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-emerald-950/20 border border-emerald-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    🩺
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-emerald-200">Pre-loaded Medical Quiz Demo (5 Questions)</p>
                    <p className="text-zinc-400 mt-0.5">Test your recall on the Autonomic Nervous System & Cardiovascular Reflexes instantly.</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  Ready to test
                </span>
              </div>
            ) : undefined
          }
        />
      </section>

      {/* 4. 下半屏结构化语义知识库 (纯 SSR 直出，供 AI 爬虫抓取) */}
      <section className="space-y-10 pt-8 border-t border-zinc-800 text-zinc-300">
        
        {/* GEO 权威定义框 (A - Answer) */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Why Active Testing is Essential for {item.sourceChannel}</span>
          </h2>
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 leading-relaxed text-xs sm:text-sm text-zinc-200 shadow-sm">
            <p className="mb-3">{item.definition}</p>
            <p className="text-zinc-400 text-xs">
              Unlike passive re-watching, converting spoken explanations into active recall quizzes forces immediate neural retrieval, dramatically cutting exam prep time while elevating score percentiles.
            </p>
          </div>
        </div>

        {/* 核心考点知识树 (Q - Core Testing Topics) */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Key Pedagogical Concepts Automatically Tested</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.keyTopics.map((topic, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-xs text-indigo-300 shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 科学复习流程卡片 (D - Data & Steps) */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            <span>Recommended 3-Step Active Recall Workflow</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-xs font-mono font-bold text-amber-400">STEP 1</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-1">Watch 15-30 Mins</h3>
              <p className="text-xs text-zinc-400">Absorb the core conceptual framing from the instructor without pause.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-xs font-mono font-bold text-amber-400">STEP 2</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-1">Take Instant 5-Q Test</h3>
              <p className="text-xs text-zinc-400">
                Run the video URL through our dedicated{' '}
                <Link href="/video-to-quiz" className="text-amber-400 underline font-medium hover:text-amber-300">
                  Video to Quiz Generator
                </Link>{' '}
                to identify blind spots and solidify cognitive memory immediately.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-xs font-mono font-bold text-amber-400">STEP 3</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-1">Export to Anki</h3>
              <p className="text-xs text-zinc-400">
                Schedule missed questions into spaced repetition for permanent retention using our{' '}
                <Link href="/video-to-quiz" className="text-amber-400 underline font-medium hover:text-amber-300">
                  Video to Quiz Generator
                </Link>.
              </p>
            </div>
          </div>
        </div>

        {/* 4.5 Q-A-D-L 权威问答与 FAQ 微数据对齐模块 */}
        <div className="space-y-4 pt-4 border-t border-zinc-800/80">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            <span>Frequently Asked Questions ({item.sourceChannel} Study Guide)</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-start gap-2">
                  <span className="text-amber-400 font-mono">Q{idx + 1}:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 相关测验与核心功能页传权区块 (Related Quizzes & Video to Quiz Hub) */}
        <section className="pt-8 border-t border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Related Video Quizzes & Curriculum Tests</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              Filtered for {item.category}
            </span>
          </div>

          {/* 重点加入：给 /video-to-quiz 集中传权的大卡片 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/20 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Primary Tool</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                <Link href="/video-to-quiz" className="hover:text-amber-300 transition-colors">
                  Video to Quiz Generator
                </Link>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                Create multiple-choice tests, flashcards, and summary study guides from any YouTube video, lecture recording, or uploaded MP4 file.
              </p>
            </div>
            <Link
              href="/video-to-quiz"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold hover:bg-amber-300 transition-colors shrink-0 shadow-sm"
            >
              <span>Try Video to Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 同主题 3-5 个相关 topics 页 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {relatedTopics.map((rel) => (
              <Link
                key={rel.slug}
                href={`/topics/${rel.slug}`}
                className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 hover:border-amber-400/60 hover:bg-zinc-900 transition-all group block shadow-sm"
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-amber-400/90 font-semibold truncate max-w-[120px]">
                    {rel.sourceChannel}
                  </span>
                  <span className="text-zinc-500">
                    {rel.category.split(' ')[0]}
                  </span>
                </div>
                <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 line-clamp-2 mt-0.5 leading-snug">
                  {rel.title}
                </span>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 flex items-center gap-1 mt-2 font-mono">
                  <span>Take Quiz</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          {/* 明确的页尾 CTA 指向 /video-to-quiz */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-zinc-800/60 pt-4">
            <p className="text-zinc-400">
              Need custom test questions from a specific lecture? Use our free{' '}
              <Link href="/video-to-quiz" className="text-amber-400 font-semibold underline hover:text-amber-300">
                Video to Quiz Generator
              </Link>{' '}
              to start in seconds.
            </p>
            <Link
              href="/topics"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 font-mono shrink-0"
            >
              <span>All {topicsData.length} Study Topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
