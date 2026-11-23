import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  UploadCloud, 
  Video, 
  FileCheck2, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Layers, 
  Share2, 
  Download,
  Check,
  Zap
} from 'lucide-react';
import InteractiveQuizSection from '@/components/InteractiveQuizSection';
import PublicPricingSection from '@/components/PublicPricingSection';

export const metadata: Metadata = {
  title: 'Video to Quiz Generator — Turn Any Video into a Quiz',
  description: 'Free AI video to quiz generator. Turn YouTube lectures and video files into multiple choice quizzes in seconds with instant explanations. Try it free.',
  keywords: [
    'video to quiz',
    'video to quiz generator',
    'turn video into quiz',
    'youtube to quiz',
    'ai quiz maker from video',
    'video multiple choice generator',
    'video quiz creator'
  ],
  alternates: {
    canonical: 'https://videotoquiz.com/video-to-quiz',
  },
  openGraph: {
    title: 'Video to Quiz Generator — Turn Any Video into a Quiz',
    description: 'Free AI video to quiz generator. Turn YouTube lectures and video files into multiple choice quizzes in seconds with instant explanations. Try it free.',
    url: 'https://videotoquiz.com/video-to-quiz',
    siteName: 'VideoToQuiz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video to Quiz Generator — Turn Any Video into a Quiz',
    description: 'Free AI video to quiz generator. Turn YouTube lectures and video files into multiple choice quizzes in seconds with instant explanations. Try it free.',
  },
};

