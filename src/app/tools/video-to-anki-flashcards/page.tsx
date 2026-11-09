import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  BrainCircuit, 
  BookOpen, 
  Download, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Zap, 
  Clock, 
  Award, 
  FileText,
  Share2
} from 'lucide-react';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import PublicPricingSection from '@/components/PublicPricingSection';

export const metadata: Metadata = {
  title: 'Video to Anki Flashcards Generator: Turn YouTube to Decks',
  description:
    'Convert YouTube videos into Anki flashcards instantly with AI. Extract key concepts into spaced-repetition decks (.apkg/csv) for 10x faster lecture mastery.',
  keywords: [
    'anki flashcard generator',
    'video to flashcards',
    'youtube to anki',
    'ai flashcard maker from video',
    'video to anki deck',
    'lecture to flashcards',
    'spaced repetition quiz'
  ],
  alternates: {
    canonical: 'https://videotoquiz.com/tools/video-to-anki-flashcards',
  },
  openGraph: {
    title: 'Video to Anki Flashcards Generator: Turn YouTube to Decks',
    description:
      'Convert YouTube videos into Anki flashcards instantly with AI. Extract key concepts into spaced-repetition decks (.apkg/csv) for 10x faster lecture mastery.',
    url: 'https://videotoquiz.com/tools/video-to-anki-flashcards',
    siteName: 'VideoToQuiz AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video to Anki Flashcards Generator: Turn YouTube to Decks',
    description:
      'Convert YouTube videos into Anki flashcards instantly with AI. Extract key concepts into spaced-repetition decks (.apkg/csv) for 10x faster lecture mastery.',
  },
};

const faqData = [
  {
    q: 'How does the Video to Anki Flashcard Generator work?',
    a: 'Our AI engine parses YouTube video transcripts, filters out conversational noise, and identifies core factual claims and testing points. It automatically structures these concepts into question-answer card pairs formatted specifically for Anki import (.csv format), complete with precise context and explanations.'
  },
  {
    q: 'How do I import generated flashcards into Anki desktop or mobile?',
    a: 'After completing a video quiz preview, click "Export PDF & Anki". You will download a standardized CSV file. Open Anki on your desktop, select "File" -> "Import", select the downloaded file, set Field 1 as Front and Field 2 as Back, and your new video study deck will be ready immediately.'
  },
  {
    q: 'Why combine educational videos with Anki spaced repetition?',
    a: 'Watching educational lectures without review results in forgetting over 75% of details within 48 hours (Ebbinghaus Forgetting Curve). Anki utilizes an algorithmic spaced-repetition schedule (SM-2 / FSRS) that prompts recall intervals just before memory decays, increasing long-term retention by over 120%.'
  },
  {
    q: 'Can I generate Anki cards from long lectures and university courses?',
    a: 'Yes. VideoToQuiz supports university lectures from MIT OpenCourseWare, Stanford, CS50, and medical channels. You can paste any public video URL or paste custom lecture transcripts directly into the prompt box.'
  }
];

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Video to Anki Flashcards Generator',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Convert educational YouTube videos and lecture transcripts into Anki-ready flashcards and spaced-repetition decks with AI.',
      url: 'https://videotoquiz.com/tools/video-to-anki-flashcards',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqData.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    },
  ],
};

