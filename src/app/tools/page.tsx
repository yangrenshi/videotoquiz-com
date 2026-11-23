import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  FileText, 
  Youtube, 
  Video,
  GraduationCap
} from 'lucide-react';
import topicsData from '@/data/pseo-topics.json';

export const metadata: Metadata = {
  title: 'AI Video Study Tools Directory | VideoToQuiz',
  description: 'Explore our suite of AI video study tools: Video to Quiz, Video to Anki Flashcards, YouTube to Notes, and Cornell Notes Generator. Boost exam retention for free.',
  keywords: [
    'video study tools',
    'ai educational tools',
    'video to quiz',
    'video to flashcards',
    'youtube to notes',
    'cornell notes generator'
  ],
  alternates: {
    canonical: 'https://videotoquiz.com/tools',
  },
  openGraph: {
    title: 'AI Video Study Tools Directory | VideoToQuiz',
    description: 'Explore our suite of AI video study tools: Video to Quiz, Video to Anki Flashcards, YouTube to Notes, and Cornell Notes Generator.',
    url: 'https://videotoquiz.com/tools',
    siteName: 'VideoToQuiz',
    images: [
      {
        url: 'https://videotoquiz.com/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'AI Video Study Tools Directory — VideoToQuiz',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Video Study Tools Directory | VideoToQuiz',
    description: 'Explore our suite of AI video study tools: Video to Quiz, Video to Anki Flashcards, YouTube to Notes, and Cornell Notes Generator.',
    images: ['https://videotoquiz.com/og-preview.png'],
  },
};

interface ToolItem {
  title: string;
  href: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
}

export default function ToolsIndexPage() {
  const tools: ToolItem[] = [
    {
      title: 'Video to Quiz Generator',
      href: '/video-to-quiz',
      badge: 'Assessment',
      icon: <Video className="w-5 h-5 text-amber-400" />,
      description: 'Turn YouTube lectures, conference talks, or uploaded MP4 recordings into interactive multiple-choice tests with timestamped explanations.',
      features: ['Active recall testing', 'Misconception diagnosis', 'Printable PDF question sheets']
    },
    {
      title: 'Video to Anki Flashcards',
      href: '/tools/video-to-anki-flashcards',
      badge: 'Spaced Repetition',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      description: 'Convert long video lessons into spaced-repetition Anki decks (.apkg/csv) for permanent memory retention and board exam prep.',
      features: ['1-Click Anki export', 'Front/Back question cards', 'Markdown deck download']
    },
    {
      title: 'YouTube to Notes Generator',
      href: '/youtube-to-notes',
      badge: 'Summarization',
      icon: <Youtube className="w-5 h-5 text-red-400" />,
      description: 'Extract structured executive summaries, key takeaways, and chronological timeline notes from any YouTube video in under 10 seconds.',
      features: ['Executive summary', 'Key takeaways extraction', 'Copy formatted Markdown']
    },
    {
      title: 'Cornell Notes Generator',
      href: '/cornell-notes-generator',
      badge: 'Note-Taking',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      description: 'Generate systematic 3-section Cornell notes with left-hand cue questions, detailed notes, and a bottom summary block ready for PDF export.',
      features: ['Cue question formulation', 'Standardized 3-column layout', 'Print-ready formatting']
    },
    {
      title: 'Curated Study Topics Directory',
      href: '/topics',
      badge: 'Curriculum',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      description: 'Browse pre-generated active recall quizzes covering top university courses including Harvard CS50, MIT OCW, Khan Academy, and Huberman Lab.',
      features: [`${topicsData.length} top channel curricula`, 'Instant diagnostic practice', 'Free curriculum quizzes']
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* 头部标题与定位说明 */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Layers className="w-3.5 h-3.5" />
          <span>Product Ecosystem</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          AI Video Study Tools
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
          Explore our complete collection of AI-powered cognitive tools. Convert educational videos into interactive quizzes, spaced-repetition Anki decks, and printable Cornell notes.
        </p>
      </section>

      {/* 工具网格清单 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.href}
            className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl group space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center">
                  {tool.icon}
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  {tool.badge}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-2">
                  {tool.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 space-y-1.5">
                {tool.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <Link
                href={tool.href}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-0.5 transition-all"
              >
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 底部 CTA 卡片 */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Looking to Test Your First Video Right Now?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Paste any YouTube lecture link into our flagship Video to Quiz Generator. No credit card or account registration needed to test.
        </p>
        <div className="pt-2">
          <Link
            href="/video-to-quiz"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95"
          >
            <span>Try Video to Quiz Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
