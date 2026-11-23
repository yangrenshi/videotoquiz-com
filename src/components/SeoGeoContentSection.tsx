import React from 'react';
import Link from 'next/link';
import { BookOpen, BrainCircuit, Check, X, HelpCircle, Layers, Award, Sparkles, Zap, Clock, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export default function SeoGeoContentSection() {
  const faqData = [
    {
      q: 'How does the AI Video to Notes Generator work?',
      a: 'The engine ingests video transcripts via high-speed subtitle parsing or speech-to-text models. Large language reasoning models (DeepSeek-V3) evaluate the spoken narration, eliminate filler words, extract core conceptual hierarchies, and automatically organize key takeaways into comprehensive bulleted outlines and Cornell study notes with timestamped references.'
    },
    {
      q: 'Can I format generated notes into Cornell Note-Taking templates?',
      a: 'Yes. Our automated note generation workflow categorizes lecture material into standard Cornell sections: Cues/Keywords in the left margin, detailed Lecture Notes in the main body, and a high-yield 2-3 sentence executive summary at the bottom, making exam review dramatically faster.'
    },
    {
      q: 'Can I export study notes to Markdown, PDF, or Anki flashcards?',
      a: 'Yes. Every generated study guide can be exported with one click into clean Markdown (.md) for Notion/Obsidian, formatted printable PDF worksheets, or direct Anki-compatible flashcard decks (.csv) for spaced repetition memorization.'
    },
    {
      q: 'Does it support long university lectures or webinars exceeding 2 hours?',
      a: 'Yes. The system processes videos ranging from brief 5-minute software tutorials to extensive 3-hour academic seminars and keynote talks. Transcripts are chunked semantically to ensure no critical formulas, theorems, or historical context are missed.'
    },
    {
      q: 'What video sources and platforms are supported?',
      a: 'You can paste public YouTube links, web lecture URLs, or directly upload local video/audio files (MP4, MOV, WebM, MP3). If a video lacks captions or has strict geo-blocks, you can paste raw speech transcripts directly into the prompt box.'
    },
    {
      q: 'Can I also generate interactive quizzes from my video notes?',
      a: 'Yes! If you prefer active recall testing and multiple-choice diagnostics rather than reading outlines, use our dedicated Video to Quiz Generator to turn any video into practice exam questions in seconds.'
    }
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <section className="w-full mt-16 pt-16 border-t border-zinc-800 text-zinc-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 1. GEO Authoritative Definition Box (聚焦 Video to Notes) */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTHORITATIVE OVERVIEW &amp; DEFINITION</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          What is an AI Video to Notes Generator? (Definition &amp; Architectural Overview)
        </h2>

        {/* Q-A-D-L Answer Box */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl leading-relaxed text-zinc-200">
          <p className="text-sm sm:text-base mb-3">
            An <strong className="text-amber-400 font-semibold">AI Video to Notes Generator</strong> is an intelligent educational productivity system engineered to transform spoken video lectures, webinars, and educational tutorials into structured, high-yield study outlines in under ten seconds.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400">
            By analyzing audio transcripts and utilizing deep neural semantic distillation, the engine filters discursive conversational tangents, organizes core conceptual hierarchies, and formats knowledge into Cornell notes, executive summaries, and flashcards. This eliminates hours of manual transcription while accelerating exam preparation and professional upskilling.
          </p>
        </div>
      </div>

      {/* 2. Three-Step Methodology (聚焦 Video to Notes) */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>ALGORITHMIC WORKFLOW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          How to Convert Any Video into Structured Study Notes (3-Step Guide)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400/80 font-mono">01</span>
              <h3 className="text-base font-bold text-white mt-2 mb-2">Transcript Extraction</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste any video URL or upload your local lecture file. Cloud parsers retrieve synchronized speech transcripts and precise timestamp coordinates instantly.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              Input: URL, MP4 or Transcript
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400/80 font-mono">02</span>
              <h3 className="text-base font-bold text-white mt-2 mb-2">Neural Synthesis &amp; Outlining</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                DeepSeek-V3 evaluates speech transcripts against academic taxonomy. It structures core ideas into bulleted hierarchies, key takeaways, and Cornell note cues.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              Model: DeepSeek-V3 671B MoE
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400/80 font-mono">03</span>
              <h3 className="text-base font-bold text-white mt-2 mb-2">Export to Notion, PDF &amp; Anki</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Review notes in a clean ad-free view, copy structured Markdown directly into Notion or Obsidian, and export flashcards for long-term spaced repetition.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              Output: Markdown / PDF / Anki
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cognitive Science & Structured Notes */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
          <span>COGNITIVE LEARNING SCIENCE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          The Cognitive Science of Video Learning: Structured Notes vs. Passive Watching
        </h2>
        
        <div className="my-6 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 relative">
          <blockquote
            cite="https://doi.org/10.1111/j.1745-6916.2006.00012.x"
            className="text-xs sm:text-sm text-zinc-300 italic border-l-2 border-amber-400 pl-4 my-2 leading-relaxed"
          >
            &quot;Taking a memory test not only assesses what one knows, but also enhances later retention, a phenomenon known as the testing effect. We demonstrate that testing produces robust learning advantages over repeated study sessions.&quot;
          </blockquote>
          <div className="mt-3 text-[11px] text-zinc-400 font-mono flex flex-wrap items-center gap-2">
            <span className="font-semibold text-zinc-300">— Roediger, H. L., &amp; Karpicke, J. D. (2006).</span>
            <span>Perspectives on Psychological Science, 1(3), 181–210.</span>
            <a
              href="https://doi.org/10.1111/j.1745-6916.2006.00012.x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              DOI: 10.1111/j.1745-6916.2006.00012.x
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/50">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-2">
              <X className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Passive Video Watching Pitfalls</span>
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Illusion of Competence:</strong> Learners mistakenly believe they understand material because spoken delivery seems intuitive.</li>
              <li><strong>Rapid Forgetting:</strong> Over 70% of spoken information evaporates within 48 hours without structured organization.</li>
              <li><strong>High Review Costs:</strong> Scrubbing through 2-hour video timelines to locate a single formula wastes critical study time.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/50">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated Study Notes Advantages</span>
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Cornell Structure:</strong> Synthesizes lectures into clear cues, thorough notes, and actionable summaries.</li>
              <li><strong>Searchable Timestamps:</strong> Every core concept links back to the exact video timestamp for instant clarification.</li>
              <li><strong>Seamless Integration:</strong> Export directly to Notion, Obsidian, and Anki for spaced repetition mastery.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Target Audiences & Use Cases */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>AUDIENCE PROFILE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          Who Uses Video to Notes?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">🎓</span>
              <span>University Students &amp; Researchers</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Medical, engineering, and law students reviewing lengthy college recordings. Generate weekly Cornell outlines and revision sheets without spending hours transcribing blackboard lectures.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">💻</span>
              <span>Software Engineers &amp; Tech Upskillers</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Developers following system design talks, coding crash courses, and architecture webinars. Extract syntax snippets, design patterns, and CLI commands into searchable Markdown.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">💼</span>
              <span>Professionals &amp; Knowledge Workers</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Teams summarizing Zoom calls, webinars, and investor meetings. Produce structured executive summaries and action items in seconds for team documentation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">🌐</span>
              <span>Self-Directed Lifelong Learners</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Podcast listeners and documentary buffs digesting hours of content. Capture key arguments, book recommendations, and historical timelines effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Featured Tools & High-Value Internal Links */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ECOSYSTEM OF STUDY TOOLS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          Complementary Study Tools &amp; Popular Curricula
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
          Supercharge your study workflow with specialized tools designed for lectures, active recall testing, and spaced repetition.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 指向 /video-to-quiz 的高权重卡片 */}
          <Link
            href="/video-to-quiz"
            className="group p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-zinc-900/60 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-mono text-amber-400 mb-2 font-semibold">ACTIVE RECALL TESTING</div>
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mb-2">
                Video to Quiz Generator
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Turn any video or lecture into interactive multiple-choice tests with timestamped explanations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] font-mono text-amber-400 flex items-center justify-between">
              <span>Make Video Quiz</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* 指向 /youtube-to-notes */}
          <Link
            href="/youtube-to-notes"
            className="group p-5 rounded-2xl bg-gradient-to-b from-red-500/10 to-zinc-900/60 border border-red-500/30 hover:border-red-400 hover:bg-red-500/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-mono text-red-400 mb-2 font-semibold">YOUTUBE LECTURES</div>
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-red-300 transition-colors mb-2">
                YouTube to Notes Converter
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Convert long YouTube videos, university podcasts, and tutorials into structured study notes and summaries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-red-500/20 text-[11px] font-mono text-red-400 flex items-center justify-between">
              <span>YouTube to Notes</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* 指向 /cornell-notes-generator */}
          <Link
            href="/cornell-notes-generator"
            className="group p-5 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-zinc-900/60 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-mono text-emerald-400 mb-2 font-semibold">NOTE METHODOLOGY</div>
              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors mb-2">
                Cornell Notes Generator
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate 3-column Cornell format notes with cues, structured notes, and summary sections.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
              <span>Cornell Notes</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 6. Comprehensive Educational FAQ Section (聚焦 Video to Notes) */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>KNOWLEDGE BASE &amp; FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          Frequently Asked Questions on Video to Notes
        </h2>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/90">
              <h3 className="text-sm sm:text-base font-semibold text-zinc-100 mb-2">
                {item.q}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Legal, Trust & Security Guarantee */}
      <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Global Compliance &amp; Privacy Assurance</span>
        </div>
        <p className="text-xs text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          VideoToQuiz operates strictly in compliance with YouTube Terms of Service by processing publicly available subtitles and authorized user transcripts. We do not store copyrighted video files. Payments are processed with bank-level encryption via Waffo Pancake.
        </p>
      </div>
    </section>
  );
}