export default function VideoToAnkiToolPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* Hero 区域：突出针对 Anki 学习者的具体价值与 10s 速度 */}
      <section className="text-center max-w-3xl mx-auto pt-6 pb-6 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-4">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>SPACED REPETITION &amp; FLASHCARD MAKER</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-5">
          Video to Anki Flashcards Generator:{' '}
          <span className="text-amber-400">
            Turn Any Lecture into Study Decks in 10s
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          Stop manually pausing videos to create flashcards. Convert any YouTube lecture, podcast, or tutorial into high-yield Anki flashcards (.csv) and active recall tests with AI.
        </p>

        {/* 关键优势指标卡片 */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-300 font-medium mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            1-Click Anki CSV Export
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            FSRS &amp; SM-2 Compatible
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Timestamped Explanations
          </span>
        </div>
      </section>

      {/* 核心交互出题与闪卡提取插槽 */}
      <InteractiveQuizSection />

      {/* Q-A-D-L 权威定义与对比表 */}
      <section className="w-full max-w-4xl mx-auto px-4 mt-12 space-y-12 text-zinc-300">
        {/* 权威定义框 */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            What is a Video to Anki Flashcard Generator?
          </h2>
          <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
            An <strong className="text-amber-400">AI Video to Anki Flashcard Generator</strong> is an active recall learning tool that automatically transcribes video content, identifies cognitive milestones, and generates front-and-back flashcard decks ready for spaced repetition software like Anki, Quizlet, and RemNote.
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Instead of spending 45 minutes manually copying notes from a 30-minute lecture, learners can instantly generate balanced decks covering core terminology, physiological pathways, code syntax, and historical events in seconds.
          </p>
        </div>

        {/* 手工做卡 vs AI 视频做卡 对比表 */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Manual Card Making vs. VideoToQuiz AI Anki Generator
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              See why university students and self-taught developers save 8+ study hours every week.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/70 shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-900 text-zinc-200 border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Comparison Metric</th>
                  <th className="py-3.5 px-4 font-semibold text-zinc-400">Manual Note Taking</th>
                  <th className="py-3.5 px-4 font-semibold text-amber-400">VideoToQuiz AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Time per 30-min Lecture</td>
                  <td className="py-3 px-4 text-zinc-400">45 to 60 minutes</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">10 seconds</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Card Formatting</td>
                  <td className="py-3 px-4 text-zinc-400">Prone to syntax errors</td>
                  <td className="py-3 px-4 text-emerald-400">Standardized CSV/Anki format</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Context Explanations</td>
                  <td className="py-3 px-4 text-zinc-400">Manual typing required</td>
                  <td className="py-3 px-4 text-emerald-400">Auto-generated with citations</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-white">Active Recall Verification</td>
                  <td className="py-3 px-4 text-zinc-400">Passive re-reading</td>
                  <td className="py-3 px-4 text-emerald-400">Immediate 2-to-5 question test</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3步快速使用指南 */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How to Generate Anki Cards from Any Video (3 Easy Steps)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-xl font-black text-amber-400 font-mono">STEP 01</span>
              <h3 className="text-sm font-bold text-white mt-2 mb-1">Paste Video Link</h3>
              <p className="text-xs text-zinc-400">
                Paste any YouTube lecture URL or input your transcript directly into the generator above.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-xl font-black text-amber-400 font-mono">STEP 02</span>
              <h3 className="text-sm font-bold text-white mt-2 mb-1">Preview &amp; Test Knowledge</h3>
              <p className="text-xs text-zinc-400">
                Practice the interactive questions immediately to test active recall and locate weak spots.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-xl font-black text-amber-400 font-mono">STEP 03</span>
              <h3 className="text-sm font-bold text-white mt-2 mb-1">1-Click Anki Export</h3>
              <p className="text-xs text-zinc-400">
                Download the Anki CSV deck and import it into Anki desktop, mobile, or Quizlet for permanent retention.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ 问答模块 */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {faqData.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h3 className="text-sm font-bold text-white">{item.q}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 底部内链导航 */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
          <h4 className="text-sm font-bold text-zinc-200">Explore Other AI Learning Tools</h4>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <Link href="/" className="text-amber-400 hover:underline">
              AI Video Quiz Maker Home →
            </Link>
            <span className="text-zinc-600">·</span>
            <Link href="/for/medical-students" className="text-emerald-400 hover:underline">
              Medical Students Quiz Hub →
            </Link>
            <span className="text-zinc-600">·</span>
            <Link href="/pricing" className="text-zinc-300 hover:underline">
              Starter Pack ($4.99) &amp; Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* 公开定价卡片 */}
      <PublicPricingSection placement="page" />
    </div>
  );
}
