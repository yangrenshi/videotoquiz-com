import React from 'react';
import type { Metadata } from 'next';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import PublicPricingSection from '@/components/PublicPricingSection';
import Link from 'next/link';
import { FileText, CheckCircle2, BookOpen, Sparkles, HelpCircle, ArrowRight, Printer, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cornell Notes Generator — AI Video to Cornell Notes Maker',
  description: 'Create professional Cornell notes from any video automatically. Structured with Cues, Notes, and Summary sections. Export to PDF or Markdown for free.',
  keywords: [
    'cornell notes generator',
    'cornell note maker',
    'ai cornell notes',
    'generate cornell notes from video',
    'cornell note template pdf',
    'video to cornell notes'
  ],
  alternates: {
    canonical: 'https://videotoquiz.com/cornell-notes-generator/',
  },
  openGraph: {
    title: 'Cornell Notes Generator — AI Video to Cornell Notes Maker',
    description: 'Create professional Cornell notes from any video automatically. Structured with Cues, Notes, and Summary sections. Export to PDF or Markdown for free.',
    url: 'https://videotoquiz.com/cornell-notes-generator/',
    type: 'website',
  },
};

export default function CornellNotesGeneratorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the Cornell note-taking system?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Cornell system divides a page into three sections: a Cue column on the left (for keywords and self-test questions), a Note-taking column on the right (for detailed lecture explanations), and a Summary section at the bottom (for quick conceptual review).',
        },
      },
      {
        '@type': 'Question',
        name: 'How does this Cornell notes generator create the cue column?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI model analyzes the main arguments in your video and automatically formulates recall prompts, key terms, and diagnostic questions for the Cue column.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I print or save the Cornell notes as PDF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! The generated Cornell notes feature a standardized 3-column layout that can be printed or saved directly as a clean PDF or Markdown file.',
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>Systematic Learning Framework</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Cornell Notes Generator
        </h1>

        <p className="text-base sm:text-lg text-amber-400/90 font-medium max-w-2xl mx-auto mb-3">
          Transform Any Video Lecture into Standard 3-Section Cornell Notes in 10s
        </p>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-4">
          The Cornell Note-Taking System is proven by cognitive science to double long-term exam retention. Our automated <strong>cornell notes generator</strong> formats lectures into prompt cues, detailed notes, and instant summaries ready for PDF export.
        </p>
      </section>

      {/* 核心出题与笔记交互插槽 */}
      <InteractiveQuizSection />

      {/* 定价区域 */}
      <PublicPricingSection placement="page" />

      {/* 深度图文 & 康奈尔笔记法体系 */}
      <section className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-zinc-800 space-y-12 text-zinc-200">
        {/* 康奈尔架构全景图解 */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
            The Cornell Note-Taking Anatomy
          </h2>
          <p className="text-sm text-zinc-400 text-center max-w-xl mx-auto">
            Our AI generates all three classic components automatically so you spend zero time drawing lines and 100% time mastering concepts.
          </p>

          <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl">
            {/* 上半部：Cue Column + Note-taking Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              <div className="p-6 bg-zinc-950/40 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  1. Cue Column (Left 30%)
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Filled with provocative questions, diagnostic cues, and foundational vocabulary words derived directly from the lecture.
                </p>
                <div className="bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  • What defines Big-O notation?<br/>
                  • Difference compiled vs interpreted?<br/>
                  • Core operational constraints?
                </div>
              </div>

              <div className="md:col-span-2 p-6 space-y-3">
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider block">
                  2. Note-Taking Area (Right 70%)
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Contains dense, bulleted conceptual breakdowns, formulas, and step-by-step arguments without unnecessary conversational fluff.
                </p>
                <div className="bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed">
                  - Big-O notation measures the theoretical upper bound on algorithmic execution time as input size n grows to infinity.<br/>
                  - Modular decomposition breaks monolithic complexity into verifiable subroutines.
                </div>
              </div>
            </div>

            {/* 下半部：Summary Area */}
            <div className="border-t border-zinc-800 p-6 bg-zinc-950/70 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                3. Summary Area (Bottom Section)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                A 2-to-3 sentence executive synthesis encapsulating the core mental model for 30-second pre-exam review.
              </p>
            </div>
          </div>
        </div>

        {/* 为什么选择 Cornell Notes Generator 对比优势 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Print-Ready PDF Formatting</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate notes formatted with clear visual borders and typography designed specifically for paper binders and digital tablets.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Automatic Cue Formulation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No more guessing what question to write on the left margin. Our AI constructs targeted active-recall cues for you.
            </p>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">One-Click Markdown Export</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Copy raw Markdown directly into Obsidian, Notion, or Roam Research without losing indentation or structure.
            </p>
          </div>
        </div>

        {/* FAQ 常见问答 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            Cornell Notes FAQ
          </h2>
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Why are Cornell notes better than traditional outlines?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                By forcing you to cover the right side and test yourself using the left cue column, Cornell notes convert passive reading into high-retention active recall.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Does this work on technical subjects like coding or math?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes! The Cornell format excels in STEM courses because equations and algorithms fit cleanly into the right column while terms and rules sit on the left.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Is the Cornell notes generator free to test?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes! You can convert lectures and generate Cornell notes preview immediately without even creating an account.
              </p>
            </div>
          </div>
        </div>

        {/* 底部内链导航 */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Related Study Tools</span>
            <p className="text-sm text-white font-medium">Looking for YouTube video summaries or active recall tests?</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-300 hover:text-amber-400 flex items-center gap-1"
            >
              Video to Notes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/youtube-to-notes"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              YouTube to Notes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
