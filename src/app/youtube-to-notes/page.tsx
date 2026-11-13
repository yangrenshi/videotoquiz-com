import React from 'react';
import type { Metadata } from 'next';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import PublicPricingSection from '@/components/PublicPricingSection';
import Link from 'next/link';
import { Youtube, CheckCircle2, BookOpen, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'YouTube to Notes — Convert YouTube Videos to Study Notes',
  description: 'Generate structured study notes and summaries from any YouTube video in seconds. Free AI YouTube to notes maker with key takeaways and quiz generator.',
  keywords: [
    'youtube to notes',
    'youtube video to notes',
    'convert youtube to notes',
    'youtube lecture notes generator',
    'youtube summary notes ai',
    'ai youtube notes'
  ],
  alternates: {
    canonical: 'https://videotoquiz.com/youtube-to-notes/',
  },
  openGraph: {
    title: 'YouTube to Notes — Convert YouTube Videos to Study Notes',
    description: 'Generate structured study notes and summaries from any YouTube video in seconds. Free AI YouTube to notes maker with key takeaways and quiz generator.',
    url: 'https://videotoquiz.com/youtube-to-notes/',
    type: 'website',
  },
};

export default function YouTubeToNotesPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the YouTube to notes generator work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI extracts the lecture transcript and spoken audio from any YouTube video, synthesizes core conceptual models, and generates structured notes with bullet points, timestamps, and key takeaways.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I export the YouTube notes to Markdown or PDF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can copy the full notes formatted in Markdown or print/save them directly to a clean PDF document with one click.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to install any Chrome extension to use YouTube to notes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No installation required. Simply paste the YouTube video link into the box above and your structured study notes are generated in under 10 seconds.',
        },
      },
    ],
  };

  return (
    <div className="w-full flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 头部 Hero 区域 */}
      <section className="text-center max-w-3xl mx-auto pt-8 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
          <Youtube className="w-3.5 h-3.5" />
          <span>YouTube Study Assistant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          YouTube to Notes
        </h1>

        <p className="text-base sm:text-lg text-amber-400/90 font-medium max-w-2xl mx-auto mb-3">
          Convert Any YouTube Video into Clean, Structured Study Notes in 10s
        </p>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-4">
          Stop pausing and rewinding 2-hour video lectures. Our AI <strong>YouTube to notes</strong> engine extracts core arguments, step-by-step methodologies, and key takeaways instantly. Ideal for college students, software engineers, and lifelong learners.
        </p>
      </section>

      {/* 核心出题与笔记交互插槽 */}
      <InteractiveQuizSection />

      {/* 定价区域 */}
      <PublicPricingSection placement="page" />

      {/* 深度图文 & Q-A-D-L 知识库 */}
      <section className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-zinc-800 space-y-12 text-zinc-200">
        {/* 核心三步转化 */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
            How to Convert YouTube to Notes in 3 Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Paste YouTube Link</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Copy the URL of any lecture, conference talk, or tutorial from YouTube and paste it above.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-white">AI Analyzes Content</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our cognitive model reads the transcripts, removes conversational banter, and categorizes high-value insights.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Study, Copy & Test</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Review your structured outline, export to Markdown/PDF, or take an automated test to cement retention.
              </p>
            </div>
          </div>
        </div>

        {/* 为什么选择 YouTube to Notes 对比表 */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Manual Note-Taking vs. AI YouTube to Notes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-zinc-400">Manual Note Taking</th>
                  <th className="py-3 px-4 text-amber-400 font-bold">YouTube to Notes AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Time Required</td>
                  <td className="py-3 px-4 text-zinc-400">1.5x - 2x video duration</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">&lt; 10 seconds</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Key Takeaway Extraction</td>
                  <td className="py-3 px-4 text-zinc-400">Subject to cognitive fatigue</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Rigorous 3-pillar synthesis</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Cornell Format & Cues</td>
                  <td className="py-3 px-4 text-zinc-400">Must format manually</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Built-in automatic formatting</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Active Recall Verification</td>
                  <td className="py-3 px-4 text-zinc-400">Write test questions yourself</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Instant 5-question test with explanations</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ 常见问答 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Does this work on long YouTube videos?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes! Our engine can ingest lectures and webinars ranging from 5-minute explainers up to multi-hour conference recordings.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Can I generate Cornell notes from YouTube?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Absolutely. Check out our dedicated <Link href="/cornell-notes-generator" className="text-amber-400 underline hover:text-amber-300">Cornell Notes Generator</Link> designed specifically with cue questions and summary blocks.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">How can I review these notes later?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You can download the full notes as Markdown, print as PDF, or export key recall flashcards directly into Anki.
              </p>
            </div>
          </div>
        </div>

        {/* 底部内链导航 */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Explore More Tools</span>
            <p className="text-sm text-white font-medium">Looking for structured Cornell templates or generic video notes?</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-300 hover:text-amber-400 flex items-center gap-1"
            >
              Video to Notes Home <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/cornell-notes-generator"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Cornell Notes Maker <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
