import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Download, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight,
  Activity,
  HeartPulse,
  Flame
} from 'lucide-react';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';

export const metadata: Metadata = {
  title: 'AI Quiz Generator for Medical Students | VideoToQuiz',
  description: 'Turn YouTube medical lectures into active recall quizzes, USMLE & MCAT practice questions, and 1-click Anki flashcards. Study smarter with AI.',
  alternates: {
    canonical: 'https://www.videotoquiz.com/for/medical-students',
  },
  openGraph: {
    title: 'AI Quiz Generator for Medical Students | VideoToQuiz',
    description: 'Convert heavy medical video lectures into active recall quizzes and Anki decks with timestamped rationales.',
    url: 'https://www.videotoquiz.com/for/medical-students',
    siteName: 'VideoToQuiz AI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Quiz Generator for Medical Students | VideoToQuiz',
    description: 'Convert heavy medical video lectures into active recall quizzes and Anki decks with timestamped rationales.',
  },
};

export default function MedicalStudentsPage() {
  const faqs = [
    {
      question: 'How does VideoToQuiz help medical students pass USMLE, MCAT, and NCLEX?',
      answer: 'By converting high-density medical video lectures (from Osmosis, Ninja Nerd, Dirty Medicine, Armando Hasudungan) into active recall practice questions. Instead of passively re-watching 2-hour lectures, students test their diagnostic reasoning, identify weak knowledge clusters, and export missed questions directly into Anki for permanent spaced repetition.'
    },
    {
      question: 'Can I export medical questions into Anki flashcard decks?',
      answer: 'Yes. Every generated quiz can be exported as a pre-formatted Anki deck (.txt / TSV) with 1-click. Each card includes the clinical scenario, all options on the front, and the official rationale, correct answer, and timestamped explanation on the back.'
    },
    {
      question: 'Does this tool support long medical lectures and physiology tutorials?',
      answer: 'Yes. Our engine processes video transcripts up to 2 hours long, distilling pharmacology mechanisms, biochemical pathways, and anatomical landmarks into precise board-style questions.'
    },
    {
      question: 'Can I re-take only the medical questions I answered incorrectly?',
      answer: 'Absolutely. Use the "Retake Missed Questions" feature to immediately target your diagnostic knowledge gaps without wasting time re-doing questions you have already mastered.'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'AI Quiz Generator for Medical Students',
        description: 'Interactive exam prep tool converting medical video lectures into board-style quizzes and Anki cards.',
        url: 'https://www.videotoquiz.com/for/medical-students',
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

      {/* 面包屑导航 */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-400">Use Cases</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-emerald-400 font-semibold">For Medical Students</span>
      </nav>

      {/* 单 H1 黄金原则 */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>CLINICAL & PRE-MED EXAM PREPARATION</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <Flame className="w-3.5 h-3.5" />
            <span>USMLE Step 1 • MCAT • NCLEX</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          AI Quiz Generator for Medical Students: Turn Lectures into Board-Style Recall
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          Stop passively watching 2-hour medical tutorials. Convert complex physiology, pharmacology, and anatomy videos into active-recall quizzes, diagnostic practice tests, and exportable Anki decks in 30 seconds.
        </p>
      </header>

      {/* 首屏核心免登录试用插槽 (CoreToolSlot) */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-4 h-4" />
            <span>Free Medical Exam Practice Slot</span>
          </span>
          <span className="hidden sm:inline">Pre-loaded with Ninja Nerd Physiology Demo</span>
        </div>

        <InteractiveQuizSection
          initialSampleKey="ninja_nerd"
          customBanner={
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-zinc-950 to-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  🩺
                </div>
                <div className="text-xs">
                  <p className="font-bold text-emerald-200">USMLE High-Yield Sample Quiz Ready</p>
                  <p className="text-zinc-400 mt-0.5">Autonomic nervous system pharmacology & baroreceptor reflexes pre-loaded below. Tap anywhere to begin testing.</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                Active Recall
              </span>
            </div>
          }
        />
      </section>

      {/* SSR 结构化知识库 (Q-A-D-L 组件直出) */}
      <section className="space-y-10 pt-8 border-t border-zinc-800 text-zinc-300">
        
        {/* Q-A 权威定义框 */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            <span>The Illusion of Competence in Medical Education</span>
          </h2>
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 leading-relaxed text-xs sm:text-sm text-zinc-200 shadow-sm space-y-3">
            <p>
              Medical school curricula require retaining over 15,000 distinct pharmacological agents, microbiological pathogens, and physiological mechanisms. Cognitive science demonstrates that passive video review produces an <strong>Illusion of Competence</strong>: because the lecturer’s explanation makes intuitive sense, students mistakenly believe they have memorized the underlying pathways.
            </p>
            <p className="text-zinc-400 text-xs">
              VideoToQuiz breaks this passive consumption trap by applying <strong>Active Retrieval Practice</strong>. Immediately upon watching a lecture, the AI generates board-style multiple-choice questions requiring you to retrieve and apply the concepts, solidifying neural pathways before forgetting occurs.
            </p>
          </div>
        </div>

        {/* 原生对比表 (D - Decision Matrix) */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Study Method Comparison: Passive vs. VideoToQuiz Active Recall</span>
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono text-xs">
                  <th className="p-3 sm:p-4">Study Dimension</th>
                  <th className="p-3 sm:p-4">Passive Video Re-watching</th>
                  <th className="p-3 sm:p-4">Manual Flashcard Creation</th>
                  <th className="p-3 sm:p-4 text-emerald-400 bg-emerald-950/20">VideoToQuiz AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/40 font-normal">
                <tr>
                  <td className="p-3 sm:p-4 font-semibold text-zinc-200">Time to First Practice</td>
                  <td className="p-3 sm:p-4 text-zinc-400">120 mins (full lecture)</td>
                  <td className="p-3 sm:p-4 text-zinc-400">45-60 mins typing cards</td>
                  <td className="p-3 sm:p-4 text-emerald-400 font-semibold bg-emerald-950/10">30 seconds</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold text-zinc-200">Retention After 7 Days</td>
                  <td className="p-3 sm:p-4 text-zinc-400">18% (Ebbinghaus decay)</td>
                  <td className="p-3 sm:p-4 text-zinc-400">65% (if reviewed)</td>
                  <td className="p-3 sm:p-4 text-emerald-400 font-semibold bg-emerald-950/10">84% with Anki export</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold text-zinc-200">Clinical Vignette Rationale</td>
                  <td className="p-3 sm:p-4 text-zinc-400">None (untested)</td>
                  <td className="p-3 sm:p-4 text-zinc-400">Basic flashcard flip</td>
                  <td className="p-3 sm:p-4 text-emerald-400 font-semibold bg-emerald-950/10">Detailed mechanism explanations</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold text-zinc-200">Weak Area Targetting</td>
                  <td className="p-3 sm:p-4 text-zinc-400">Requires manual guesswork</td>
                  <td className="p-3 sm:p-4 text-zinc-400">Anki spaced intervals</td>
                  <td className="p-3 sm:p-4 text-emerald-400 font-semibold bg-emerald-950/10">1-Click Retake Missed Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 三步极速公式 (L - Logic / Workflow) */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>3-Step High-Yield Workflow for Board Exams</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs">
                01
              </span>
              <h3 className="font-bold text-zinc-100 text-sm">Paste Any Medical Lecture</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste any YouTube link from Ninja Nerd, Osmosis, Dirty Medicine, or your university lecture recordings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-xs">
                02
              </span>
              <h3 className="font-bold text-zinc-100 text-sm">Instant Active Recall Test</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Complete a 5-20 question test with instant rationale feedback. Re-test missed questions until 100% mastery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs">
                03
              </span>
              <h3 className="font-bold text-zinc-100 text-sm">Export to Anki / Print</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Export clean Anki decks (.tsv) or printable A4 study sheets to solidify retention throughout clinical rotations.
              </p>
            </div>
          </div>
        </div>

        {/* 常见问题 FAQ (对齐 FAQ Schema) */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Frequently Asked Questions for Medical Students</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 group cursor-pointer">
                <summary className="font-bold text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-zinc-500 ml-2 group-open:rotate-90 transition-transform">▸</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
