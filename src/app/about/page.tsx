import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, BrainCircuit, Target, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | YouTube to Quiz AI Educational Mission',
  description: 'Learn how YouTube to Quiz AI empowers university students, engineers, and lifelong learners to master video lectures through active recall testing.',
  alternates: {
    canonical: 'https://www.videotoquiz.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-12">
      {/* 头部声明 */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>ABOUT OUR MISSION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Transforming Passive Video Watching into Active Mastery
        </h1>
        <p className="text-sm text-zinc-300 leading-relaxed font-normal">
          YouTube to Quiz AI is engineered by educational technologists and cognitive science researchers dedicated to solving the &quot;illusion of competence&quot; in digital learning.
        </p>
      </div>

      {/* 核心价值观与使命 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Active Recall First</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Passive video re-watching wastes hundreds of hours with 70% forgetting rates. We force the brain to retrieve knowledge through immediate Bloom’s Taxonomy-aligned assessments.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Timestamped Context</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every correct and incorrect answer is anchored to exact video timestamps, eliminating ambiguous guesswork and anchoring understanding in authoritative primary sources.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Respect for Creators</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We do not store or distribute copyrighted video media. We process publicly available transcripts and direct learners straight back to original creator channels and academic institutions.
          </p>
        </div>
      </div>

      {/* 团队与学术承诺 */}
      <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Our Academic Commitment</h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Founded in 2026, our platform serves university students preparing for medical, legal, and engineering examinations across North America, Europe, and Asia. We believe high-tier cognitive tools should be accessible to all, providing permanently free core features and bonus credits for every verified learner.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 font-mono"
          >
            <span>Have questions or need enterprise / university licenses? Contact us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
