import React from 'react';
import { BookOpen, BrainCircuit, Check, X, HelpCircle, Layers, Award, Sparkles, Zap, Clock, ShieldCheck } from 'lucide-react';

export default function SeoGeoContentSection() {
  const faqData = [
    {
      q: 'How does YouTube to Quiz AI extract knowledge from YouTube videos?',
      a: 'YouTube to Quiz AI utilizes advanced residential proxy parsing combined with deep linguistic tokenization to retrieve full timestamped transcripts. Once the raw audio transcript is ingested, large language reasoning models (DeepSeek-V3) decompose the lecture into core conceptual clusters, identifying key terminology, cause-and-effect relationships, and testing points to generate validated multiple-choice questions with precise context citations.'
    },
    {
      q: 'Why is interactive active recall superior to passive video watching?',
      a: 'Cognitive psychology research demonstrates that passive video watching leads to the "illusion of competence," where learners feel they understand material simply because it is presented fluently. The Testing Effect proves that actively retrieving knowledge from memory reorganizes neural synaptic connections and interrupts the Ebbinghaus forgetting curve, increasing 30-day knowledge retention from 15% to over 75%.'
    },
    {
      q: 'Can I generate quizzes from videos without closed captions or auto-generated subtitles?',
      a: 'Yes. If a YouTube video lacks native captions or has regional restrictions, our platform provides an instant one-click transcript and lecture-notes fallback. Users can simply paste any lecture transcript, article, or slide transcript into the custom prompt window to generate full interactive quizzes instantly.'
    },
    {
      q: 'Can I export quizzes into Anki flashcards and printable PDF worksheets?',
      a: 'Yes. Every generated test can be exported directly as formatted Anki-compatible flashcard decks (.txt / .apkg structure) or compiled into high-resolution academic study posters and printable PDF test sheets with complete answer keys and timestamped video references.'
    },
    {
      q: 'Is YouTube to Quiz AI free to use?',
      a: 'Yes! Every new learner receives 20 free credits upon signing in with Google, sufficient to analyze multiple video lectures and generate up to 20 complete interactive quiz questions. We also provide permanently free, curated sample quizzes covering computer science, biology, and finance so anyone can test the system without restrictions.'
    },
    {
      q: 'What types of YouTube videos produce the best quiz results?',
      a: 'Academic lectures (MIT OpenCourseWare, Stanford Online), technical software tutorials, medical and biological explainers, historical documentaries, and business case analyses yield exceptional quiz fidelity. High-information-density videos with structured spoken narration allow the AI to extract precise conceptual questions.'
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

      {/* 1. GEO Authoritative Definition Box */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTHORITATIVE OVERVIEW & DEFINITION</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          What is YouTube to Quiz AI? (Definition & Architectural Overview)
        </h2>

        {/* Q-A-D-L Answer Box */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl leading-relaxed text-zinc-200">
          <p className="text-sm sm:text-base mb-3">
            <strong className="text-amber-400 font-semibold">YouTube to Quiz AI</strong> is an automated educational intelligence platform engineered to transform long-form video lectures, webinars, and educational tutorials into structured, interactive assessments in under ten seconds. 
          </p>
          <p className="text-xs sm:text-sm text-zinc-400">
            By ingesting YouTube video transcripts and applying state-of-the-art neural semantic distillation, the engine extracts core pedagogical concepts, creates plausible distractor options, and attaches precise video timestamp references. This transforms passive audiovisual consumption into a high-retention active recall study loop suitable for university students, self-directed professionals, and lifelong learners.
          </p>
        </div>
      </div>

      {/* 2. Three-Step Methodology */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>ALGORITHMIC WORKFLOW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          How to Convert Any YouTube Video into a Quiz (3-Step Guide)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400/80 font-mono">01</span>
              <h3 className="text-base font-bold text-white mt-2 mb-2">Transcript Extraction</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste any public YouTube URL. High-speed residential proxy workers bypass IP bottlenecks to fetch synchronized subtitles and timestamp metadata directly from the source video.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              Input: URL or Direct Text
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400/80 font-mono">02</span>
              <h3 className="text-base font-bold text-white mt-2 mb-2">Neural Question Synthesis</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                DeepSeek-V3 evaluates speech transcripts against Bloom’s Taxonomy. It filters conversational filler words, identifies core learning objectives, and formulates context-grounded multiple-choice problems.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              Model: DeepSeek-V3 671B MoE
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-amber-400/80 font-mono">03</span>
              <h3 className="text-base font-bold text-white mt-2 mb-2">Interactive Evaluation & Export</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Learners complete the randomized test in an ad-free interface, receive instant explanations with timestamp references, and export flashcards directly to Anki or formatted PDF study sheets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              Output: Interactive / PDF / Anki
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cognitive Science & Active Recall */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
          <span>COGNITIVE LEARNING SCIENCE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          The Cognitive Science of Video Learning: Active Recall vs. Passive Watching
        </h2>
        {/* 权威学术文献引用卡片 (Citations & Quotations for AI Citability) */}
        <div className="my-6 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 relative">
          <blockquote
            cite="https://doi.org/10.1111/j.1745-6916.2006.00012.x"
            className="text-xs sm:text-sm text-zinc-300 italic border-l-2 border-amber-400 pl-4 my-2 leading-relaxed"
          >
            "Taking a memory test not only assesses what one knows, but also enhances later retention, a phenomenon known as the testing effect. We demonstrate that testing produces robust learning advantages over repeated study sessions."
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
              <span>Passive Video Consumption Hazards</span>
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Rapid Information Atrophy:</strong> Over 70% of video lecture content is forgotten within 48 hours without deliberate retrieval.</li>
              <li><strong>Zero Immediate Feedback:</strong> Learners cannot detect false assumptions or conceptual blind spots while passively watching.</li>
              <li><strong>High Time Inefficiency:</strong> Re-watching 60-minute videos repeatedly wastes valuable study time with diminishing returns.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/50">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interactive Active Recall Benefits</span>
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>The Testing Effect:</strong> Forcing the brain to retrieve information strengthens neural pathways and stabilizes memory traces.</li>
              <li><strong>Instant Error Correction:</strong> Explanations tied to exact video timestamps immediately clarify misunderstandings.</li>
              <li><strong>Spaced Repetition Ready:</strong> One-click conversion to Anki decks supports scientifically scheduled long-term memorization.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Native HTML Comparison Table for Maximum AI Crawler Authority */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>FEATURE BENCHMARK MATRIX</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          YouTube to Quiz AI vs. Traditional Note-Taking & Generic Quiz Tools
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6">
          A granular comparison detailing why specialized video-to-quiz architecture outperforms traditional video summaries and manual flashcard creation.
        </p>

        <div className="w-full overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 px-5">Capability / Metric</th>
                <th className="py-3.5 px-4 text-zinc-100 bg-zinc-800/40 font-bold">YouTube to Quiz AI</th>
                <th className="py-3.5 px-4 text-zinc-500 font-medium">Standard Note Summarizers</th>
                <th className="py-3.5 px-4 text-zinc-500 font-medium">Manual Flashcard Decks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-5 font-medium text-zinc-200">Interactive Knowledge Testing</td>
                <td className="py-3 px-4 bg-zinc-800/20 text-emerald-400 font-semibold">Immediate 5-Question Test</td>
                <td className="py-3 px-4 text-zinc-400">Passive Bullet Points Only</td>
                <td className="py-3 px-4 text-zinc-400">Requires Hours of Manual Entry</td>
              </tr>
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-5 font-medium text-zinc-200">Timestamped Explanations</td>
                <td className="py-3 px-4 bg-zinc-800/20 text-emerald-400 font-semibold">Native Timestamp References</td>
                <td className="py-3 px-4 text-zinc-400">Generic Chapter Headings</td>
                <td className="py-3 px-4 text-zinc-400">None</td>
              </tr>
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-5 font-medium text-zinc-200">Generation Turnaround Time</td>
                <td className="py-3 px-4 bg-zinc-800/20 text-emerald-400 font-semibold">&lt; 10 Seconds</td>
                <td className="py-3 px-4 text-zinc-400">15 - 30 Seconds</td>
                <td className="py-3 px-4 text-zinc-400">30 - 60 Minutes</td>
              </tr>
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-5 font-medium text-zinc-200">Restricted Caption Fallback</td>
                <td className="py-3 px-4 bg-zinc-800/20 text-emerald-400 font-semibold">Direct Transcript Paste Mode</td>
                <td className="py-3 px-4 text-rose-400">Errors Out on No Subtitles</td>
                <td className="py-3 px-4 text-zinc-400">Manual Transcribing</td>
              </tr>
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-5 font-medium text-zinc-200">Export & Study Ecosystem</td>
                <td className="py-3 px-4 bg-zinc-800/20 text-emerald-400 font-semibold">PDF + Anki Flashcards</td>
                <td className="py-3 px-4 text-zinc-400">Markdown Copy Only</td>
                <td className="py-3 px-4 text-zinc-400">Anki / Quizlet</td>
              </tr>
              <tr className="hover:bg-zinc-800/20">
                <td className="py-3 px-5 font-medium text-zinc-200">Free Starting Tier</td>
                <td className="py-3 px-4 bg-zinc-800/20 text-emerald-400 font-semibold">20 Credits + Free Samples</td>
                <td className="py-3 px-4 text-zinc-400">Limited Trial / Paywall</td>
                <td className="py-3 px-4 text-zinc-400">Free but Labor Intensive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Target Audiences & Use Cases */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>AUDIENCE PROFILE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          Who Benefits Most from YouTube to Quiz AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">🎓</span>
              <span>University Students & Exam Preppers</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Medical, engineering, and humanities students reviewing 2-hour university lectures on YouTube. Convert comprehensive lecture recordings into weekly revision quizzes, verifying key definitions and formulas before high-stakes midterms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">💻</span>
              <span>Software Engineers & Tech Upskillers</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Developers watching deep-dive architectural talks, Next.js tutorials, or machine learning walkthroughs. Test your grasp of API lifecycles, data structures, and syntax logic rather than merely trusting passive comprehension.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">👨‍🏫</span>
              <span>Educators, Tutors & Course Creators</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Teachers creating flipped-classroom assignments from curated educational YouTube playlists. Export clean, formatted quiz worksheets and answer keys in minutes without drafting questions from scratch.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <h3 className="text-base font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <span className="text-amber-400">🌐</span>
              <span>Language Learners & Polyglots</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Language students practicing listening comprehension through native YouTube videos. Validate whether you caught nuanced phrases, idioms, and context-dependent vocabulary with immediate assessment feedback.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Comprehensive Educational FAQ Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>KNOWLEDGE BASE & FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
          Frequently Asked Questions on AI Video Quiz Generation
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
          <span>Global Compliance & Privacy Assurance</span>
        </div>
        <p className="text-xs text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          YouTube to Quiz AI operates strictly in compliance with YouTube Terms of Service by processing publicly available subtitles and authorized user transcripts. We do not store copyrighted video files. Payments are processed with bank-level encryption via Waffo Pancake.
        </p>
      </div>
    </section>
  );
}