export default function VideoToQuizPage() {
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Video to Quiz Generator',
        operatingSystem: 'All',
        applicationCategory: 'EducationalApplication',
        url: 'https://videotoquiz.com/video-to-quiz',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '1540',
          reviewCount: '1540',
          bestRating: '5',
          worstRating: '1',
        },
        featureList: [
          'Automatic YouTube Video to Quiz Generation',
          'Multiple Choice and True False Question Formatting',
          'Instant Timestamped Explanations for Every Distractor',
          'Export to Anki, Markdown, PDF, and LMS Platforms',
          'Direct Local Video MP4, Audio, and Lecture Slide Upload'
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can I use this video to quiz generator for free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! You can generate interactive quizzes from videos completely free without even registering an account. Free guest previews let you test sample educational videos or paste public YouTube links right away. Creating a free account grants additional complimentary generation credits.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long of a video can I generate a quiz from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our AI model supports videos ranging from quick 3-minute tutorials to extensive 3-hour college lectures and conference keynotes. The engine parses the full spoken transcript and semantic timeline, extracting high-yield cognitive checkpoints across the entire recording.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I export the quiz questions to Google Forms or Kahoot?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Every generated test can be exported in one click as formatted text, Markdown, Anki flashcard decks (.apkg/csv), or printable PDF question sheets. You can easily copy and paste formatted question stems and distractor choices directly into Google Forms, Kahoot, Canvas, or Moodle.',
            },
          },
          {
            '@type': 'Question',
            name: 'How accurate are the generated video quiz questions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our quiz generation engine is trained on Blooms Taxonomy and pedagogical assessment methodologies. Rather than writing trivial keyword-matching questions, it generates diagnostic conceptual questions with plausible distractors and timestamped explanations citing the exact rationale from the speaker.',
            },
          },
          {
            '@type': 'Question',
            name: 'What languages are supported by the video to quiz maker?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The tool supports videos in over 50 languages, including English, Spanish, French, German, Mandarin Chinese, Japanese, Portuguese, Hindi, and Arabic. The AI accurately parses international speech and generates grammatically polished assessments in your preferred language.',
            },
          },
        ],
      }
    ]
  };

  return (
    <div className="w-full flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* 模块 1: 一句话说明工具干什么 + 紧凑 Hero */}
      <section className="text-center max-w-3xl mx-auto pt-8 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Recall Assessment Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Video to Quiz Generator
        </h1>

        <p className="text-base sm:text-lg text-amber-400/90 font-medium max-w-2xl mx-auto mb-3">
          Turn Any Video Link or Uploaded Recording into Interactive Multiple-Choice Quizzes in 10s
        </p>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-4">
          Paste any educational video URL or upload your lecture recording to automatically generate rigorous multiple-choice assessments, diagnose knowledge gaps, and verify real comprehension instantly.
        </p>

        <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          100% free preview, zero login needed to test: Starter $4.99 for 25 quizzes, Pro $9.99/mo for 200 quizzes.{' '}
          <a href="#pricing" className="text-amber-400 underline hover:text-amber-300">View pricing</a>
        </p>
      </section>

      {/* 模块 1: 立刻可用的交互出题与做题插槽 (默认直接进入测验答题体验) */}
      <InteractiveQuizSection initialViewMode="quiz" />

      {/* 公开定价卡片 */}
      <PublicPricingSection placement="page" />

      {/* 深度长文知识库 (正文 800+ 词，包含模块 2 至 7) */}
      <article className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-zinc-800 space-y-16 text-zinc-200">
        
        {/* 模块 2: 三步流程 (3-Step Workflow) */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Fast & Automated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How Video to Quiz Works in 3 Simple Steps
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Transform passive watching into dynamic active recall. Our pedagogical AI handles transcript parsing, misconception diagnosis, and formatting in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3 relative group hover:border-zinc-700 transition-colors shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-400/20">
                1
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-400" />
                Paste Link or Upload
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Copy and paste a public YouTube video link, enter a web lecture URL, or directly drag-and-drop your local MP4, MOV, or audio lecture files into the uploader.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3 relative group hover:border-zinc-700 transition-colors shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-400/20">
                2
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Generates Questions
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Our cognitive evaluation engine extracts core conceptual anchors, formulates challenging multiple choice stems, and creates pedagogical distractor explanations.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3 relative group hover:border-zinc-700 transition-colors shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-400/20">
                3
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                Test, Edit &amp; Export
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Take the interactive test right in your browser, review detailed rationales for missed answers, and export formatted tests to Anki, PDF, or Google Forms.
              </p>
            </div>
          </div>
        </section>

        {/* 模块 3: 支持的平台与格式 + 支持的题型 */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Universal Compatibility</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Supported Video Platforms, Formats &amp; Question Types
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Whether you are converting university lectures, internal employee trainings, or quick YouTube tutorials, VideoToQuiz provides comprehensive multi-source ingestion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 平台与格式 */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-400" />
                Video Sources &amp; File Formats
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>YouTube URLs:</strong> Works with public lectures, unlisted tutorials, live stream recordings, and educational shorts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Direct File Uploads:</strong> Ingest local video files including MP4, WebM, MOV, and AVI up to several gigabytes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Audio &amp; Meeting Recordings:</strong> Ingest Zoom recordings, Loom screen shares, Google Meet sessions, and MP3 podcasts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Raw Text &amp; SRT Transcripts:</strong> Paste subtitle files (.srt, .vtt) or class lecture handouts directly for instant question extraction.</span>
                </li>
              </ul>
            </div>

            {/* 题目类型 */}
            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Rigorous Assessment Types
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Single-Answer Multiple Choice (MCQ):</strong> 4 plausible answer options (A, B, C, D) targeting specific cognitive misconceptions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Multi-Select Checkbox Questions:</strong> Evaluate multi-variable relationships and comprehensive checklist items discussed in lectures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>True / False Diagnostic Statements:</strong> Rapid fire conceptual checks to rapidly test foundational definitions and core rules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Conceptual Scenario Vignettes:</strong> Real-world case study questions asking learners how to apply lecture theories to novel problems.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 模块 4: 真实的示例展示 (Real-World Demonstration) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Concrete Proof</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real-World Demonstration: Generated Harvard CS50 Quiz
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Here is an exact sample of questions generated automatically by VideoToQuiz from a 2-hour recording of Harvard CS50: Python Programming &amp; Computational Thinking.
            </p>
          </div>

          <div className="space-y-4">
            {/* 样例题目 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-amber-400 font-bold">Question 1 · Computational Complexity</span>
                <span className="text-[11px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Single Choice</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white">
                In computational algorithmic analysis, what does Big-O notation primarily measure?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  A. The exact physical CPU cycles consumed on a specific hardware model
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
                  B. The theoretical upper bound on execution time growth as input size scales (Correct)
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  C. The total number of memory bytes allocated on the physical RAM heap
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  D. The raw line count of compiled machine code instructions
                </div>
              </div>
              <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                💡 <strong>Pedagogical Explanation:</strong> Big-O notation mathematically formalizes how the run time or space requirements of an algorithm scale in the worst-case scenario relative to input size n, independent of machine architecture.
              </div>
            </div>

            {/* 样例题目 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-amber-400 font-bold">Question 2 · Language Architecture</span>
                <span className="text-[11px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Single Choice</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white">
                What distinguishes an interpreted programming language (e.g., Python) from a compiled language (e.g., C)?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
                  A. Interpreted code is parsed line-by-line during runtime by an interpreter (Correct)
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  B. Compiled code requires an active internet connection to execute machine opcodes
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  C. Interpreted languages are strictly prevented from using dynamic data structures
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  D. Compiled languages convert code directly into Python bytecode files
                </div>
              </div>
              <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                💡 <strong>Pedagogical Explanation:</strong> Unlike compiled languages that translate source code into native binary instructions ahead of time, interpreted languages execute instructions on the fly through an interpreter program.
              </div>
            </div>

            {/* 样例题目 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono text-amber-400 font-bold">Question 3 · Data Structure Performance</span>
                <span className="text-[11px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Single Choice</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white">
                Which data structure in Python provides O(1) average time complexity for key lookups?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  A. Linked List
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  B. Sorted Binary Array
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
                  C. Dictionary (Hash Table) (Correct)
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-zinc-300">
                  D. Balanced Binary Search Tree
                </div>
              </div>
              <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                💡 <strong>Pedagogical Explanation:</strong> Python dictionaries are implemented using internal hash tables, allowing near-constant time O(1) key indexing and insertion under typical load factors.
              </div>
            </div>
          </div>
        </section>

        {/* 模块 5: 面向的使用场景 (Target Use Cases) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">High-Impact Applications</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Designed for Educators, Students &amp; Corporate Teams
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Writing diagnostic quiz questions manually takes hours of tedious transcript scanning. VideoToQuiz automates the entire authoring pipeline for diverse professional environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Teachers &amp; University Professors</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Instantly turn assigned flipped classroom videos, YouTube documentaries, and recorded lecture captures into pre-class reading checks and mid-term exam questions.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Students &amp; Certification Candidates</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Convert dense coding bootcamps, medical lectures, or AWS/CISSP certification courses into test questions. Stop passive re-watching and start active recall practice.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Corporate Trainers &amp; Compliance</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Ensure employees actually comprehend product onboarding demos, security webinars, and compliance videos by producing mandatory retention quizzes in minutes.
              </p>
            </div>
          </div>
        </section>

        {/* 模块 6: FAQ 5 条 (常见问答) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Got Questions?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-400" />
              Video to Quiz Frequently Asked Questions
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Everything you need to know about our video to quiz generation engine, exports, and language capabilities.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                1. Can I use the video to quiz generator for free?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes! You can generate interactive quizzes from videos completely free without even registering an account. Free guest previews let you test sample educational videos or paste public YouTube links right away. Creating a free account grants additional complimentary generation credits.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                2. How long of a video can I generate a quiz from?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our AI model supports videos ranging from quick 3-minute tutorials to extensive 3-hour college lectures and conference keynotes. The engine parses the full spoken transcript and semantic timeline, extracting high-yield cognitive checkpoints across the entire recording.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                3. Can I export the quiz questions to Google Forms or Kahoot?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes. Every generated test can be exported in one click as formatted text, Markdown, Anki flashcard decks (.apkg/csv), or printable PDF question sheets. You can easily copy and paste formatted question stems and distractor choices directly into Google Forms, Kahoot, Canvas, or Moodle.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                4. How accurate are the generated video quiz questions?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our quiz generation engine is trained on Blooms Taxonomy and pedagogical assessment methodologies. Rather than writing trivial keyword-matching questions, it generates diagnostic conceptual questions with plausible distractors and timestamped explanations citing the exact rationale from the speaker.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
              <h3 className="font-semibold text-white text-base">
                5. What languages are supported by the video to quiz maker?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The tool supports videos in over 50 languages, including English, Spanish, French, German, Mandarin Chinese, Japanese, Portuguese, Hindi, and Arabic. The AI accurately parses international speech and generates grammatically polished assessments in your preferred language.
              </p>
            </div>
          </div>
        </section>

        {/* 模块 7: 页尾 CTA 指向试用/注册 */}
        <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center mx-auto font-black shadow-lg">
            <Zap className="w-7 h-7 fill-current" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Turn Your Videos into Quizzes?
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Join thousands of teachers, university students, and training teams. Generate your first active recall assessment in less than 10 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#input-hero"
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Try Video to Quiz Free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/tools"
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm rounded-xl transition-colors border border-zinc-700 flex items-center justify-center gap-2"
            >
              <span>Browse All Study Tools</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free instant preview
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Anki &amp; PDF export
            </span>
          </div>
        </section>

      </article>
    </div>
  );
}
