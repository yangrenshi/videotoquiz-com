import React from 'react';
import type { Metadata } from 'next';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import PublicPricingSection from '@/components/PublicPricingSection';
import Link from 'next/link';
import { Youtube, CheckCircle2, BookOpen, Sparkles, HelpCircle, ArrowRight, Clock, ListChecks, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'YouTube to Notes Converter — VideoToQuiz',
  description: 'Convert YouTube videos into structured study notes, key takeaways, and flashcards in seconds. Free AI YouTube to notes converter for lectures and tutorials.',
  keywords: [
    'youtube to notes',
    'youtube to notes converter',
    'convert youtube videos to notes',
    'youtube lecture notes generator',
    'youtube video summary notes',
    'ai youtube notes maker'
  ],
  alternates: {
    canonical: 'https://videotoquiz.com/youtube-to-notes',
  },
  openGraph: {
    title: 'YouTube to Notes Converter — VideoToQuiz',
    description: 'Convert YouTube videos into structured study notes, key takeaways, and flashcards in seconds. Free AI YouTube to notes converter for lectures and tutorials.',
    url: 'https://videotoquiz.com/youtube-to-notes',
    siteName: 'VideoToQuiz',
    images: [
      {
        url: 'https://videotoquiz.com/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'YouTube to Notes Converter — VideoToQuiz',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube to Notes Converter — VideoToQuiz',
    description: 'Convert YouTube videos into structured study notes, key takeaways, and flashcards in seconds. Free AI YouTube to notes converter for lectures and tutorials.',
    images: ['https://videotoquiz.com/og-preview.png'],
  },
};

export default function YouTubeToNotesPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you support YouTube playlists?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can paste any individual YouTube video link from a playlist to generate immediate study notes. For comprehensive course playlists (such as full MIT OCW or Harvard series), you can convert consecutive YouTube lessons one-by-one to compile a complete semester study notebook.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can it convert YouTube videos longer than 2 hours?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our AI engine is specifically built to handle lengthy YouTube video lectures, university seminars, and multi-hour podcast episodes exceeding 2 to 3 hours (such as Huberman Lab or Lex Fridman). It synthesizes the full spoken transcript into organized conceptual chapters.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does the YouTube video need existing captions or is speech automatically recognized?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our system automatically detects and extracts official creator captions as well as YouTube auto-generated subtitles. If a YouTube video lacks subtitles completely, our backend speech recognition transcribed the audio track, or you can paste the lecture transcript directly into the text tab.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I export notes generated from YouTube videos to Markdown or PDF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Once your YouTube video is converted into notes, you can copy the full text as formatted Markdown with one click, download an organized .md file for Obsidian or Notion, or print directly to clean PDF study sheets.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to install a browser extension to convert YouTube videos to notes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No installation or browser extension is required. Simply copy any YouTube video URL from your browser or mobile app, paste it into our input box above, and get structured study notes in under 10 seconds.',
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

      {/* 头部 Hero 区域 (聚焦 YouTube 平台场景，H1 为指定文案) */}
      <section className="text-center max-w-3xl mx-auto pt-8 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
          <Youtube className="w-3.5 h-3.5" />
          <span>YouTube Lecture &amp; Tutorial Specialist</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          YouTube to Notes Converter
        </h1>

        <p className="text-base sm:text-lg text-amber-400/90 font-medium max-w-2xl mx-auto mb-3">
          Turn Any YouTube Video into Clean, Structured Study Notes in 10s
        </p>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-4">
          Stop manually pausing, scrubbing, and typing out notes from 2-hour YouTube video lectures. Our dedicated <strong>YouTube to notes</strong> engine extracts core arguments, step-by-step programming workflows, and key pedagogical takeaways from YouTube videos instantly.
        </p>

        <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Paste any YouTube video link to preview: Free guest conversion, Starter $4.99 for 25 conversions, Pro $9.99/mo for 200 conversions.{' '}
          <a href="#pricing" className="text-amber-400 underline hover:text-amber-300">View pricing</a>
        </p>
      </section>

      {/* 核心出题与笔记交互插槽 (默认渲染 Notes 模式) */}
      <InteractiveQuizSection initialViewMode="notes" />

      {/* 定价区域 */}
      <PublicPricingSection placement="page" />

      {/* 深度图文 & YouTube 专有场景知识库 */}
      <section className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-zinc-800 space-y-12 text-zinc-200">
        
        {/* 核心三步转化流程 (完全聚焦 YouTube 链接提取与转换) */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
            How to Convert YouTube Videos into Study Notes in 3 Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-sm border border-red-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400" />
                Copy YouTube Video Link
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Copy the URL of any YouTube video lecture, podcast, or technical tutorial (e.g., youtube.com/watch?v=... or youtu.be/...) and paste it into the converter.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-400/20">
                2
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Ingests YouTube Audio
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The engine extracts timestamped transcripts directly from the YouTube video, filters out conversational filler and sponsors, and highlights primary conceptual frameworks.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Read, Export &amp; Quiz
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Read your clean outline, copy formatted Markdown into Notion or Obsidian, print Cornell notes to PDF, or generate interactive self-tests from the YouTube video.
              </p>
            </div>
          </div>
        </div>

        {/* 手动记笔记 vs AI YouTube 转笔记对比表 */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Manual Note-Taking vs. AI YouTube to Notes Converter
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-zinc-400">Manual YouTube Note-Taking</th>
                  <th className="py-3 px-4 text-amber-400 font-bold">VideoToQuiz YouTube Converter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Time Required</td>
                  <td className="py-3 px-4 text-zinc-400">1.5x to 2x YouTube video duration</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">&lt; 10 seconds</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">YouTube Timestamp Tracking</td>
                  <td className="py-3 px-4 text-zinc-400">Manual scrubbing and typing times</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Automated chronological sections</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Long YouTube Videos (2h+)</td>
                  <td className="py-3 px-4 text-zinc-400">Severe cognitive fatigue and skips</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Complete transcript chapter analysis</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Cornell Format &amp; Cues</td>
                  <td className="py-3 px-4 text-zinc-400">Must draw tables manually</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Automated 3-section Cornell layout</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Self-Assessment Retention</td>
                  <td className="py-3 px-4 text-zinc-400">Passive re-reading of notes</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">1-Click Anki flashcard and quiz export</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ 常见问答 (包含 3 条特有的 YouTube 场景解答) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            YouTube to Notes Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                1. Do you support YouTube playlists?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes! You can paste any individual YouTube video link from a playlist to generate immediate study notes. For comprehensive course playlists (such as full MIT OCW or Harvard series), you can convert consecutive YouTube lessons one-by-one to compile a complete semester study notebook.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                2. Can it convert YouTube videos longer than 2 hours?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes. Our AI engine is specifically built to handle lengthy YouTube video lectures, university seminars, and multi-hour podcast episodes exceeding 2 to 3 hours (such as Huberman Lab or Lex Fridman). It synthesizes the full spoken transcript into organized conceptual chapters.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                3. Does the YouTube video need existing captions or is speech automatically recognized?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our system automatically detects and extracts official creator captions as well as YouTube auto-generated subtitles. If a YouTube video lacks subtitles completely, our backend speech recognition transcribes the audio track, or you can paste the lecture transcript directly into the text tab.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                4. Can I export notes generated from YouTube videos to Markdown or PDF?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes. Once your YouTube video is converted into notes, you can copy the full text as formatted Markdown with one click, download an organized .md file for Obsidian or Notion, or print directly to clean PDF study sheets.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                5. Do I need to install a browser extension to convert YouTube videos to notes?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                No installation or browser extension is required. Simply copy any YouTube video URL from your browser or mobile app, paste it into our input box above, and get structured study notes in under 10 seconds.
              </p>
            </div>
          </div>
        </div>

        {/* 底部内链导航 (自指与互通，不 canonical 到首页) */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Explore Related Tools</span>
            <p className="text-sm text-white font-medium">Looking for general video notes, Cornell formats, or active recall quizzes?</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-300 hover:text-amber-400 flex items-center gap-1"
            >
              Video to Notes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/video-to-quiz"
              className="text-xs font-semibold text-zinc-300 hover:text-amber-400 flex items-center gap-1"
            >
              Video to Quiz <ArrowRight className="w-3.5 h-3.5" />
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
